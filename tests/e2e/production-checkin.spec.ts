import { test, expect } from "./fixtures/project.fixture";
import { addGuestAndGetSlug } from "./helpers/guest";
import { openInvitation, submitFirstRsvp } from "./helpers/invitation";
import { openProjectTab } from "./helpers";

test.describe("Check-in scanner UI", () => {
  test.beforeEach(async ({ page, project }) => {
    const { disableProjectPassword } = await import("./helpers/guest");
    await disableProjectPassword(page, project);
  });

  test("manual token check-in after guest RSVPs", async ({ page, project }) => {
    const guestName = `Checkin E2E ${Date.now()}`;
    const guestSlug = await addGuestAndGetSlug(page, project, guestName);

    await page.goto(`/w/${project.slug}/${guestSlug}`);
    await openInvitation(page);
    await submitFirstRsvp(page, guestName);

    const tokenEl = page.getByTestId("checkin-token");
    await expect(tokenEl).toBeVisible({ timeout: 30_000 });
    const token = (await tokenEl.textContent())?.trim();
    expect(token).toBeTruthy();

    await openProjectTab(page, project, "/checkin");
    await expect(page.getByRole("heading", { name: "Check-in" })).toBeVisible();
    await page.getByTestId("checkin-manual-input").fill(token!);
    await page.getByTestId("checkin-manual-submit").click();

    await expect(page.getByTestId("checkin-status")).toContainText(/Checked in!/i, {
      timeout: 15_000,
    });
  });

  test("manual entry rejects invalid token", async ({ page, project }) => {
    await openProjectTab(page, project, "/checkin");
    await page.getByTestId("checkin-manual-input").fill("invalid.token.value");
    await page.getByTestId("checkin-manual-submit").click();
    await expect(page.getByTestId("checkin-status")).toContainText(
      /Invalid|unrecognized/i,
      { timeout: 15_000 }
    );
  });

  test("check-in page shows stats and scanner mount point", async ({ page, project }) => {
    await openProjectTab(page, project, "/checkin");
    await expect(page.getByText(/confirmed guests checked in/i)).toBeVisible();
    await expect(page.locator("#qr-reader")).toBeAttached();
    await expect(page.getByTestId("checkin-manual-input")).toBeVisible();
  });
});
