import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { generateCheckinToken, verifyCheckinToken } from "@/lib/checkin/token";

describe("checkin token", () => {
  beforeEach(() => {
    process.env.CHECKIN_SECRET = "test-secret-for-unit-tests";
  });

  afterEach(() => {
    delete process.env.CHECKIN_SECRET;
  });

  it("generates token with rsvp id prefix", () => {
    const token = generateCheckinToken("rsvp-abc-123");
    expect(token.startsWith("rsvp-abc-123.")).toBe(true);
    expect(token.split(".").length).toBe(2);
  });

  it("verifies valid token and returns rsvp id", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    const token = generateCheckinToken(id);
    expect(verifyCheckinToken(token)).toBe(id);
  });

  it("rejects tampered signature", () => {
    const token = generateCheckinToken("rsvp-1");
    const tampered = token.slice(0, -1) + (token.endsWith("a") ? "b" : "a");
    expect(verifyCheckinToken(tampered)).toBeNull();
  });

  it("rejects missing dot separator", () => {
    expect(verifyCheckinToken("nodotseparator")).toBeNull();
  });

  it("rejects empty token", () => {
    expect(verifyCheckinToken("")).toBeNull();
  });

  it("rejects wrong rsvp id in token body", () => {
    const token = generateCheckinToken("rsvp-a");
    const forged = `rsvp-b.${token.split(".")[1]}`;
    expect(verifyCheckinToken(forged)).toBeNull();
  });

  it("is deterministic for same rsvp id", () => {
    expect(generateCheckinToken("same-id")).toBe(generateCheckinToken("same-id"));
  });
});
