import { describe, expect, it } from "vitest";
import {
  TEMPLATE_IDS,
  getAllTemplateMeta,
  getTemplateMeta,
  isValidTemplateId,
} from "@/templates/registry";

describe("template registry", () => {
  it("lists all template metadata", () => {
    const meta = getAllTemplateMeta();
    expect(meta.length).toBe(TEMPLATE_IDS.length);
    expect(meta.every((m) => m.name && m.thumbnail)).toBe(true);
  });

  it("validates known template ids", () => {
    expect(isValidTemplateId("reference")).toBe(true);
    expect(isValidTemplateId("dark-luxe")).toBe(true);
    expect(isValidTemplateId("not-a-template")).toBe(false);
    expect(isValidTemplateId("")).toBe(false);
  });

  it("returns meta for valid id", () => {
    const meta = getTemplateMeta("reference");
    expect(meta?.id).toBe("reference");
    expect(meta?.name).toBeTruthy();
  });

  it("returns null for invalid id", () => {
    expect(getTemplateMeta("invalid")).toBeNull();
  });

  it("has unique template ids", () => {
    const ids = new Set(TEMPLATE_IDS);
    expect(ids.size).toBe(TEMPLATE_IDS.length);
  });
});
