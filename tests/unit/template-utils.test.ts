import { describe, expect, it } from "vitest";
import {
  getGalleryImages,
  getLivestreamEmbedUrl,
  getStoryImageUrl,
  PLACEHOLDER_GALLERY,
} from "@/lib/invitation/template-utils";
import type { WeddingData } from "@/lib/types/wedding-data";

function minimalWeddingData(overrides: Partial<WeddingData> = {}): WeddingData {
  return {
    projectId: "p1",
    projectSlug: "test",
    couple: { groomName: "A", brideName: "B", monogram: "AB" },
    weddingDate: "2026-11-15",
    events: [],
    parents: {
      groom: { father: "", mother: "" },
      bride: { father: "", mother: "" },
    },
    opening: {
      quote: "",
      greetingId: "",
      greetingEn: "",
      formalAddressId: "",
    },
    gift: { bankAccounts: [], shippingAddress: "" },
    footer: { sustainabilityId: "", sustainabilityEn: "", credit: "" },
    isPasswordProtected: false,
    story: [],
    gallery: [],
    livestreamUrl: null,
    musicUrl: null,
    whatsappNumber: "",
    guest: null,
    wishes: [],
    share: { invitationUrl: "", messageId: "", messageEn: "" },
    ...overrides,
  };
}

describe("template utils", () => {
  it("returns placeholder gallery when empty", () => {
    const images = getGalleryImages(minimalWeddingData());
    expect(images.length).toBe(PLACEHOLDER_GALLERY.length);
    expect(images[0].url).toContain("unsplash");
  });

  it("returns real gallery when present", () => {
    const custom = [{ url: "https://cdn.example/1.jpg", alt: "Photo 1" }];
    const images = getGalleryImages(minimalWeddingData({ gallery: custom }));
    expect(images).toEqual(custom);
  });

  it("embeds youtube watch URLs", () => {
    expect(
      getLivestreamEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("embeds youtu.be short URLs", () => {
    expect(getLivestreamEmbedUrl("https://youtu.be/abc123")).toBe(
      "https://www.youtube.com/embed/abc123"
    );
  });

  it("passes through other URLs", () => {
    const zoom = "https://zoom.us/j/123";
    expect(getLivestreamEmbedUrl(zoom)).toBe(zoom);
  });

  it("uses storage URL for story image path", () => {
    const url = getStoryImageUrl("proj-1/story.jpg");
    expect(url).toContain("proj-1/story.jpg");
  });

  it("uses fallback when no story image", () => {
    expect(getStoryImageUrl()).toContain("unsplash");
  });
});
