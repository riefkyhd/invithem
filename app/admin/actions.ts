"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mergeSettings } from "@/lib/content/placeholders";
import {
  assertProjectAccess,
  generateGuestSlug,
  getAuthenticatedUser,
  getUserProjects,
  slugify,
} from "@/lib/projects/access";
import { projectStoragePath } from "@/lib/projects/urls";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  AdminSettings,
  Guest,
  GuestCategory,
  Project,
  TemplateId,
} from "@/lib/types/database";
import { isValidTemplateId } from "@/templates/registry";

function revalidateProject(projectId: string, projectSlug?: string) {
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/admin/projects/${projectId}/settings`);
  revalidatePath(`/admin/projects/${projectId}/guests`);
  revalidatePath(`/admin/projects/${projectId}/rsvps`);
  revalidatePath(`/admin/projects/${projectId}/wishes`);
  revalidatePath(`/admin/projects/${projectId}/design`);
  if (projectSlug) {
    revalidatePath(`/w/${projectSlug}`);
  }
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

export async function listProjects(): Promise<Project[]> {
  const projects = await getUserProjects();
  return projects as Project[];
}

export async function getProject(projectId: string): Promise<Project | null> {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();
  return data as Project | null;
}

export async function createProject(name: string, slugInput: string) {
  const user = await getAuthenticatedUser();
  const slug = slugify(slugInput || name);
  if (!slug) return { error: "Invalid slug" };

  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      owner_id: user.id,
      name: name.trim(),
      slug,
      status: "draft",
    })
    .select()
    .single();

  if (error) return { error: error.message };

  const { error: settingsError } = await supabase.from("admin_settings").insert({
    project_id: project.id,
    template_id: "reference",
  });

  if (settingsError) return { error: settingsError.message };

  await supabase.from("project_collaborators").insert({
    project_id: project.id,
    user_id: user.id,
    role: "owner",
  });

  revalidatePath("/admin/projects");
  return { success: true, project: project as Project };
}

export async function duplicateProject(sourceProjectId: string, name: string, slugInput: string) {
  await assertProjectAccess(sourceProjectId);
  const slug = slugify(slugInput || name);
  if (!slug) return { error: "Invalid slug" };

  const user = await getAuthenticatedUser();
  const supabase = await createClient();

  const { data: sourceSettings } = await supabase
    .from("admin_settings")
    .select("*")
    .eq("project_id", sourceProjectId)
    .single();

  if (!sourceSettings) return { error: "Source project not found" };

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      owner_id: user.id,
      name: name.trim(),
      slug,
      status: "draft",
    })
    .select()
    .single();

  if (error) return { error: error.message };

  const { project_id: _pid, updated_at: _ua, ...settingsCopy } = sourceSettings;
  const { error: settingsError } = await supabase.from("admin_settings").insert({
    ...settingsCopy,
    project_id: project.id,
    updated_at: new Date().toISOString(),
  });

  if (settingsError) return { error: settingsError.message };

  await supabase.from("project_collaborators").insert({
    project_id: project.id,
    user_id: user.id,
    role: "owner",
  });

  revalidatePath("/admin/projects");
  return { success: true, project: project as Project };
}

export async function updateProjectStatus(
  projectId: string,
  status: "draft" | "published" | "archived"
) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select("slug")
    .single();

  if (!project) return { error: "Update failed" };
  revalidateProject(projectId, project.slug);
  return { success: true };
}

export async function getGuests(projectId: string): Promise<Guest[]> {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { data } = await supabase
    .from("guests")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  return (data as Guest[]) ?? [];
}

export async function addGuest(
  projectId: string,
  name: string,
  category: GuestCategory,
  whatsappNumber?: string
) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const slug = await generateGuestSlug(supabase, projectId, name);
  const { error } = await supabase.from("guests").insert({
    project_id: projectId,
    name,
    slug,
    category,
    whatsapp_number: whatsappNumber || null,
  });
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { success: true };
}

export async function updateGuest(
  projectId: string,
  id: string,
  data: { name?: string; category?: GuestCategory; whatsapp_number?: string }
) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { error } = await supabase
    .from("guests")
    .update(data)
    .eq("id", id)
    .eq("project_id", projectId);
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { success: true };
}

export async function deleteGuest(projectId: string, id: string) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { error } = await supabase
    .from("guests")
    .delete()
    .eq("id", id)
    .eq("project_id", projectId);
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { success: true };
}

export async function importGuestsCsv(
  projectId: string,
  rows: { name: string; category: string; whatsapp_number?: string }[]
) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const validCategories = ["family", "friends", "VIP", "colleagues"];
  const reserved = new Set<string>();
  const inserts = [];

  for (const r of rows) {
    if (!r.name.trim()) continue;
    const slug = await generateGuestSlug(supabase, projectId, r.name, reserved);
    reserved.add(slug);
    inserts.push({
      project_id: projectId,
      name: r.name.trim(),
      slug,
      category: validCategories.includes(r.category) ? r.category : "friends",
      whatsapp_number: r.whatsapp_number?.trim() || null,
    });
  }

  if (inserts.length === 0) return { success: true, count: 0 };

  const { error } = await supabase.from("guests").insert(inserts);
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { success: true, count: inserts.length };
}

export async function getRsvps(projectId: string) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { data } = await supabase
    .from("rsvps")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getWishes(projectId: string) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { data } = await supabase
    .from("wishes")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function hideWish(projectId: string, id: string, hidden: boolean) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { error } = await supabase
    .from("wishes")
    .update({ is_hidden: hidden })
    .eq("id", id)
    .eq("project_id", projectId);
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { success: true };
}

export async function deleteWish(projectId: string, id: string) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { error } = await supabase
    .from("wishes")
    .delete()
    .eq("id", id)
    .eq("project_id", projectId);
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { success: true };
}

export async function getSettings(projectId: string): Promise<AdminSettings | null> {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { data } = await supabase
    .from("admin_settings")
    .select("*")
    .eq("project_id", projectId)
    .single();
  return mergeSettings(data as AdminSettings | null);
}

export async function updateSettings(
  projectId: string,
  settings: Partial<AdminSettings>
) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", projectId)
    .single();

  const { project_id: _pid, ...rest } = settings as Partial<AdminSettings> & {
    project_id?: string;
  };

  const { error } = await supabase
    .from("admin_settings")
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq("project_id", projectId);

  if (error) return { error: error.message };
  revalidateProject(projectId, project?.slug);
  return { success: true };
}

export async function updateTemplateId(projectId: string, templateId: string) {
  await assertProjectAccess(projectId);
  if (!isValidTemplateId(templateId)) return { error: "Invalid template" };

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", projectId)
    .single();

  const { error } = await supabase
    .from("admin_settings")
    .update({
      template_id: templateId as TemplateId,
      updated_at: new Date().toISOString(),
    })
    .eq("project_id", projectId);

  if (error) return { error: error.message };
  revalidateProject(projectId, project?.slug);
  return { success: true };
}

export async function uploadFile(
  projectId: string,
  bucket: string,
  filename: string,
  file: File
) {
  await assertProjectAccess(projectId);
  const admin = createAdminClient();
  const path = projectStoragePath(projectId, filename);
  const buffer = await file.arrayBuffer();
  const { error } = await admin.storage.from(bucket).upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  });
  if (error) return { error: error.message };
  return { success: true, path };
}

export async function getStats(projectId: string) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();

  const [guests, rsvps, views] = await Promise.all([
    supabase
      .from("guests")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId),
    supabase.from("rsvps").select("*").eq("project_id", projectId),
    supabase
      .from("invitation_views")
      .select("guest_id")
      .eq("project_id", projectId),
  ]);

  const rsvpData = rsvps.data ?? [];
  const attending = rsvpData.filter((r) => r.attending);
  const notAttending = rsvpData.filter((r) => !r.attending);
  const headcount = attending.reduce(
    (sum, r) => sum + (r.guest_count || 0),
    0
  );

  const uniqueViews = new Set(
    (views.data ?? []).map((v) => v.guest_id)
  ).size;

  return {
    totalInvited: guests.count ?? 0,
    totalRsvp: rsvpData.length,
    attending: attending.length,
    notAttending: notAttending.length,
    pending: (guests.count ?? 0) - rsvpData.length,
    headcount,
    openedInvitations: uniqueViews,
  };
}

export async function getGettingStartedProgress(projectId: string) {
  const settings = await getSettings(projectId);
  const guests = await getGuests(projectId);
  const project = await getProject(projectId);

  const hasNames =
    !!settings &&
    !settings.groom_name.startsWith("[FILL IN") &&
    !settings.bride_name.startsWith("[FILL IN");
  const hasEvent =
    !!settings &&
    !settings.ceremony_venue_name.startsWith("[FILL IN") &&
    !settings.reception_venue_name.startsWith("[FILL IN");
  const hasGuest = guests.length > 0;
  const isPublished = project?.status === "published";

  return {
    hasNames,
    hasTemplate: !!settings?.template_id,
    hasEvent,
    hasGuest,
    isPublished,
    completed: hasNames && hasEvent && hasGuest && isPublished,
  };
}
