import { test, expect } from "./fixtures/project.fixture";
import { ensureTestImageFixture, TEST_IMAGE_PATH } from "./fixtures/create-test-image";
import { ensureTestAudioFixture, TEST_AUDIO_PATH } from "./fixtures/create-test-audio";
import { openProjectTab } from "./helpers";

test.describe("Admin media uploads", () => {
  test.beforeAll(() => {
    ensureTestImageFixture();
    ensureTestAudioFixture();
  });

  test("upload gallery photo and save", async ({ page, project }) => {
    await openProjectTab(page, project, "/settings/media");

    const galleryInput = page.locator('input[type="file"][accept*="image"]');
    await galleryInput.setInputFiles(TEST_IMAGE_PATH);

    await expect(
      page.getByText(/Uploading|photo\(s\)|Uploaded/i).first()
    ).toBeVisible({ timeout: 30_000 });

    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Settings saved successfully.")).toBeVisible({
      timeout: 30_000,
    });
  });

  test("upload background music and save", async ({ page, project }) => {
    await openProjectTab(page, project, "/settings/media");

    const musicInput = page.locator('input[type="file"][accept*="audio"]');
    await musicInput.setInputFiles(TEST_AUDIO_PATH);

    await expect(
      page.getByText(/Uploading|Uploaded/i).first()
    ).toBeVisible({ timeout: 30_000 });

    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Settings saved successfully.")).toBeVisible({
      timeout: 30_000,
    });
  });

  test("media page shows upload zones", async ({ page, project }) => {
    await openProjectTab(page, project, "/settings/media");
    await expect(page.getByText("Background music", { exact: true })).toBeVisible();
    await expect(page.getByText("Gallery photos", { exact: true })).toBeVisible();
    await expect(page.getByText("Click to upload").first()).toBeVisible();
  });
});
