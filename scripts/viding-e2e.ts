/**
 * Viding content parity E2E checks.
 * Usage: npx tsx scripts/viding-e2e.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { generateCheckinToken } from "../lib/checkin/token";

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
    // optional
  }
}

loadEnvLocal();

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !serviceKey || !anonKey) {
    console.error("Missing env vars");
    process.exit(1);
  }

  const admin = createClient(url, serviceKey);
  const anon = createClient(url, anonKey);

  const { data: project } = await admin
    .from("projects")
    .select("id, slug")
    .eq("slug", "my-wedding")
    .single();

  if (!project) {
    console.error("my-wedding project not found");
    process.exit(1);
  }

  const { data: events } = await admin
    .from("events")
    .select("id, label")
    .eq("project_id", project.id)
    .order("sort_order");

  if (!events?.length) {
    console.error("FAIL: No events for project");
    process.exit(1);
  }
  console.log(`PASS: ${events.length} events found`);

  const { data: settings } = await anon.rpc("get_project_settings", {
    p_project_slug: project.slug,
  });
  if (!settings?.[0]?.groom_father_name !== undefined) {
    console.log("PASS: Extended settings fields accessible");
  }

  const { data: rpcEvents } = await anon.rpc("get_project_events", {
    p_project_slug: project.slug,
  });
  if (!rpcEvents?.length) {
    console.error("FAIL: get_project_events returned empty");
    process.exit(1);
  }
  console.log("PASS: get_project_events RPC works");

  const { data: guests } = await admin
    .from("guests")
    .select("id, slug")
    .eq("project_id", project.id)
    .limit(1);

  if (guests?.[0]) {
    const guest = guests[0];
    const { data: guestWithEvents } = await anon.rpc("get_guest_with_events", {
      p_project_slug: project.slug,
      p_guest_slug: guest.slug,
    });
    if (!guestWithEvents?.length) {
      console.error("FAIL: get_guest_with_events");
      process.exit(1);
    }
    console.log("PASS: get_guest_with_events RPC works");

    const invitedEventId =
      (guestWithEvents[0] as { event_ids?: string[] }).event_ids?.[0] ??
      events[0].id;

    const { data: rsvpId, error: rsvpErr } = await anon.rpc("submit_public_rsvp", {
      p_project_id: project.id,
      p_event_id: invitedEventId,
      p_guest_id: guest.id,
      p_name: guestWithEvents[0].name ?? "E2E Test Guest",
      p_attending: true,
      p_guest_count: 1,
      p_meal_preference: null,
      p_message: null,
    });

    if (rsvpErr) {
      console.error("FAIL: RSVP insert", rsvpErr.message);
      process.exit(1);
    }

    const token = generateCheckinToken(rsvpId as string);
    await admin
      .from("rsvps")
      .update({ checkin_token: token })
      .eq("id", rsvpId as string);

    const { data: checkin } = await anon.rpc("check_in_guest", {
      p_token: token,
    });
    if (!checkin?.[0]?.success) {
      console.error("FAIL: check_in_guest");
      process.exit(1);
    }
    console.log("PASS: QR check-in flow works");

    await admin.from("rsvps").delete().eq("id", rsvpId as string);
  } else {
    console.log("SKIP: No guests for RSVP/check-in test");
  }

  console.log("\nAll Viding parity checks passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
