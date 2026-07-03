-- RLS policies on rsvps call is_project_published; anon must be able to execute it.
GRANT EXECUTE ON FUNCTION is_project_published(uuid) TO anon, authenticated;
