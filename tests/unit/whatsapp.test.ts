import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildInvitationLink,
  buildWhatsAppShareUrl,
} from "@/lib/utils/whatsapp";

describe("whatsapp utils", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://invithem.example.com";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("builds wa.me link with cleaned phone", () => {
    const url = buildWhatsAppShareUrl("+62 812-3456-7890", "Hello!");
    expect(url).toContain("https://wa.me/6281234567890");
    expect(url).toContain("text=");
    expect(decodeURIComponent(url.split("text=")[1]!)).toBe("Hello!");
  });

  it("builds wa.me link without phone", () => {
    const url = buildWhatsAppShareUrl("", "Invite message");
    expect(url).toBe("https://wa.me/?text=Invite%20message");
  });

  it("encodes message special characters", () => {
    const url = buildWhatsAppShareUrl("6281", "Halo & selamat!");
    expect(url).toContain(encodeURIComponent("Halo & selamat!"));
  });

  it("builds legacy invitation link with to param", () => {
    expect(buildInvitationLink("my-wedding", "budi")).toBe(
      "https://invithem.example.com/w/my-wedding?to=budi"
    );
  });
});
