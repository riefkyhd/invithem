-- Invithem initial schema

-- Admin settings (single row)
CREATE TABLE admin_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  groom_name text NOT NULL DEFAULT '[FILL IN: Groom]',
  bride_name text NOT NULL DEFAULT '[FILL IN: Bride]',
  wedding_date timestamptz NOT NULL DEFAULT '2026-11-15T09:00:00+07:00',
  ceremony_time text NOT NULL DEFAULT '[FILL IN: 09:00 WIB]',
  ceremony_venue_name text NOT NULL DEFAULT '[FILL IN: Ceremony Venue]',
  ceremony_venue_address text NOT NULL DEFAULT '[FILL IN: Ceremony Address]',
  ceremony_maps_embed_url text DEFAULT '',
  reception_time text NOT NULL DEFAULT '[FILL IN: 11:00 WIB]',
  reception_venue_name text NOT NULL DEFAULT '[FILL IN: Reception Venue]',
  reception_venue_address text NOT NULL DEFAULT '[FILL IN: Reception Address]',
  reception_maps_embed_url text DEFAULT '',
  story_milestones jsonb NOT NULL DEFAULT '[]'::jsonb,
  livestream_url text DEFAULT '',
  bank_accounts jsonb NOT NULL DEFAULT '[]'::jsonb,
  music_path text DEFAULT '',
  gallery_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  whatsapp_number text DEFAULT '',
  admin_emails jsonb NOT NULL DEFAULT '[]'::jsonb,
  share_message_id text DEFAULT 'Kami mengundang Anda untuk merayakan pernikahan kami.',
  share_message_en text DEFAULT 'We invite you to celebrate our wedding.',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO admin_settings (id) VALUES (1);

-- Guests
CREATE TABLE guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'friends' CHECK (category IN ('family', 'friends', 'VIP', 'colleagues')),
  whatsapp_number text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX guests_slug_idx ON guests (slug);

-- RSVPs
CREATE TABLE rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid REFERENCES guests (id) ON DELETE SET NULL,
  name text NOT NULL,
  attending boolean NOT NULL,
  guest_count int NOT NULL DEFAULT 1 CHECK (guest_count >= 0 AND guest_count <= 2),
  meal_preference text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX rsvps_guest_id_idx ON rsvps (guest_id);
CREATE INDEX rsvps_created_at_idx ON rsvps (created_at DESC);

-- Wishes
CREATE TABLE wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  is_hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX wishes_visible_created_at_idx ON wishes (created_at DESC) WHERE NOT is_hidden;

-- Admin check helper
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM admin_settings
    WHERE (auth.jwt() ->> 'email') = ANY (
      SELECT jsonb_array_elements_text(admin_emails)
    )
  );
$$;

-- Public guest lookup by slug (no full list exposure)
CREATE OR REPLACE FUNCTION get_guest_by_slug(p_slug text)
RETURNS TABLE (id uuid, name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT g.id, g.name
  FROM guests g
  WHERE g.slug = p_slug
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION get_guest_by_slug(text) TO anon, authenticated;
REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC, anon, authenticated;

-- RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- admin_settings: public read, admin update
CREATE POLICY "Public can read settings"
  ON admin_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can update settings"
  ON admin_settings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- guests: admin only direct access
CREATE POLICY "Admins can select guests"
  ON guests FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert guests"
  ON guests FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update guests"
  ON guests FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete guests"
  ON guests FOR DELETE
  TO authenticated
  USING (is_admin());

-- rsvps: public insert, admin read
CREATE POLICY "Anyone can submit RSVP"
  ON rsvps FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read RSVPs"
  ON rsvps FOR SELECT
  TO authenticated
  USING (is_admin());

-- wishes: public insert + read visible, admin moderate
CREATE POLICY "Anyone can submit wish"
  ON wishes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can read visible wishes"
  ON wishes FOR SELECT
  TO anon, authenticated
  USING (NOT is_hidden OR is_admin());

CREATE POLICY "Admins can update wishes"
  ON wishes FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete wishes"
  ON wishes FOR DELETE
  TO authenticated
  USING (is_admin());

-- Storage buckets (run via Supabase dashboard or storage API)
-- gallery, music, story buckets with public read
