import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAuthDisabled } from "@/lib/auth/disabled";

describe("isAuthDisabled", () => {
  afterEach(() => {
    delete process.env.INVITHEM_DISABLE_AUTH;
  });

  it("returns false when env unset", () => {
    delete process.env.INVITHEM_DISABLE_AUTH;
    expect(isAuthDisabled()).toBe(false);
  });

  it("returns true only when env is exactly true", () => {
    process.env.INVITHEM_DISABLE_AUTH = "true";
    expect(isAuthDisabled()).toBe(true);
  });

  it("returns false for other values", () => {
    process.env.INVITHEM_DISABLE_AUTH = "1";
    expect(isAuthDisabled()).toBe(false);
    process.env.INVITHEM_DISABLE_AUTH = "false";
    expect(isAuthDisabled()).toBe(false);
  });
});
