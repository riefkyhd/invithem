import { test, expect } from "./fixtures/project.fixture";
import { openProjectTab } from "./helpers";

test.describe("Admin guests", () => {
  test("add guest and see in list", async ({ page, project }) => {
    const guestName = `E2E Guest ${Date.now()}`;

    await openProjectTab(page, project, "/guests");
    await page.getByPlaceholder("Budi & Keluarga").fill(guestName);
    await page.getByRole("button", { name: "Add guest" }).click();

    await expect(page.getByText(guestName)).toBeVisible({ timeout: 20_000 });
  });

  test("rejects empty guest name via HTML validation", async ({ page, project }) => {
    await openProjectTab(page, project, "/guests");
    await page.getByRole("button", { name: "Add guest" }).click();
    const nameInput = page.getByPlaceholder("Budi & Keluarga");
    await expect(nameInput).toBeFocused();
  });

  test("import guests from CSV", async ({ page, project }) => {
    const csvName = `CSV Guest ${Date.now()}`;
    const csvContent = `name,category,whatsapp_number\n"${csvName}",friends,6281234567890\n`;

    await openProjectTab(page, project, "/guests");

    const csvInput = page.locator('input[type="file"][accept*="csv"]');
    await csvInput.setInputFiles({
      name: "guests.csv",
      mimeType: "text/csv",
      buffer: Buffer.from(csvContent),
    });

    await expect(page.getByText(csvName)).toBeVisible({ timeout: 20_000 });
  });

  test("export CSV when guests exist", async ({ page, project }) => {
    await openProjectTab(page, project, "/guests");

    const exportBtn = page.getByRole("button", { name: "Export CSV" });
    if (await exportBtn.isDisabled()) {
      const guestName = `Export Guest ${Date.now()}`;
      await page.getByPlaceholder("Budi & Keluarga").fill(guestName);
      await page.getByRole("button", { name: "Add guest" }).click();
      await expect(page.getByText(guestName)).toBeVisible({ timeout: 20_000 });
    }

    const downloadPromise = page.waitForEvent("download");
    await exportBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("guests.csv");
  });
});
