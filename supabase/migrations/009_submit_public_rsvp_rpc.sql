-- Anon can INSERT rsvps but has no SELECT policy; use SECURITY DEFINER RPC for public RSVP.
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
BEGIN
  IF NOT is_project_published(p_project_id) THEN
    RAISE EXCEPTION 'project not published' USING ERRCODE = '42501';
  END IF;

  IF p_guest_id IS NOT NULL AND NOT guest_invited_to_event(p_guest_id, p_event_id) THEN
    RAISE EXCEPTION 'guest not invited to event' USING ERRCODE = '42501';
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
    p_name,
    p_attending,
    CASE WHEN p_attending THEN p_guest_count ELSE 0 END,
    p_meal_preference,
    p_message
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION submit_public_rsvp(
  uuid, uuid, uuid, text, boolean, integer, text, text
) TO anon, authenticated;
