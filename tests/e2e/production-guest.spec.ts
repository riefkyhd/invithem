import { test, expect } from "./fixtures/project.fixture";
import { addGuestAndGetSlug } from "./helpers/guest";
import { openInvitation, submitFirstRsvp } from "./helpers/invitation";

test.describe("Guest RSVP submission", () => {
  test.beforeEach(async ({ page, project }) => {
    const { disableProjectPassword } = await import("./helpers/guest");
    await disableProjectPassword(page, project);
  });

  test("guest can submit RSVP on invitation page", async ({ page, project }) => {
    const guestName = `RSVP E2E ${Date.now()}`;
    const guestSlug = await addGuestAndGetSlug(page, project, guestName);

    await page.goto(`/w/${project.slug}/${guestSlug}`);
    await page.waitForLoadState("domcontentloaded");
    await openInvitation(page);
    await submitFirstRsvp(page, guestName);

    await expect(page.getByText(/thank|terima kasih/i)).toBeVisible({
      timeout: 30_000,
    });
  });
});

test.describe("Password gate", () => {
  test.beforeEach(async ({ page, project }) => {
    const { disableProjectPassword } = await import("./helpers/guest");
    await disableProjectPassword(page, project);
  });

  test.afterEach(async ({ page, project }) => {
    const { disableProjectPassword } = await import("./helpers/guest");
    await disableProjectPassword(page, project);
  });

  test("blocks invitation until correct password entered", async ({
    browser,
    page,
    project,
  }) => {
    const testPassword = `e2e-pass-${Date.now()}`;
    const { enableProjectPassword } = await import("./helpers/guest");
    await enableProjectPassword(page, project, testPassword);

    const guestContext = await browser.newContext();
    const guestPage = await guestContext.newPage();

    await guestPage.goto(`/w/${project.slug}`);
    await expect(guestPage.getByText("Private invitation")).toBeVisible();
    await guestPage.getByTestId("password-gate-input").fill("wrong-password");
    await guestPage.getByRole("button", { name: "Enter" }).click();
    await expect(guestPage.getByText(/Incorrect password/i)).toBeVisible();

    await guestPage.getByTestId("password-gate-input").fill(testPassword);
    await guestPage.getByRole("button", { name: "Enter" }).click();
    await guestPage.waitForLoadState("networkidle");
    await expect(guestPage.getByText("Private invitation")).toHaveCount(0);

    await guestContext.close();
  });
});
