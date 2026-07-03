-- SECURITY DEFINER alone does not bypass RLS on Supabase; disable for this lookup.
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
    SELECT 1
    FROM guest_events ge
    WHERE ge.guest_id = p_guest_id
      AND ge.event_id = p_event_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION guest_invited_to_event(uuid, uuid) TO anon, authenticated;
