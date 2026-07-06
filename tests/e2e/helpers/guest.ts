import type { Page } from "@playwright/test";
import type { TestProject } from "../helpers";

export async function addGuestAndGetSlug(
  page: Page,
  project: TestProject,
  guestName: string
): Promise<string> {
  await page.goto(`${project.baseUrl}/guests`);
  await page.getByPlaceholder("Budi & Keluarga").fill(guestName);
  await page.getByRole("button", { name: "Add guest" }).click();
  await page
    .getByRole("row", { name: new RegExp(guestName) })
    .getByRole("button", { name: "Details" })
    .click();

  const linkText = await page
    .locator("tr")
    .filter({ hasText: guestName })
    .locator("xpath=following-sibling::tr[1]")
    .locator("p.break-all")
    .textContent();

  if (!linkText) throw new Error("Could not read invitation link for guest");

  const match = linkText.match(new RegExp(`/w/${project.slug}/([^/?#]+)`));
  if (!match) throw new Error(`Could not parse guest slug from: ${linkText}`);
  return match[1];
}

export async function disableProjectPassword(page: Page, project: TestProject) {
  await page.goto(`${project.baseUrl}/settings/privacy`);
  const checkbox = page.getByRole("checkbox", {
    name: /Require password to view invitation/i,
  });
  if (await checkbox.isChecked()) {
    await checkbox.uncheck();
    await page
      .getByRole("button", {
        name: /Remove password protection|Update password/i,
      })
      .click();
    await page.getByText(/Password updated/i).waitFor({ timeout: 15_000 });
  }
}

export async function enableProjectPassword(
  page: Page,
  project: TestProject,
  password: string
) {
  await page.goto(`${project.baseUrl}/settings/privacy`);
  const checkbox = page.getByRole("checkbox", {
    name: /Require password to view invitation/i,
  });
  if (!(await checkbox.isChecked())) {
    await checkbox.check();
  }
  await page.getByLabel("New password").fill(password);
  await page.getByRole("button", { name: "Update password" }).click();
  await page.getByText(/Password updated/i).waitFor({ timeout: 15_000 });
}
