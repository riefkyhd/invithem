import { createClient } from "@/lib/supabase/server";
import type { AdminSettings, Project, Wish } from "@/lib/types/database";

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
  return data[0] as AdminSettings;
}

export async function getProjectWishesBySlug(slug: string): Promise<Wish[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_project_wishes", {
    p_project_slug: slug,
  });
  return (data as Wish[]) ?? [];
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
