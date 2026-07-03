-- Multi-project migration: projects, collaborators, project_id scoping, RLS rewrite

-- ---------------------------------------------------------------------------
-- 1. New tables
-- ---------------------------------------------------------------------------

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX projects_owner_id_idx ON projects (owner_id);
CREATE INDEX projects_slug_idx ON projects (slug);

CREATE TABLE project_collaborators (
  project_id uuid NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'editor'
    CHECK (role IN ('owner', 'editor')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

CREATE INDEX project_collaborators_user_id_idx ON project_collaborators (user_id);

-- ---------------------------------------------------------------------------
-- 2. Migrate singleton data into first project
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  v_project_id uuid := gen_random_uuid();
  v_owner_id uuid;
BEGIN
  SELECT id INTO v_owner_id FROM auth.users ORDER BY created_at ASC LIMIT 1;

  IF v_owner_id IS NULL THEN
    RAISE NOTICE 'No auth.users row found — set projects.owner_id manually after first signup';
    v_owner_id := '00000000-0000-0000-0000-000000000000'::uuid;
  END IF;

  INSERT INTO projects (id, owner_id, name, slug, status)
  VALUES (
    v_project_id,
    v_owner_id,
    'My Wedding',
    'my-wedding',
    'published'
  );

  IF v_owner_id != '00000000-0000-0000-0000-000000000000'::uuid THEN
    INSERT INTO project_collaborators (project_id, user_id, role)
    VALUES (v_project_id, v_owner_id, 'owner');
  END IF;

  -- admin_settings: add project_id, backfill, re-key
  ALTER TABLE admin_settings ADD COLUMN project_id uuid;

  UPDATE admin_settings SET project_id = v_project_id WHERE project_id IS NULL;

  ALTER TABLE admin_settings ALTER COLUMN project_id SET NOT NULL;
  ALTER TABLE admin_settings DROP CONSTRAINT admin_settings_pkey;
  ALTER TABLE admin_settings DROP CONSTRAINT IF EXISTS admin_settings_id_check;
  ALTER TABLE admin_settings DROP COLUMN id;
  ALTER TABLE admin_settings ADD PRIMARY KEY (project_id);
  ALTER TABLE admin_settings
    ADD CONSTRAINT admin_settings_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE;

  -- guests
  ALTER TABLE guests ADD COLUMN project_id uuid;
  UPDATE guests SET project_id = v_project_id WHERE project_id IS NULL;
  ALTER TABLE guests ALTER COLUMN project_id SET NOT NULL;
  ALTER TABLE guests DROP CONSTRAINT IF EXISTS guests_slug_key;
  DROP INDEX IF EXISTS guests_slug_idx;
  CREATE UNIQUE INDEX guests_project_slug_idx ON guests (project_id, slug);
  CREATE INDEX guests_project_id_idx ON guests (project_id);
  ALTER TABLE guests
    ADD CONSTRAINT guests_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE;

  -- rsvps
  ALTER TABLE rsvps ADD COLUMN project_id uuid;
  UPDATE rsvps r
  SET project_id = COALESCE(
    (SELECT g.project_id FROM guests g WHERE g.id = r.guest_id),
    v_project_id
  )
  WHERE r.project_id IS NULL;
  ALTER TABLE rsvps ALTER COLUMN project_id SET NOT NULL;
  CREATE INDEX rsvps_project_id_idx ON rsvps (project_id);
  ALTER TABLE rsvps
    ADD CONSTRAINT rsvps_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE;

  -- wishes
  ALTER TABLE wishes ADD COLUMN project_id uuid;
  UPDATE wishes SET project_id = v_project_id WHERE project_id IS NULL;
  ALTER TABLE wishes ALTER COLUMN project_id SET NOT NULL;
  CREATE INDEX wishes_project_id_idx ON wishes (project_id);
  ALTER TABLE wishes
    ADD CONSTRAINT wishes_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE;
END $$;

-- Drop legacy admin_emails
ALTER TABLE admin_settings DROP COLUMN IF EXISTS admin_emails;

-- invitation_views for open-tracking
CREATE TABLE invitation_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  guest_id uuid NOT NULL REFERENCES guests (id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX invitation_views_project_id_idx ON invitation_views (project_id);
CREATE INDEX invitation_views_guest_id_idx ON invitation_views (guest_id);

CREATE UNIQUE INDEX invitation_views_guest_day_idx
  ON invitation_views (guest_id, ((viewed_at AT TIME ZONE 'UTC')::date));

-- ---------------------------------------------------------------------------
-- 3. Access helper functions
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION can_access_project(p_project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = p_project_id
      AND p.owner_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM project_collaborators pc
    WHERE pc.project_id = p_project_id
      AND pc.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION can_manage_project(p_project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = p_project_id
      AND p.owner_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM project_collaborators pc
    WHERE pc.project_id = p_project_id
      AND pc.user_id = auth.uid()
      AND pc.role IN ('owner', 'editor')
  );
$$;

CREATE OR REPLACE FUNCTION is_project_published(p_project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = p_project_id AND p.status = 'published'
  );
$$;

CREATE OR REPLACE FUNCTION storage_project_id_from_path(p_path text)
RETURNS uuid
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_segment text;
BEGIN
  v_segment := split_part(p_path, '/', 1);
  IF v_segment ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RETURN v_segment::uuid;
  END IF;
  RETURN NULL;
END;
$$;

-- Drop legacy functions (policies must be dropped first — see 004b if re-running)
DROP POLICY IF EXISTS "Public can read settings" ON admin_settings;

-- ---------------------------------------------------------------------------
-- 4. Public RPCs (SECURITY DEFINER, scoped)
-- ---------------------------------------------------------------------------

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
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION get_guest_by_slug(p_project_slug text, p_guest_slug text)
RETURNS TABLE (
  id uuid,
  name text,
  project_id uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT g.id, g.name, g.project_id
  FROM guests g
  INNER JOIN projects p ON p.id = g.project_id
  WHERE p.slug = p_project_slug
    AND g.slug = p_guest_slug
    AND (p.status = 'published' OR can_access_project(p.id))
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION get_project_settings(p_project_slug text)
RETURNS SETOF admin_settings
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.*
  FROM admin_settings s
  INNER JOIN projects p ON p.id = s.project_id
  WHERE p.slug = p_project_slug
    AND (p.status = 'published' OR can_access_project(p.id));
$$;

CREATE OR REPLACE FUNCTION get_project_wishes(p_project_slug text)
RETURNS SETOF wishes
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT w.*
  FROM wishes w
  INNER JOIN projects p ON p.id = w.project_id
  WHERE p.slug = p_project_slug
    AND NOT w.is_hidden
    AND (p.status = 'published' OR can_access_project(p.id))
  ORDER BY w.created_at DESC
  LIMIT 50;
$$;

CREATE OR REPLACE FUNCTION log_invitation_view(p_guest_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_project_id uuid;
BEGIN
  SELECT g.project_id INTO v_project_id
  FROM guests g
  INNER JOIN projects p ON p.id = g.project_id
  WHERE g.id = p_guest_id AND p.status = 'published';

  IF v_project_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO invitation_views (project_id, guest_id)
  VALUES (v_project_id, p_guest_id)
  ON CONFLICT DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION get_project_by_slug(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_guest_by_slug(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_project_settings(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_project_wishes(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION log_invitation_view(uuid) TO anon, authenticated;
REVOKE EXECUTE ON FUNCTION can_access_project(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION can_manage_project(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION is_project_published(uuid) FROM PUBLIC, anon;

-- ---------------------------------------------------------------------------
-- 5. RLS rewrite
-- ---------------------------------------------------------------------------

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_views ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Public can read settings" ON admin_settings;
DROP POLICY IF EXISTS "Admins can update settings" ON admin_settings;
DROP POLICY IF EXISTS "Admins can select guests" ON guests;
DROP POLICY IF EXISTS "Admins can insert guests" ON guests;
DROP POLICY IF EXISTS "Admins can update guests" ON guests;
DROP POLICY IF EXISTS "Admins can delete guests" ON guests;
DROP POLICY IF EXISTS "Anyone can submit RSVP" ON rsvps;
DROP POLICY IF EXISTS "Admins can read RSVPs" ON rsvps;
DROP POLICY IF EXISTS "Anyone can submit wish" ON wishes;
DROP POLICY IF EXISTS "Public can read visible wishes" ON wishes;
DROP POLICY IF EXISTS "Admins can update wishes" ON wishes;
DROP POLICY IF EXISTS "Admins can delete wishes" ON wishes;

-- projects
CREATE POLICY "Users can read own projects"
  ON projects FOR SELECT TO authenticated
  USING (can_access_project(id));

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update projects"
  ON projects FOR UPDATE TO authenticated
  USING (can_manage_project(id))
  WITH CHECK (can_manage_project(id));

CREATE POLICY "Owners can delete projects"
  ON projects FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

-- project_collaborators
CREATE POLICY "Members can read collaborators"
  ON project_collaborators FOR SELECT TO authenticated
  USING (can_access_project(project_id));

CREATE POLICY "Owners can manage collaborators"
  ON project_collaborators FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id AND p.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id AND p.owner_id = auth.uid()
    )
  );

-- admin_settings
CREATE POLICY "Managers can read settings"
  ON admin_settings FOR SELECT TO authenticated
  USING (can_access_project(project_id));

CREATE POLICY "Managers can update settings"
  ON admin_settings FOR UPDATE TO authenticated
  USING (can_manage_project(project_id))
  WITH CHECK (can_manage_project(project_id));

CREATE POLICY "Managers can insert settings"
  ON admin_settings FOR INSERT TO authenticated
  WITH CHECK (can_manage_project(project_id));

-- guests
CREATE POLICY "Managers can select guests"
  ON guests FOR SELECT TO authenticated
  USING (can_access_project(project_id));

CREATE POLICY "Managers can insert guests"
  ON guests FOR INSERT TO authenticated
  WITH CHECK (can_manage_project(project_id));

CREATE POLICY "Managers can update guests"
  ON guests FOR UPDATE TO authenticated
  USING (can_manage_project(project_id))
  WITH CHECK (can_manage_project(project_id));

CREATE POLICY "Managers can delete guests"
  ON guests FOR DELETE TO authenticated
  USING (can_manage_project(project_id));

-- rsvps
CREATE POLICY "Public can submit RSVP for published project"
  ON rsvps FOR INSERT TO anon, authenticated
  WITH CHECK (is_project_published(project_id));

CREATE POLICY "Managers can read RSVPs"
  ON rsvps FOR SELECT TO authenticated
  USING (can_access_project(project_id));

-- wishes
CREATE POLICY "Public can submit wish for published project"
  ON wishes FOR INSERT TO anon, authenticated
  WITH CHECK (is_project_published(project_id));

CREATE POLICY "Managers can read all wishes"
  ON wishes FOR SELECT TO authenticated
  USING (can_access_project(project_id));

CREATE POLICY "Managers can update wishes"
  ON wishes FOR UPDATE TO authenticated
  USING (can_manage_project(project_id))
  WITH CHECK (can_manage_project(project_id));

CREATE POLICY "Managers can delete wishes"
  ON wishes FOR DELETE TO authenticated
  USING (can_manage_project(project_id));

-- invitation_views
CREATE POLICY "Managers can read invitation views"
  ON invitation_views FOR SELECT TO authenticated
  USING (can_access_project(project_id));

CREATE POLICY "Public can log invitation views"
  ON invitation_views FOR INSERT TO anon, authenticated
  WITH CHECK (is_project_published(project_id));

-- ---------------------------------------------------------------------------
-- 6. Storage policies rewrite
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Admins can upload gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload music" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update music" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete music" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload story" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update story" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete story" ON storage.objects;

CREATE POLICY "Managers can upload gallery"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'gallery'
    AND can_manage_project(storage_project_id_from_path(name))
  );

CREATE POLICY "Managers can update gallery"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'gallery'
    AND can_manage_project(storage_project_id_from_path(name))
  );

CREATE POLICY "Managers can delete gallery"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'gallery'
    AND can_manage_project(storage_project_id_from_path(name))
  );

CREATE POLICY "Managers can upload music"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'music'
    AND can_manage_project(storage_project_id_from_path(name))
  );

CREATE POLICY "Managers can update music"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'music'
    AND can_manage_project(storage_project_id_from_path(name))
  );

CREATE POLICY "Managers can delete music"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'music'
    AND can_manage_project(storage_project_id_from_path(name))
  );

CREATE POLICY "Managers can upload story"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'story'
    AND can_manage_project(storage_project_id_from_path(name))
  );

CREATE POLICY "Managers can update story"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'story'
    AND can_manage_project(storage_project_id_from_path(name))
  );

CREATE POLICY "Managers can delete story"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'story'
    AND can_manage_project(storage_project_id_from_path(name))
  );

-- Legacy flat paths (no UUID prefix): allow any authenticated manager
-- who can manage at least one project (upload during transition)
CREATE POLICY "Managers can upload legacy gallery"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'gallery'
    AND storage_project_id_from_path(name) IS NULL
    AND EXISTS (SELECT 1 FROM projects p WHERE p.owner_id = auth.uid())
  );

