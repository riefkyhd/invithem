import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  eventSlugFromLabel,
  projectInvitationUrl,
  projectStoragePath,
} from "@/lib/projects/urls";

describe("project urls", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://invithem.example.com";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("builds storage path", () => {
    expect(projectStoragePath("proj-1", "cover.jpg")).toBe("proj-1/cover.jpg");
  });

  it("builds project invitation URL without guest", () => {
    expect(projectInvitationUrl("my-wedding")).toBe(
      "https://invithem.example.com/w/my-wedding"
    );
  });

  it("builds guest-specific invitation URL", () => {
    expect(projectInvitationUrl("my-wedding", "budi")).toBe(
      "https://invithem.example.com/w/my-wedding/budi"
    );
  });

  it("appends event query param when provided", () => {
    expect(projectInvitationUrl("my-wedding", "budi", "Akad Nikah")).toBe(
      "https://invithem.example.com/w/my-wedding/budi?event=Akad%20Nikah"
    );
  });

  it("slugifies event labels", () => {
    expect(eventSlugFromLabel("Akad Nikah")).toBe("akad-nikah");
    expect(eventSlugFromLabel("  Reception!!!  ")).toBe("reception");
    expect(eventSlugFromLabel("")).toBe("");
  });
});
