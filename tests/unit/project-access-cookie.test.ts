import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cookieName,
  createProjectAccessCookieValue,
  projectAccessCookieMaxAge,
  verifyProjectAccessCookieValue,
} from "@/lib/auth/project-access-cookie";

describe("project access cookie", () => {
  beforeEach(() => {
    process.env.CHECKIN_SECRET = "cookie-test-secret";
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-06T12:00:00Z"));
  });

  afterEach(() => {
    delete process.env.CHECKIN_SECRET;
    vi.useRealTimers();
  });

  it("names cookie per project id", () => {
    expect(cookieName("proj-123")).toBe("invithem_access_proj-123");
  });

  it("creates verifiable cookie value", () => {
    const projectId = "550e8400-e29b-41d4-a716-446655440000";
    const value = createProjectAccessCookieValue(projectId);
    expect(verifyProjectAccessCookieValue(projectId, value)).toBe(true);
  });

  it("rejects cookie for wrong project", () => {
    const value = createProjectAccessCookieValue("project-a");
    expect(verifyProjectAccessCookieValue("project-b", value)).toBe(false);
  });

  it("rejects expired cookie", () => {
    const projectId = "proj-expire";
    const value = createProjectAccessCookieValue(projectId);
    vi.advanceTimersByTime((projectAccessCookieMaxAge + 1) * 1000);
    expect(verifyProjectAccessCookieValue(projectId, value)).toBe(false);
  });

  it("rejects malformed value", () => {
    expect(verifyProjectAccessCookieValue("p", undefined)).toBe(false);
    expect(verifyProjectAccessCookieValue("p", "not-a-valid-cookie")).toBe(false);
    expect(verifyProjectAccessCookieValue("p", "abc")).toBe(false);
  });

  it("rejects tampered signature", () => {
    const projectId = "proj-tamper";
    const value = createProjectAccessCookieValue(projectId);
    const dot = value.indexOf(".");
    const tampered = value.slice(0, dot + 1) + "000000000000000000000000";
    expect(verifyProjectAccessCookieValue(projectId, tampered)).toBe(false);
  });
});
