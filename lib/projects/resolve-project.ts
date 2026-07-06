import { cache } from "react";
import { isAuthDisabled } from "@/lib/auth/disabled";
import { createAccessClient } from "@/lib/supabase/access-client";
import { createClient } from "@/lib/supabase/server";
import type {
  AdminSettings,
  Project,
  WeddingEvent,
  Wish,
} from "@/lib/types/database";
import type { WeddingGuest } from "@/lib/types/wedding-data";

export interface WeddingPageSources {
  project: Project;
  settings: AdminSettings;
  wishes: Wish[];
  events: WeddingEvent[];
  guest: WeddingGuest | null;
}

function mapGuestRow(
  row: {
    id: string;
    name: string;
    slug: string;
    event_ids: string[];
  } | null
): WeddingGuest | null {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    eventIds: row.event_ids ?? [],
  };
}

/** One Supabase client, parallel RPCs — avoids sequential round-trips per page load. */
export const fetchWeddingPageSources = cache(
  async (
    projectSlug: string,
    guestSlug?: string
  ): Promise<WeddingPageSources | null> => {
    const supabase = isAuthDisabled()
      ? await createAccessClient()
      : await createClient();

    const [projectRes, settingsRes, wishesRes, eventsRes, guestRes] =
      await Promise.all([
        supabase.rpc("get_project_by_slug", { p_slug: projectSlug }),
        supabase.rpc("get_project_settings", {
          p_project_slug: projectSlug,
        }),
        supabase.rpc("get_project_wishes", {
          p_project_slug: projectSlug,
        }),
        supabase.rpc("get_project_events", {
          p_project_slug: projectSlug,
        }),
        guestSlug
          ? supabase.rpc("get_guest_with_events", {
              p_project_slug: projectSlug,
              p_guest_slug: guestSlug,
            })
          : Promise.resolve({ data: null, error: null }),
      ]);

    const project = projectRes.data?.[0] as Project | undefined;
    if (!project) return null;
    if (!isAuthDisabled() && project.status !== "published") return null;
    if (isAuthDisabled() && project.status === "archived") return null;

    const settingsRow = settingsRes.data?.[0] as AdminSettings | undefined;
    const settings = settingsRow
      ? { ...settingsRow, access_password_hash: null }
      : null;
    if (!settings) return null;

    const guestRow = guestRes.data?.[0] as
      | { id: string; name: string; slug: string; event_ids: string[] }
      | undefined;

    if (guestSlug && !guestRow) return null;

    return {
      project,
      settings,
      wishes: (wishesRes.data as Wish[]) ?? [],
      events: (eventsRes.data as WeddingEvent[]) ?? [],
      guest: guestSlug ? mapGuestRow(guestRow ?? null) : null,
    };
  }
);

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_project_by_slug", { p_slug: slug });
  if (!data || data.length === 0) return null;
  return data[0] as Project;
}

export async function getProjectSettingsBySlug(
  slug: string
): Promise<AdminSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_project_settings", {
    p_project_slug: slug,
  });
  if (!data || data.length === 0) return null;
  const row = data[0] as AdminSettings;
  return { ...row, access_password_hash: null };
}

export async function getProjectWishesBySlug(slug: string): Promise<Wish[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_project_wishes", {
    p_project_slug: slug,
  });
  return (data as Wish[]) ?? [];
}

export async function getProjectEventsBySlug(
  slug: string
): Promise<WeddingEvent[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_project_events", {
    p_project_slug: slug,
  });
  return (data as WeddingEvent[]) ?? [];
}

export async function getGuestWithEvents(
  projectSlug: string,
  guestSlug: string
): Promise<WeddingGuest | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_guest_with_events", {
    p_project_slug: projectSlug,
    p_guest_slug: guestSlug,
  });
  if (!data || data.length === 0) return null;
  return mapGuestRow(
    data[0] as {
      id: string;
      name: string;
      slug: string;
      event_ids: string[];
    }
  );
}

export async function requirePublishedProject(slug: string): Promise<Project> {
  const project = await getProjectBySlug(slug);
  if (!project) throw new Error("Project not found");
  if (project.status !== "published") throw new Error("Project not published");
  return project;
}

export async function getDefaultPublishedSlug(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("slug")
    .eq("status", "published")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();
  return data?.slug ?? null;
}
