"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { TemplateId } from "@/lib/types/database";
import { isValidTemplateId } from "@/templates/registry";

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

export async function updateTemplateId(templateId: string) {
  await verifyAdmin();
  if (!isValidTemplateId(templateId)) {
    return { error: "Invalid template" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("admin_settings")
    .update({
      template_id: templateId as TemplateId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/design");
  return { success: true };
}
