-- Storage buckets for wedding media

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('gallery', 'gallery', true),
  ('music', 'music', true),
  ('story', 'story', true)
ON CONFLICT (id) DO NOTHING;

-- Gallery: public read, authenticated admin write
CREATE POLICY "Public can view gallery"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND is_admin());

CREATE POLICY "Admins can update gallery"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery' AND is_admin());

CREATE POLICY "Admins can delete gallery"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery' AND is_admin());

-- Music bucket policies
CREATE POLICY "Public can view music"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'music');

CREATE POLICY "Admins can upload music"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'music' AND is_admin());

CREATE POLICY "Admins can update music"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'music' AND is_admin());

CREATE POLICY "Admins can delete music"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'music' AND is_admin());

-- Story bucket policies
CREATE POLICY "Public can view story"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'story');

CREATE POLICY "Admins can upload story"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'story' AND is_admin());

CREATE POLICY "Admins can update story"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'story' AND is_admin());

CREATE POLICY "Admins can delete story"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'story' AND is_admin());
