import { test, expect } from "./fixtures/project.fixture";

test.describe("Admin navigation", () => {
  test("top bar hierarchy and projects list", async ({ page }) => {
    await page.goto("/admin/projects");

    await expect(page.getByRole("link", { name: "Invithem" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Projects" })).toBeVisible();
    await expect(
      page.locator("header").getByRole("link", { name: "New project", exact: true })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your projects" })).toBeVisible();

    await page.getByRole("button", { name: "Account menu" }).click();
    await expect(page.getByRole("link", { name: "Account settings" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Log out" })).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("project tab bar and settings sub-tabs", async ({ page, project }) => {
    await page.goto(project.baseUrl);
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    const tabs = [
      { name: "Guests", heading: "Guests" },
      { name: "RSVPs", heading: "RSVPs" },
      { name: "Wishes", heading: "Wishes" },
      { name: "Check-in", heading: "Check-in" },
      { name: "Design", heading: "Design" },
    ];

    for (const tab of tabs) {
      await page.getByRole("link", { name: tab.name, exact: true }).click();
      await expect(page.getByRole("heading", { name: tab.heading })).toBeVisible();
    }

    await page.getByRole("link", { name: "Settings", exact: true }).click();
    await expect(page.getByRole("link", { name: "General" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Invitation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Gifts & media" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Privacy" })).toBeVisible();

    await page.getByRole("link", { name: "Invitation" }).click();
    await expect(page.getByRole("heading", { name: "Invitation content" })).toBeVisible();

    await page.getByRole("link", { name: "Gifts & media" }).click();
    await expect(page.getByRole("heading", { name: "Gifts & media" })).toBeVisible();

    await page.getByRole("link", { name: "Privacy", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Privacy", level: 1 })).toBeVisible();
  });

  test("project switcher is visible in breadcrumb", async ({ page, project }) => {
    await page.goto(project.baseUrl);
    await expect(page.getByRole("button", { name: "Account menu" })).toBeVisible();
    const switcher = page.locator("header button").filter({ has: page.locator("svg") }).first();
    await expect(switcher).toBeVisible();
  });

  test("account settings page without project tabs", async ({ page }) => {
    await page.goto("/admin/settings");
    await expect(page.getByRole("heading", { name: "Account settings" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toHaveCount(0);
  });

  test("new project form validation", async ({ page }) => {
    await page.goto("/admin/projects/new");
    const nameInput = page.getByPlaceholder("Ahmad & Siti Wedding");
    await expect(nameInput).toHaveAttribute("required", "");
    await page.getByRole("button", { name: "Create project" }).click();
    await expect(page).toHaveURL(/\/admin\/projects\/new$/);
  });
});
