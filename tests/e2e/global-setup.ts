import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { chromium, type FullConfig } from "@playwright/test";
import { loadEnvLocal } from "../helpers/load-env";

const AUTH_FILE = resolve(__dirname, ".auth/admin.json");

export const DEFAULT_E2E_EMAIL = "e2e-admin@invithem.test";
export const DEFAULT_E2E_PASSWORD = "E2eTestPassword123!";

export function e2eCredentials(): { email: string; password: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return {
    email: process.env.E2E_ADMIN_EMAIL ?? DEFAULT_E2E_EMAIL,
    password: process.env.E2E_ADMIN_PASSWORD ?? DEFAULT_E2E_PASSWORD,
  };
}

export function hasE2ECredentials(): boolean {
  return e2eCredentials() !== null;
}

async function ensureE2EUser(email: string, password: string): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: listed } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const existing = listed?.users?.find((u) => u.email === email);

  let userId: string;
  if (existing) {
    await admin.auth.admin.updateUserById(existing.id, { password });
    userId = existing.id;
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error || !data.user) {
      throw new Error(`Failed to create E2E user: ${error?.message}`);
    }
    userId = data.user.id;
  }

  const projectSlug = process.env.E2E_PROJECT_SLUG ?? "my-wedding";
  const { data: project } = await admin
    .from("projects")
    .select("id")
    .eq("slug", projectSlug)
    .maybeSingle();

  if (project) {
    await admin.from("project_collaborators").upsert(
      {
        project_id: project.id,
        user_id: userId,
        role: "owner",
      },
      { onConflict: "project_id,user_id" }
    );
  }

  return userId;
}

async function globalSetup(config: FullConfig) {
  loadEnvLocal();

  const creds = e2eCredentials();
  if (!creds) {
    writeFileSync(
      resolve(__dirname, ".auth/skipped"),
      "Missing Supabase env for E2E auth bootstrap"
    );
    console.warn(
      "Supabase env missing — authenticated E2E tests will be skipped."
    );
    return;
  }

  await ensureE2EUser(creds.email, creds.password);

  const baseURL =
    (config.projects[0]?.use?.baseURL as string) ?? "http://localhost:3000";

  mkdirSync(dirname(AUTH_FILE), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseURL}/admin/login`);
  await page.getByLabel("Email").fill(creds.email);
  await page.getByLabel("Password").fill(creds.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/admin/projects**", { timeout: 60_000 });

  await context.storageState({ path: AUTH_FILE });
  await browser.close();

  console.log(`E2E auth ready for ${creds.email}`);
}

export default globalSetup;

export function adminStorageState(): string | undefined {
  return existsSync(AUTH_FILE) ? AUTH_FILE : undefined;
}
