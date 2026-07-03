"use server";

import { cookies } from "next/headers";
import { generateCheckinToken } from "@/lib/checkin/token";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import bcrypt from "bcryptjs";

export async function submitRsvp(input: {
  projectId: string;
  eventId: string;
  guestId?: string | null;
  name: string;
  attending: boolean;
  guestCount: number;
  mealPreference?: string | null;
  message?: string | null;
}) {
  const supabase = await createClient();

  const { data: rsvpId, error } = await supabase.rpc("submit_public_rsvp", {
    p_project_id: input.projectId,
    p_event_id: input.eventId,
    p_guest_id: input.guestId || null,
    p_name: input.name,
    p_attending: input.attending,
    p_guest_count: input.attending ? input.guestCount : 0,
    p_meal_preference: input.mealPreference || null,
    p_message: input.message || null,
  });

  if (error) {
    if (error.message.includes("unique") || error.code === "23505") {
      return { error: "already_submitted" };
    }
    return { error: error.message };
  }

  let checkinToken: string | null = null;
  if (input.attending && rsvpId) {
    checkinToken = generateCheckinToken(rsvpId);
    const admin = createAdminClient();
    await admin
      .from("rsvps")
      .update({ checkin_token: checkinToken })
      .eq("id", rsvpId);
  }

  return { success: true, checkinToken };
}

export async function verifyProjectPassword(
  projectId: string,
  password: string
) {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("admin_settings")
    .select("access_password_hash, is_password_protected")
    .eq("project_id", projectId)
    .single();

  if (!settings?.is_password_protected || !settings.access_password_hash) {
    return { error: "Password not required" };
  }

  const valid = await bcrypt.compare(password, settings.access_password_hash);
  if (!valid) return { error: "Invalid password" };

  const cookieStore = await cookies();
  cookieStore.set(`invithem_access_${projectId}`, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}
