-- Viding content parity: events, parents, opening text, per-event RSVP, check-in

-- ---------------------------------------------------------------------------
-- 1. Events table
-- ---------------------------------------------------------------------------

CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  label text NOT NULL,
  datetime timestamptz,
  venue_name text NOT NULL DEFAULT '',
  venue_address text NOT NULL DEFAULT '',
  maps_embed_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX events_project_id_idx ON events (project_id);
CREATE INDEX events_project_sort_idx ON events (project_id, sort_order);

-- ---------------------------------------------------------------------------
-- 2. Guest-event join
-- ---------------------------------------------------------------------------

CREATE TABLE guest_events (
  guest_id uuid NOT NULL REFERENCES guests (id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  PRIMARY KEY (guest_id, event_id)
);

CREATE INDEX guest_events_event_id_idx ON guest_events (event_id);

-- ---------------------------------------------------------------------------
-- 3. Admin settings new columns
-- ---------------------------------------------------------------------------

ALTER TABLE admin_settings
  ADD COLUMN groom_father_name text NOT NULL DEFAULT '',
  ADD COLUMN groom_mother_name text NOT NULL DEFAULT '',
  ADD COLUMN bride_father_name text NOT NULL DEFAULT '',
  ADD COLUMN bride_mother_name text NOT NULL DEFAULT '',
  ADD COLUMN opening_quote text NOT NULL DEFAULT '',
  ADD COLUMN opening_greeting_id text NOT NULL DEFAULT 'Dengan penuh sukacita, kami mengundang Anda untuk hadir dan memberikan doa restu.',
  ADD COLUMN opening_greeting_en text NOT NULL DEFAULT 'With great joy, we invite you to join us and share in our celebration.',
  ADD COLUMN formal_address_id text NOT NULL DEFAULT 'Bapak/Ibu/Saudara/i',
  ADD COLUMN gift_shipping_address text NOT NULL DEFAULT '',
  ADD COLUMN footer_sustainability_id text NOT NULL DEFAULT 'Undangan digital ini menghemat kertas dan membantu menjaga lingkungan.',
  ADD COLUMN footer_sustainability_en text NOT NULL DEFAULT 'This digital invitation saves paper and helps protect the environment.',
  ADD COLUMN footer_credit text NOT NULL DEFAULT 'Made with Invithem',
  ADD COLUMN is_password_protected boolean NOT NULL DEFAULT false,
  ADD COLUMN access_password_hash text;

-- ---------------------------------------------------------------------------
-- 4. RSVPs: per-event + check-in
-- ---------------------------------------------------------------------------

ALTER TABLE rsvps
  ADD COLUMN event_id uuid REFERENCES events (id) ON DELETE CASCADE,
  ADD COLUMN checked_in boolean NOT NULL DEFAULT false,
  ADD COLUMN checked_in_at timestamptz,
  ADD COLUMN checkin_token text;

CREATE UNIQUE INDEX rsvps_checkin_token_idx ON rsvps (checkin_token)
  WHERE checkin_token IS NOT NULL;

CREATE UNIQUE INDEX rsvps_guest_event_idx ON rsvps (guest_id, event_id)
  WHERE guest_id IS NOT NULL AND event_id IS NOT NULL;

CREATE INDEX rsvps_event_id_idx ON rsvps (event_id);

-- ---------------------------------------------------------------------------
-- 5. Data migration: ceremony/reception → events
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  rec RECORD;
  v_akad_id uuid;
  v_resepsi_id uuid;
BEGIN
  FOR rec IN SELECT project_id, * FROM admin_settings LOOP
    INSERT INTO events (project_id, label, datetime, venue_name, venue_address, maps_embed_url, sort_order)
    VALUES (
      rec.project_id,
      'Akad',
      rec.wedding_date,
      rec.ceremony_venue_name,
      rec.ceremony_venue_address,
      COALESCE(rec.ceremony_maps_embed_url, ''),
      0
    )
    RETURNING id INTO v_akad_id;

    INSERT INTO events (project_id, label, datetime, venue_name, venue_address, maps_embed_url, sort_order)
    VALUES (
      rec.project_id,
      'Resepsi',
      rec.wedding_date,
      rec.reception_venue_name,
      rec.reception_venue_address,
      COALESCE(rec.reception_maps_embed_url, ''),
      1
    )
    RETURNING id INTO v_resepsi_id;

    -- Backfill RSVPs to first event (Akad)
    UPDATE rsvps
    SET event_id = v_akad_id
    WHERE project_id = rec.project_id AND event_id IS NULL;

    -- All guests invited to all events (preserves current behavior)
    INSERT INTO guest_events (guest_id, event_id)
    SELECT g.id, e.id
    FROM guests g
    CROSS JOIN events e
    WHERE g.project_id = rec.project_id
      AND e.project_id = rec.project_id
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- 6. Helper functions
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION guest_invited_to_event(p_guest_id uuid, p_event_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('row_security', 'off', true);
  RETURN EXISTS (
    SELECT 1 FROM guest_events ge
    WHERE ge.guest_id = p_guest_id AND ge.event_id = p_event_id
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- 7. Public RPCs
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_project_events(p_project_slug text)
RETURNS SETOF events
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT e.*
  FROM events e
  INNER JOIN projects p ON p.id = e.project_id
  WHERE p.slug = p_project_slug
    AND (p.status = 'published' OR can_access_project(p.id))
  ORDER BY e.sort_order ASC, e.created_at ASC;
$$;

CREATE OR REPLACE FUNCTION get_guest_with_events(p_project_slug text, p_guest_slug text)
RETURNS TABLE (
  id uuid,
  name text,
  project_id uuid,
  slug text,
  event_ids uuid[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    g.id,
    g.name,
    g.project_id,
    g.slug,
    COALESCE(
      ARRAY(
        SELECT ge.event_id
        FROM guest_events ge
        WHERE ge.guest_id = g.id
      ),
      ARRAY[]::uuid[]
    ) AS event_ids
  FROM guests g
  INNER JOIN projects p ON p.id = g.project_id
  WHERE p.slug = p_project_slug
    AND g.slug = p_guest_slug
    AND (p.status = 'published' OR can_access_project(p.id))
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION check_in_guest(p_token text)
RETURNS TABLE (
  success boolean,
  status text,
  guest_name text,
  event_label text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rsvp rsvps%ROWTYPE;
  v_event_label text;
BEGIN
  SELECT r.* INTO v_rsvp
  FROM rsvps r
  WHERE r.checkin_token = p_token
    AND r.attending = true
  LIMIT 1;

  IF v_rsvp.id IS NULL THEN
    RETURN QUERY SELECT false, 'invalid'::text, NULL::text, NULL::text;
    RETURN;
  END IF;

  SELECT e.label INTO v_event_label FROM events e WHERE e.id = v_rsvp.event_id;

  IF v_rsvp.checked_in THEN
    RETURN QUERY SELECT false, 'already_checked_in'::text, v_rsvp.name, v_event_label;
    RETURN;
  END IF;

  UPDATE rsvps
  SET checked_in = true, checked_in_at = now()
  WHERE id = v_rsvp.id;

  RETURN QUERY SELECT true, 'success'::text, v_rsvp.name, v_event_label;
END;
$$;

CREATE OR REPLACE FUNCTION get_checkin_stats(p_project_id uuid)
RETURNS TABLE (checked_in bigint, total_confirmed bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(*) FILTER (WHERE r.checked_in = true),
    COUNT(*) FILTER (WHERE r.attending = true)
  FROM rsvps r
  WHERE r.project_id = p_project_id
    AND can_access_project(p_project_id);
$$;

GRANT EXECUTE ON FUNCTION get_project_events(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_guest_with_events(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION check_in_guest(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_checkin_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION guest_invited_to_event(uuid, uuid) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 8. RLS
-- ---------------------------------------------------------------------------

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can manage events"
  ON events FOR ALL TO authenticated
  USING (can_manage_project(project_id))
  WITH CHECK (can_manage_project(project_id));

CREATE POLICY "Managers can read events"
  ON events FOR SELECT TO authenticated
  USING (can_access_project(project_id));

CREATE POLICY "Managers can manage guest_events"
  ON guest_events FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guests g
      WHERE g.id = guest_id AND can_manage_project(g.project_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM guests g
      WHERE g.id = guest_id AND can_manage_project(g.project_id)
    )
  );

CREATE POLICY "Managers can read guest_events"
  ON guest_events FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guests g
      WHERE g.id = guest_id AND can_access_project(g.project_id)
    )
  );

-- Tighten RSVP insert: must be invited to event (or no guest_id for walk-in)
DROP POLICY IF EXISTS "Public can submit RSVP for published project" ON rsvps;

CREATE POLICY "Public can submit RSVP for published invited event"
  ON rsvps FOR INSERT TO anon, authenticated
  WITH CHECK (
    is_project_published(project_id)
    AND (
      guest_id IS NULL
      OR guest_invited_to_event(guest_id, event_id)
    )
  );
