import { test as base, expect } from "@playwright/test";
import { adminStorageState, hasE2ECredentials } from "../global-setup";
import { resolveTestProject, type TestProject } from "../helpers";

export const test = base.extend<{ project: TestProject }>({
  project: async ({ page }, use) => {
    const project = await resolveTestProject(page);
    await use(project);
  },
});

test.beforeEach(({}, testInfo) => {
  if (testInfo.project.name === "auth-flow") return;
  if (!hasE2ECredentials() || !adminStorageState()) {
    test.skip(
      true,
      "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env.local for authenticated admin E2E."
    );
  }
});

export { expect };

export function skipWithoutAuth() {
  test.skip(
    !hasE2ECredentials() || !adminStorageState(),
    "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env.local."
  );
}
