import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function assertProjectAccess(projectId: string) {
  const user = await getAuthenticatedUser();
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id, owner_id")
    .eq("id", projectId)
    .single();

  if (!project) throw new Error("Project not found");

  if (project.owner_id === user.id) return user;

  const { data: collab } = await supabase
    .from("project_collaborators")
    .select("role")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!collab) throw new Error("Unauthorized");
  return user;
}

export async function getUserProjects() {
  await getAuthenticatedUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function generateGuestSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  name: string,
  reserved = new Set<string>()
): Promise<string> {
  const base = slugify(name) || `guest-${Date.now().toString(36)}`;

  const { data: existing } = await supabase
    .from("guests")
    .select("slug")
    .eq("project_id", projectId);

  const taken = new Set([
    ...(existing ?? []).map((g) => g.slug),
    ...reserved,
  ]);

  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix++;
  return `${base}-${suffix}`;
}
