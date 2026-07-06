import { describe, expect, it } from "vitest";
import { toMapsEmbedUrl } from "@/lib/utils/maps";

describe("toMapsEmbedUrl", () => {
  it("returns empty for null/undefined/blank", () => {
    expect(toMapsEmbedUrl(null)).toBe("");
    expect(toMapsEmbedUrl(undefined)).toBe("");
    expect(toMapsEmbedUrl("   ")).toBe("");
  });

  it("passes through already embeddable URLs", () => {
    const embed = "https://www.google.com/maps/embed?pb=abc";
    expect(toMapsEmbedUrl(embed)).toBe(embed);
    const outputEmbed = "https://maps.google.com/maps?q=test&output=embed";
    expect(toMapsEmbedUrl(outputEmbed)).toBe(outputEmbed);
  });

  it("converts place URL to embed format", () => {
    const result = toMapsEmbedUrl(
      "https://www.google.com/maps/place/Jakarta/@-6.2,106.8,15z"
    );
    expect(result).toContain("output=embed");
    expect(result).toContain("maps.google.com");
  });

  it("extracts q param from maps URL", () => {
    const result = toMapsEmbedUrl(
      "https://www.google.com/maps?q=Grand+Hyatt+Jakarta"
    );
    expect(result).toContain(encodeURIComponent("Grand Hyatt Jakarta"));
    expect(result).toContain("output=embed");
  });

  it("handles plain address string", () => {
    const result = toMapsEmbedUrl("Jl. Sudirman No. 1, Jakarta");
    expect(result).toContain(encodeURIComponent("Jl. Sudirman No. 1, Jakarta"));
  });

  it("extracts coordinates from @lat,lng in path", () => {
    const result = toMapsEmbedUrl(
      "https://www.google.com/maps/@-6.175392,106.827153,17z"
    );
    expect(result).toContain("-6.175392");
    expect(result).toContain("106.827153");
  });
});
