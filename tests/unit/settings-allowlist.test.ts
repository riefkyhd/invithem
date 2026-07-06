import { describe, expect, it } from "vitest";
import { pickUpdatableSettings } from "@/lib/admin/settings-allowlist";

describe("pickUpdatableSettings", () => {
  it("allows only whitelisted fields", () => {
    const result = pickUpdatableSettings({
      groom_name: "Ahmad",
      bride_name: "Siti",
      template_id: "reference",
    });
    expect(result).toEqual({
      groom_name: "Ahmad",
      bride_name: "Siti",
      template_id: "reference",
    });
  });

  it("strips sensitive and non-updatable fields", () => {
    const result = pickUpdatableSettings({
      groom_name: "Ahmad",
      access_password_hash: "should-not-pass",
      is_password_protected: true,
      project_id: "evil-injection",
      updated_at: "2020-01-01",
    } as never);
    expect(result).toEqual({ groom_name: "Ahmad" });
    expect(result).not.toHaveProperty("access_password_hash");
    expect(result).not.toHaveProperty("is_password_protected");
    expect(result).not.toHaveProperty("project_id");
  });

  it("ignores undefined values", () => {
    const result = pickUpdatableSettings({
      groom_name: "Ahmad",
      bride_name: undefined,
    });
    expect(result).toEqual({ groom_name: "Ahmad" });
    expect(result).not.toHaveProperty("bride_name");
  });

  it("returns empty object for empty input", () => {
    expect(pickUpdatableSettings({})).toEqual({});
  });
});
