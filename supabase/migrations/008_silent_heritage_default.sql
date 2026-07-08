-- New projects default to Silent Heritage template.
ALTER TABLE admin_settings
  ALTER COLUMN template_id SET DEFAULT 'silent-heritage';
