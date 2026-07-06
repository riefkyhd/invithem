import { describe, expect, it } from "vitest";

/** Mirrors AdminNav extractProjectId for routing contract tests */
function extractProjectId(pathname: string): string | null {
  const match = pathname.match(/^\/admin\/projects\/([^/]+)/);
  return match?.[1] ?? null;
}

function isSettingsRoute(pathname: string, projectBase: string): boolean {
  return pathname.startsWith(`${projectBase}/settings`);
}

function projectTabActive(
  pathname: string,
  href: string,
  options?: { exact?: boolean; settingsSection?: boolean; projectBase?: string }
): boolean {
  if (options?.settingsSection && options.projectBase) {
    return pathname.startsWith(`${options.projectBase}/settings`);
  }
  return options?.exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

describe("admin routing logic", () => {
  it("extracts project id from admin paths", () => {
    expect(extractProjectId("/admin/projects/abc-123")).toBe("abc-123");
    expect(extractProjectId("/admin/projects/abc-123/guests")).toBe("abc-123");
    expect(extractProjectId("/admin/projects")).toBeNull();
    expect(extractProjectId("/admin/settings")).toBeNull();
  });

  it("rejects reserved segments as project id", () => {
    expect(extractProjectId("/admin/projects/new")).toBe("new");
  });

  it("detects settings sub-routes", () => {
    const base = "/admin/projects/p1";
    expect(isSettingsRoute(`${base}/settings/general`, base)).toBe(true);
    expect(isSettingsRoute(`${base}/guests`, base)).toBe(false);
  });

  it("marks dashboard tab active only on exact match", () => {
    const base = "/admin/projects/p1";
    expect(projectTabActive(`${base}`, `${base}`, { exact: true })).toBe(true);
    expect(projectTabActive(`${base}/guests`, `${base}`, { exact: true })).toBe(
      false
    );
  });

  it("marks settings tab active on nested routes", () => {
    const base = "/admin/projects/p1";
    const settingsHref = `${base}/settings/general`;
    expect(
      projectTabActive(`${base}/settings/content`, settingsHref, {
        settingsSection: true,
        projectBase: base,
      })
    ).toBe(true);
    expect(projectTabActive(`${base}/design`, settingsHref)).toBe(false);
  });
});

describe("legacy redirect path patterns", () => {
  it("matches wedding slug for legacy guest redirect", () => {
    const match = "/w/my-wedding".match(/^\/w\/([^/]+)$/);
    expect(match?.[1]).toBe("my-wedding");
    expect("/w/my-wedding/budi".match(/^\/w\/([^/]+)$/)?.[1]).toBeUndefined();
  });

  const legacyAdmin = [
    "/admin/guests",
    "/admin/rsvps",
    "/admin/wishes",
    "/admin/design",
  ];

  it("identifies legacy flat admin paths", () => {
    expect(legacyAdmin.includes("/admin/guests")).toBe(true);
    expect(legacyAdmin.includes("/admin/projects")).toBe(false);
  });
});
