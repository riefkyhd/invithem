import { test, expect } from "./fixtures/project.fixture";
import { openProjectTab } from "./helpers";

test.describe("Admin design", () => {
  test("shows template cards with preview and select", async ({ page, project }) => {
    await openProjectTab(page, project, "/design");

    await expect(page.getByRole("heading", { name: "Design" })).toBeVisible();
    await expect(page.getByText("Sage Editorial").or(page.getByText("reference"))).toBeVisible();

    const previewLink = page.getByRole("link", { name: "Preview" }).first();
    await expect(previewLink).toBeVisible();

    const popupPromise = page.waitForEvent("popup");
    await previewLink.click();
    const popup = await popupPromise;
    await popup.waitForLoadState("networkidle");
    await expect(popup.locator("body")).not.toBeEmpty();
    await popup.close();
  });

  test("invalid preview template returns 404", async ({ page }) => {
    const response = await page.goto("/preview/not-a-real-template-id");
    expect(response?.status()).toBe(404);
  });
});
