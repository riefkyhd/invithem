import { describe, expect, it } from "vitest";
import { containsProfanity } from "@/lib/utils/profanity";

describe("containsProfanity", () => {
  it("detects blocked keywords case-insensitively", () => {
    expect(containsProfanity("ini SPAM banget")).toBe(true);
    expect(containsProfanity("FUCK")).toBe(true);
  });

  it("detects URL spam patterns", () => {
    expect(containsProfanity("visit https://spam.com")).toBe(true);
    expect(containsProfanity("www.bad.com")).toBe(true);
  });

  it("allows clean wedding wishes", () => {
    expect(containsProfanity("Selamat menempuh hidup baru!")).toBe(false);
    expect(containsProfanity("Congratulations on your wedding!")).toBe(false);
  });

  it("handles empty string", () => {
    expect(containsProfanity("")).toBe(false);
  });

  it("detects substring matches", () => {
    expect(containsProfanity("something casino night")).toBe(true);
  });
});
