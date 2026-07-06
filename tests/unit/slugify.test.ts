import { describe, expect, it } from "vitest";
import { generateGuestSlug, slugify } from "@/lib/projects/access";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Ahmad & Siti Wedding")).toBe("ahmad-siti-wedding");
  });

  it("strips special characters", () => {
    expect(slugify("Hello!!! World???")).toBe("hello-world");
  });

  it("trims and collapses hyphens", () => {
    expect(slugify("  foo---bar  ")).toBe("foo-bar");
  });

  it("returns empty for symbols-only input", () => {
    expect(slugify("!!!")).toBe("");
  });

  it("caps length at 48 characters", () => {
    const long = "a".repeat(60);
    expect(slugify(long).length).toBeLessThanOrEqual(48);
  });
});

describe("generateGuestSlug", () => {
  function mockSupabase(existingSlugs: string[]) {
    return {
      from: () => ({
        select: () => ({
          eq: () =>
            Promise.resolve({
              data: existingSlugs.map((slug) => ({ slug })),
            }),
        }),
      }),
    } as never;
  }

  it("returns base slug when available", async () => {
    const slug = await generateGuestSlug(mockSupabase([]), "proj-1", "Budi Santoso");
    expect(slug).toBe("budi-santoso");
  });

  it("appends suffix when slug taken", async () => {
    const slug = await generateGuestSlug(
      mockSupabase(["budi-santoso"]),
      "proj-1",
      "Budi Santoso"
    );
    expect(slug).toBe("budi-santoso-2");
  });

  it("respects reserved set", async () => {
    const slug = await generateGuestSlug(
      mockSupabase([]),
      "proj-1",
      "Budi Santoso",
      new Set(["budi-santoso"])
    );
    expect(slug).toBe("budi-santoso-2");
  });

  it("falls back to guest timestamp slug for empty name", async () => {
    const slug = await generateGuestSlug(mockSupabase([]), "proj-1", "!!!");
    expect(slug).toMatch(/^guest-/);
  });
});
