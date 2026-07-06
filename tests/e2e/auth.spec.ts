import { test, expect, skipWithoutAuth } from "./fixtures/authenticated.fixture";

test.describe("Authentication", () => {
  test.beforeEach(() => {
    skipWithoutAuth();
  });

  test("login with valid credentials reaches projects", async ({ page }) => {
    const creds = (await import("./global-setup")).e2eCredentials()!;
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(creds.email);
    await page.getByLabel("Password").fill(creds.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin\/projects/);
    await expect(page.getByRole("heading", { name: "Your projects" })).toBeVisible();
  });

  test("login with wrong password shows error", async ({ page }) => {
    const creds = (await import("./global-setup")).e2eCredentials()!;
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(creds.email);
    await page.getByLabel("Password").fill("definitely-wrong-password-xyz");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Invalid email or password.")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("logout returns to login", async ({ page }) => {
    const creds = (await import("./global-setup")).e2eCredentials()!;
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(creds.email);
    await page.getByLabel("Password").fill(creds.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin\/projects/);

    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("unauthenticated admin route redirects to login", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/admin/projects");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
