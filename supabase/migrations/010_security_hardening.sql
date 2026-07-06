-- Security hardening: hide password hash, tighten RPCs, scope check-in.

DROP FUNCTION IF EXISTS check_in_guest(text);

-- 1. Never expose bcrypt hash via public settings RPC
CREATE OR REPLACE FUNCTION get_project_settings(p_project_slug text)
RETURNS SETOF admin_settings
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r admin_settings;
BEGIN
  SELECT s.* INTO r
  FROM admin_settings s
  INNER JOIN projects p ON p.id = s.project_id
  WHERE p.slug = p_project_slug
    AND (p.status = 'published' OR can_access_project(p.id))
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  r.access_password_hash := NULL;
  RETURN NEXT r;
END;
$$;

-- 2. Hide draft projects from anonymous slug lookup
CREATE OR REPLACE FUNCTION get_project_by_slug(p_slug text)
RETURNS TABLE (
  id uuid,
  slug text,
  name text,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.slug, p.name, p.status
  FROM projects p
  WHERE p.slug = p_slug
    AND (p.status = 'published' OR can_access_project(p.id))
  LIMIT 1;
$$;

-- 3. Harden public RSVP: ownership + guest count cap
CREATE OR REPLACE FUNCTION submit_public_rsvp(
  p_project_id uuid,
  p_event_id uuid,
  p_guest_id uuid,
  p_name text,
  p_attending boolean,
  p_guest_count integer,
  p_meal_preference text DEFAULT NULL,
  p_message text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_count integer;
BEGIN
  IF NOT is_project_published(p_project_id) THEN
    RAISE EXCEPTION 'project not published' USING ERRCODE = '42501';
  END IF;

  IF p_event_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM events e
    WHERE e.id = p_event_id AND e.project_id = p_project_id
  ) THEN
    RAISE EXCEPTION 'invalid event for project' USING ERRCODE = '42501';
  END IF;

  IF p_guest_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM guests g
      WHERE g.id = p_guest_id AND g.project_id = p_project_id
    ) THEN
      RAISE EXCEPTION 'invalid guest for project' USING ERRCODE = '42501';
    END IF;
    IF NOT guest_invited_to_event(p_guest_id, p_event_id) THEN
      RAISE EXCEPTION 'guest not invited to event' USING ERRCODE = '42501';
    END IF;
  END IF;

  v_count := CASE WHEN p_attending THEN COALESCE(p_guest_count, 0) ELSE 0 END;
  IF v_count < 0 OR v_count > 10 THEN
    RAISE EXCEPTION 'invalid guest count' USING ERRCODE = '42501';
  END IF;

  IF char_length(trim(COALESCE(p_name, ''))) = 0 OR char_length(p_name) > 200 THEN
    RAISE EXCEPTION 'invalid name' USING ERRCODE = '42501';
  END IF;

  INSERT INTO rsvps (
    project_id,
    event_id,
    guest_id,
    name,
    attending,
    guest_count,
    meal_preference,
    message
  )
  VALUES (
    p_project_id,
    p_event_id,
    p_guest_id,
    trim(p_name),
    p_attending,
    v_count,
    p_meal_preference,
    p_message
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- 4. Scope check-in to project
CREATE OR REPLACE FUNCTION check_in_guest(p_token text, p_project_id uuid)
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
    AND r.project_id = p_project_id
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

GRANT EXECUTE ON FUNCTION check_in_guest(text, uuid) TO anon, authenticated;
