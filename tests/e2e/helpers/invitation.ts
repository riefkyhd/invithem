import type { Page } from "@playwright/test";

/** Dismiss the full-screen cover overlay so RSVP and other sections are reachable. */
export async function openInvitation(page: Page) {
  const cover = page.getByRole("button", {
    name: /tap to open|ketuk untuk membuka/i,
  });
  if (await cover.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await cover.click();
    await cover.waitFor({ state: "hidden", timeout: 10_000 });
    return;
  }

  const openButton = page.getByRole("button", {
    name: /open invitation|buka undangan/i,
  });
  if (await openButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await openButton.scrollIntoViewIfNeeded();
    await openButton.click();
    await openButton.waitFor({ state: "hidden", timeout: 10_000 });
  }
}

/** Fill and submit the first event RSVP form on the page. */
export async function submitFirstRsvp(page: Page, guestName: string) {
  const rsvpForm = page.locator('[id^="rsvp-"]').first();
  await rsvpForm.scrollIntoViewIfNeeded();
  await rsvpForm.getByLabel(/name|nama/i).fill(guestName);
  await rsvpForm.getByRole("radio", { name: /yes|ya/i }).first().check();
  await rsvpForm.getByRole("button", { name: /submit|kirim/i }).click();
}