CREATE POLICY "Managers can update legacy gallery"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'gallery'
    AND storage_project_id_from_path(name) IS NULL
    AND EXISTS (SELECT 1 FROM projects p WHERE p.owner_id = auth.uid())
  );

CREATE POLICY "Managers can delete legacy gallery"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'gallery'
    AND storage_project_id_from_path(name) IS NULL
    AND EXISTS (SELECT 1 FROM projects p WHERE p.owner_id = auth.uid())
  );

CREATE POLICY "Managers can upload legacy music"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'music'
    AND storage_project_id_from_path(name) IS NULL
    AND EXISTS (SELECT 1 FROM projects p WHERE p.owner_id = auth.uid())
  );

CREATE POLICY "Managers can update legacy music"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'music'
    AND storage_project_id_from_path(name) IS NULL
    AND EXISTS (SELECT 1 FROM projects p WHERE p.owner_id = auth.uid())
  );

CREATE POLICY "Managers can delete legacy music"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'music'
    AND storage_project_id_from_path(name) IS NULL
    AND EXISTS (SELECT 1 FROM projects p WHERE p.owner_id = auth.uid())
  );

CREATE POLICY "Managers can upload legacy story"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'story'
    AND storage_project_id_from_path(name) IS NULL
    AND EXISTS (SELECT 1 FROM projects p WHERE p.owner_id = auth.uid())
  );

CREATE POLICY "Managers can update legacy story"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'story'
    AND storage_project_id_from_path(name) IS NULL
    AND EXISTS (SELECT 1 FROM projects p WHERE p.owner_id = auth.uid())
  );

CREATE POLICY "Managers can delete legacy story"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'story'
    AND storage_project_id_from_path(name) IS NULL
    AND EXISTS (SELECT 1 FROM projects p WHERE p.owner_id = auth.uid())
  );
