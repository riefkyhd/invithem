import type { Page } from "@playwright/test";

export type TestProject = {
  id: string;
  slug: string;
  baseUrl: string;
};

const UUID_RE =
  /^\/admin\/projects\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

export async function resolveTestProject(page: Page): Promise<TestProject> {
  const preferredSlug = process.env.E2E_PROJECT_SLUG ?? "my-wedding";

  await page.goto("/admin/projects");
  await page.getByRole("heading", { name: "Your projects" }).waitFor();

  const cards = page.locator(".group.rounded-2xl");
  const count = await cards.count();
  if (count === 0) {
    throw new Error("No projects found — create one in Supabase or via admin UI first");
  }

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const slugText = await card.locator("p.text-muted").textContent();
    const slug = slugText?.replace(/^\//, "").trim() ?? "";
    if (slug === preferredSlug) {
      const href = await card.locator("a.block").getAttribute("href");
      if (!href) break;
      const match = href.match(UUID_RE);
      if (match) return { id: match[1], slug, baseUrl: href };
    }
  }

  const href = await cards.first().locator("a.block").getAttribute("href");
  if (!href) throw new Error("Project card missing href");

  const match = href.match(UUID_RE);
  if (!match) throw new Error(`Unexpected project href: ${href}`);

  const slugText = await cards.first().locator("p.text-muted").textContent();
  const slug = slugText?.replace(/^\//, "").trim() ?? preferredSlug;

  return { id: match[1], slug, baseUrl: href };
}

export async function openProjectTab(
  page: Page,
  project: TestProject,
  tab: string
) {
  await page.goto(`${project.baseUrl}${tab}`);
  await page.waitForLoadState("networkidle");
}
