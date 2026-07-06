import { isAuthDisabled } from "@/lib/auth/disabled";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/** Server reads/writes: admin client when auth is disabled, else user session. */
export async function createAccessClient() {
  if (isAuthDisabled()) return createAdminClient();
  return createClient();
}
