"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { AdminSettings, Guest, GuestCategory } from "@/lib/types/database";

async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Unauthorized");

  const admin = createAdminClient();
  const { data: settings } = await admin
    .from("admin_settings")
    .select("admin_emails")
    .eq("id", 1)
    .single();

  const emails = (settings?.admin_emails as string[]) ?? [];
  if (!emails.includes(user.email)) throw new Error("Unauthorized");
  return user;
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function getGuests(): Promise<Guest[]> {
  await verifyAdmin();
  const admin = createAdminClient();
  const { data } = await admin
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Guest[]) ?? [];
}

export async function addGuest(
  name: string,
  category: GuestCategory,
  whatsappNumber?: string
) {
  await verifyAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("guests").insert({
    name,
    slug: nanoid(10),
    category,
    whatsapp_number: whatsappNumber || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/guests");
  return { success: true };
}

export async function updateGuest(
  id: string,
  data: { name?: string; category?: GuestCategory; whatsapp_number?: string }
) {
  await verifyAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("guests").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/guests");
  return { success: true };
}

export async function deleteGuest(id: string) {
  await verifyAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("guests").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/guests");
  return { success: true };
}

export async function importGuestsCsv(
  rows: { name: string; category: string; whatsapp_number?: string }[]
) {
  await verifyAdmin();
  const admin = createAdminClient();
  const validCategories = ["family", "friends", "VIP", "colleagues"];
  const inserts = rows
    .filter((r) => r.name.trim())
    .map((r) => ({
      name: r.name.trim(),
      slug: nanoid(10),
      category: validCategories.includes(r.category)
        ? r.category
        : "friends",
      whatsapp_number: r.whatsapp_number?.trim() || null,
    }));

  const { error } = await admin.from("guests").insert(inserts);
  if (error) return { error: error.message };
  revalidatePath("/admin/guests");
  return { success: true, count: inserts.length };
}

export async function getRsvps() {
  await verifyAdmin();
  const admin = createAdminClient();
  const { data } = await admin
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getWishes() {
  await verifyAdmin();
  const admin = createAdminClient();
  const { data } = await admin
    .from("wishes")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function hideWish(id: string, hidden: boolean) {
  await verifyAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("wishes")
    .update({ is_hidden: hidden })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/wishes");
  return { success: true };
}

export async function deleteWish(id: string) {
  await verifyAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("wishes").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/wishes");
  return { success: true };
}

export async function getSettings(): Promise<AdminSettings | null> {
  await verifyAdmin();
  const admin = createAdminClient();
  const { data } = await admin
    .from("admin_settings")
    .select("*")
    .eq("id", 1)
    .single();
  return data as AdminSettings | null;
}

export async function updateSettings(
  settings: Partial<AdminSettings>
) {
  await verifyAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("admin_settings")
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
) {
  await verifyAdmin();
  const admin = createAdminClient();
  const buffer = await file.arrayBuffer();
  const { error } = await admin.storage.from(bucket).upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  });
  if (error) return { error: error.message };
  return { success: true, path };
}

export async function getStats() {
  await verifyAdmin();
  const admin = createAdminClient();
  const [guests, rsvps] = await Promise.all([
    admin.from("guests").select("id", { count: "exact", head: true }),
    admin.from("rsvps").select("*"),
  ]);

  const rsvpData = rsvps.data ?? [];
  const attending = rsvpData.filter((r) => r.attending);
  const notAttending = rsvpData.filter((r) => !r.attending);
  const headcount = attending.reduce(
    (sum, r) => sum + (r.guest_count || 0),
    0
  );

  return {
    totalInvited: guests.count ?? 0,
    totalRsvp: rsvpData.length,
    attending: attending.length,
    notAttending: notAttending.length,
    pending: (guests.count ?? 0) - rsvpData.length,
    headcount,
  };
}
