import { test, expect } from "./fixtures/project.fixture";

test.describe("Invitation template rendering", () => {
  test("published wedding page renders template", async ({ page, project }) => {
    const response = await page.goto(`/w/${project.slug}`);
    expect(response?.status()).toBe(200);

    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("body")).not.toContainText("404", { timeout: 30_000 });

    const hasTemplateContent =
      (await page.locator("main, section, article, h1, h2").count()) > 0;
    expect(hasTemplateContent).toBe(true);
  });

  test("preview route renders template for project", async ({ page, project }) => {
    const response = await page.goto(
      `/preview/reference?project=${encodeURIComponent(project.slug)}`
    );
    expect(response?.status()).toBe(200);

    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("unknown project slug returns 404", async ({ page }) => {
    const response = await page.goto("/w/this-slug-definitely-does-not-exist-xyz");
    expect(response?.status()).toBe(404);
  });

  test("landing page CTAs work", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Invithem" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();

    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(page).toHaveURL(/\/admin\/projects/);
  });

  test("legacy ?to= redirect when guest slug in URL", async ({ page, project }) => {
    await page.goto(`/w/${project.slug}?to=nonexistent-guest-slug-xyz`);
    await page.waitForLoadState("networkidle");
    const url = page.url();
    expect(url).toMatch(/\/w\/.+\/nonexistent-guest-slug-xyz/);
  });
});
