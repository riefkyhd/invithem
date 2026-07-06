"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mergeSettings } from "@/lib/content/placeholders";
import { pickUpdatableSettings } from "@/lib/admin/settings-allowlist";
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
  WeddingEvent,
} from "@/lib/types/database";
import { isValidTemplateId } from "@/templates/registry";
import bcrypt from "bcryptjs";

function revalidateProject(projectId: string, projectSlug?: string) {
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/admin/projects/${projectId}/settings`);
  revalidatePath(`/admin/projects/${projectId}/guests`);
  revalidatePath(`/admin/projects/${projectId}/rsvps`);
  revalidatePath(`/admin/projects/${projectId}/wishes`);
  revalidatePath(`/admin/projects/${projectId}/design`);
  revalidatePath(`/admin/projects/${projectId}/checkin`);
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
  const { data: guests } = await supabase
    .from("guests")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  const { data: guestEvents } = await supabase
    .from("guest_events")
    .select("guest_id, event_id")
    .in(
      "guest_id",
      (guests ?? []).map((g) => g.id)
    );

  const eventMap = new Map<string, string[]>();
  for (const ge of guestEvents ?? []) {
    const list = eventMap.get(ge.guest_id) ?? [];
    list.push(ge.event_id);
    eventMap.set(ge.guest_id, list);
  }

  return (guests ?? []).map((g) => ({
    ...(g as Guest),
    event_ids: eventMap.get(g.id) ?? [],
  }));
}

export async function getEvents(projectId: string): Promise<WeddingEvent[]> {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });
  return (data as WeddingEvent[]) ?? [];
}

export async function upsertEvents(
  projectId: string,
  events: Omit<WeddingEvent, "created_at" | "project_id">[]
) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("events")
    .select("id")
    .eq("project_id", projectId);

  const existingIds = new Set((existing ?? []).map((e) => e.id));
  const incomingIds = new Set(events.filter((e) => e.id).map((e) => e.id));

  const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
  if (toDelete.length > 0) {
    await supabase.from("events").delete().in("id", toDelete);
  }

  for (const [index, event] of events.entries()) {
    const payload = {
      project_id: projectId,
      label: event.label,
      datetime: event.datetime,
      venue_name: event.venue_name,
      venue_address: event.venue_address,
      maps_embed_url: event.maps_embed_url,
      sort_order: index,
    };

    if (event.id && existingIds.has(event.id)) {
      await supabase.from("events").update(payload).eq("id", event.id);
    } else {
      await supabase.from("events").insert(payload);
    }
  }

  revalidateProject(projectId);
  return { success: true };
}

async function setGuestEvents(
  supabase: Awaited<ReturnType<typeof createClient>>,
  guestId: string,
  eventIds: string[]
) {
  await supabase.from("guest_events").delete().eq("guest_id", guestId);
  if (eventIds.length > 0) {
    await supabase.from("guest_events").insert(
      eventIds.map((eventId) => ({ guest_id: guestId, event_id: eventId }))
    );
  }
}

export async function addGuest(
  projectId: string,
  name: string,
  category: GuestCategory,
  whatsappNumber?: string,
  eventIds: string[] = []
) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const slug = await generateGuestSlug(supabase, projectId, name);
  const { data: guest, error } = await supabase
    .from("guests")
    .insert({
      project_id: projectId,
      name,
      slug,
      category,
      whatsapp_number: whatsappNumber || null,
    })
    .select("id")
    .single();
  if (error || !guest) return { error: error?.message ?? "Failed" };

  if (eventIds.length > 0) {
    await setGuestEvents(supabase, guest.id, eventIds);
  } else {
    const { data: allEvents } = await supabase
      .from("events")
      .select("id")
      .eq("project_id", projectId);
    if (allEvents?.length) {
      await setGuestEvents(
        supabase,
        guest.id,
        allEvents.map((e) => e.id)
      );
    }
  }

  revalidateProject(projectId);
  return { success: true };
}

export async function updateGuest(
  projectId: string,
  id: string,
  data: {
    name?: string;
    category?: GuestCategory;
    whatsapp_number?: string;
    eventIds?: string[];
  }
) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { eventIds, ...guestData } = data;
  const { error } = await supabase
    .from("guests")
    .update(guestData)
    .eq("id", id)
    .eq("project_id", projectId);
  if (error) return { error: error.message };
  if (eventIds) await setGuestEvents(supabase, id, eventIds);
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

  const { data: allEvents } = await supabase
    .from("events")
    .select("id")
    .eq("project_id", projectId);
  const eventIds = (allEvents ?? []).map((e) => e.id);

  if (eventIds.length > 0) {
    const { data: newGuests } = await supabase
      .from("guests")
      .select("id")
      .eq("project_id", projectId)
      .in(
        "slug",
        inserts.map((i) => i.slug)
      );
    for (const g of newGuests ?? []) {
      await setGuestEvents(supabase, g.id, eventIds);
    }
  }

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

  const { project_id: _pid, ...rest } = pickUpdatableSettings(
    settings as Partial<AdminSettings> & { project_id?: string }
  );

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
  const events = await getEvents(projectId);

  const hasNames =
    !!settings &&
    !settings.groom_name.startsWith("[FILL IN") &&
    !settings.bride_name.startsWith("[FILL IN");
  const hasEvent =
    events.length > 0 &&
    events.some(
      (e) =>
        !!e.label.trim() &&
        !!e.venue_name.trim() &&
        !e.venue_name.startsWith("[FILL IN")
    );
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

export async function setProjectPassword(
  projectId: string,
  password: string | null,
  enabled: boolean
) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const hash = password ? await bcrypt.hash(password, 10) : null;
  const { error } = await supabase
    .from("admin_settings")
    .update({
      is_password_protected: enabled,
      access_password_hash: enabled ? hash : null,
      updated_at: new Date().toISOString(),
    })
    .eq("project_id", projectId);
  if (error) return { error: error.message };
  revalidateProject(projectId);
  return { success: true };
}

export async function checkInGuest(projectId: string, token: string) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_in_guest", {
    p_token: token,
    p_project_id: projectId,
  });
  if (error) return { error: error.message, status: "invalid" as const };
  const row = data?.[0] as {
    success: boolean;
    status: string;
    guest_name: string;
    event_label: string;
  } | undefined;
  if (!row) return { status: "invalid" as const };
  return {
    success: row.success,
    status: row.status as "success" | "already_checked_in" | "invalid",
    guestName: row.guest_name,
    eventLabel: row.event_label,
  };
}

export async function getCheckinStats(projectId: string) {
  await assertProjectAccess(projectId);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_checkin_stats", {
    p_project_id: projectId,
  });
  if (error || !data?.length) {
    return { checkedIn: 0, totalConfirmed: 0 };
  }
  return {
    checkedIn: Number(data[0].checked_in ?? 0),
    totalConfirmed: Number(data[0].total_confirmed ?? 0),
  };
}
