/**
 * RLS isolation regression checks.
 *
 * Usage: npx tsx scripts/rls-regression.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 * and SUPABASE_SERVICE_ROLE_KEY in env (.env.local).
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local optional if vars already exported
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const slugA = process.env.PROJECT_A_SLUG ?? "my-wedding";
const slugB = process.env.PROJECT_B_SLUG ?? "test-b";

async function ensureDraftProject(admin: ReturnType<typeof createClient>) {
  const slug = "test-draft";
  const { data: existing } = await admin
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) return existing.id as string;

  const { data: projectA } = await admin
    .from("projects")
    .select("owner_id")
    .eq("slug", slugA)
    .single();

  if (!projectA?.owner_id) {
    throw new Error(`Could not resolve owner for project ${slugA}`);
  }

  const { data: project, error } = await admin
    .from("projects")
    .insert({
      owner_id: projectA.owner_id,
      name: "RLS Draft Test",
      slug,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !project) throw new Error(error?.message ?? "Failed to create draft project");

  await admin.from("admin_settings").insert({
    project_id: project.id,
    template_id: "reference",
  });

  return project.id as string;
}

async function ensureTestProjectB(admin: ReturnType<typeof createClient>) {
  const { data: existing } = await admin
    .from("projects")
    .select("id")
    .eq("slug", slugB)
    .maybeSingle();

  if (existing) return existing.id as string;

  const { data: projectA } = await admin
    .from("projects")
    .select("owner_id")
    .eq("slug", slugA)
    .single();

  if (!projectA?.owner_id) {
    throw new Error(`Could not resolve owner for project ${slugA}`);
  }

  const { data: project, error } = await admin
    .from("projects")
    .insert({
      owner_id: projectA.owner_id,
      name: "RLS Test B",
      slug: slugB,
      status: "published",
    })
    .select("id")
    .single();

  if (error || !project) throw new Error(error?.message ?? "Failed to create test-b");

  await admin.from("admin_settings").insert({
    project_id: project.id,
    template_id: "reference",
    groom_name: "Test Groom B",
    bride_name: "Test Bride B",
    wedding_date: "2026-12-01",
  });

  await admin.from("project_collaborators").insert({
    project_id: project.id,
    user_id: projectA.owner_id,
    role: "owner",
  });

  await admin.from("guests").insert({
    project_id: project.id,
    name: "Test Guest B",
    slug: "test-guest-b",
    category: "friends",
  });

  console.log(`Created test project: ${slugB}`);
  return project.id as string;
}

async function main() {
  if (!url || !serviceKey || !anonKey) {
    console.error("Missing Supabase env vars");
    process.exit(1);
  }

  const admin = createClient(url, serviceKey);
  await ensureTestProjectB(admin);
  const draftProjectId = await ensureDraftProject(admin);

  const { data: projectA } = await admin
    .from("projects")
    .select("id")
    .eq("slug", slugA)
    .single();
  const { data: projectB } = await admin
    .from("projects")
    .select("id")
    .eq("slug", slugB)
    .single();

  if (!projectA || !projectB) {
    console.error("Both test projects must exist");
    process.exit(1);
  }

  await admin
    .from("rsvps")
    .delete()
    .eq("name", "Cross-project test")
    .in("project_id", [projectB.id, draftProjectId]);

  const { data: guestsA } = await admin
    .from("guests")
    .select("id, slug")
    .eq("project_id", projectA.id)
    .limit(1);
  const { data: guestsB } = await admin
    .from("guests")
    .select("id, slug")
    .eq("project_id", projectB.id)
    .limit(1);

  const anon = createClient(url, anonKey);

  const { data: settingsA } = await anon.rpc("get_project_settings", {
    p_project_slug: slugA,
  });
  const { data: settingsB } = await anon.rpc("get_project_settings", {
    p_project_slug: slugB,
  });

  if (!settingsA?.length || !settingsB?.length) {
    console.error("FAIL: Could not fetch settings per project");
    process.exit(1);
  }
  if (settingsA[0].project_id === settingsB[0].project_id) {
    console.error("FAIL: Settings not isolated");
    process.exit(1);
  }
  console.log("PASS: Settings isolated by project slug");

  if (guestsA?.[0]) {
    const { data: guest } = await anon.rpc("get_guest_by_slug", {
      p_project_slug: slugA,
      p_guest_slug: guestsA[0].slug,
    });
    if (!guest?.length) {
      console.error("FAIL: Guest lookup for project A");
      process.exit(1);
    }
    const { data: crossGuest } = await anon.rpc("get_guest_by_slug", {
      p_project_slug: slugB,
      p_guest_slug: guestsA[0].slug,
    });
    if (crossGuest?.length) {
      console.error("FAIL: Guest from A found in project B");
      process.exit(1);
    }
    console.log("PASS: Guest lookup scoped to project");
  }

  if (guestsB?.[0]) {
    const { data: crossGuestB } = await anon.rpc("get_guest_by_slug", {
      p_project_slug: slugA,
      p_guest_slug: guestsB[0].slug,
    });
    if (crossGuestB?.length) {
      console.error("FAIL: Guest from B found in project A");
      process.exit(1);
    }
    console.log("PASS: Reverse guest lookup isolation");
  }

  const { error: publishedRsvp } = await anon.from("rsvps").insert({
    project_id: projectB.id,
    name: "Cross-project test",
    attending: true,
    guest_count: 1,
  });
  if (publishedRsvp) {
    console.error("FAIL: Published project should allow anon RSVP insert");
    process.exit(1);
  }
  console.log("PASS: Published project allows anon RSVP insert");
  await admin
    .from("rsvps")
    .delete()
    .eq("name", "Cross-project test")
    .eq("project_id", projectB.id);

  const { error: draftRsvp } = await anon.from("rsvps").insert({
    project_id: draftProjectId,
    name: "Cross-project test",
    attending: true,
    guest_count: 1,
  });
  if (!draftRsvp || !draftRsvp.message.includes("row-level security")) {
    console.error("FAIL: Draft project should block anon RSVP insert");
    process.exit(1);
  }
  console.log("PASS: Draft project blocks anon RSVP insert");

  const { data: draftSettings } = await anon.rpc("get_project_settings", {
    p_project_slug: "test-draft",
  });
  if (draftSettings?.length) {
    console.error("FAIL: Draft project settings should not be public");
    process.exit(1);
  }
  console.log("PASS: Draft project settings hidden from anon");

  const { data: wishesA } = await anon.rpc("get_project_wishes", {
    p_project_slug: slugA,
  });
  const { data: wishesB } = await anon.rpc("get_project_wishes", {
    p_project_slug: slugB,
  });

  if (wishesA && wishesB) {
    const idsA = new Set((wishesA as { id: string }[]).map((w) => w.id));
    const overlap = (wishesB as { id: string }[]).some((w) => idsA.has(w.id));
    if (overlap) {
      console.error("FAIL: Wishes overlap between projects");
      process.exit(1);
    }
    console.log("PASS: Wishes isolated by project slug");
  }

  console.log("\nAll automated checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
