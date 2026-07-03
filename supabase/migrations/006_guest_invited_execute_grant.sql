-- guest_invited_to_event is referenced by RLS on rsvps INSERT; callers need EXECUTE.
GRANT EXECUTE ON FUNCTION guest_invited_to_event(uuid, uuid) TO anon, authenticated;
