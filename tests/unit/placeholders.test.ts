import { describe, expect, it } from "vitest";
import { mergeSettings } from "@/lib/content/placeholders";
import type { AdminSettings } from "@/lib/types/database";

describe("mergeSettings", () => {
  it("returns full defaults when settings is null", () => {
    const merged = mergeSettings(null);
    expect(merged.template_id).toBe("reference");
    expect(merged.groom_name).toContain("FILL IN");
    expect(merged.story_milestones.length).toBeGreaterThan(0);
    expect(merged.bank_accounts.length).toBeGreaterThan(0);
    expect(merged.is_password_protected).toBe(false);
  });

  it("preserves provided settings", () => {
    const input = {
      project_id: "p1",
      template_id: "dark-luxe" as const,
      groom_name: "Ahmad",
      bride_name: "Siti",
      wedding_date: "2026-11-15T02:00:00.000Z",
      ceremony_time: "09:00",
      ceremony_venue_name: "Masjid",
      ceremony_venue_address: "Jakarta",
      ceremony_maps_embed_url: "",
      reception_time: "11:00",
      reception_venue_name: "Hotel",
      reception_venue_address: "Jakarta",
      reception_maps_embed_url: "",
      groom_father_name: "",
      groom_mother_name: "",
      bride_father_name: "",
      bride_mother_name: "",
      opening_quote: "",
      opening_greeting_id: "",
      opening_greeting_en: "",
      formal_address_id: "",
      gift_shipping_address: "",
      footer_sustainability_id: "",
      footer_sustainability_en: "",
      footer_credit: "",
      is_password_protected: false,
      access_password_hash: null,
      story_milestones: [],
      livestream_url: "",
      bank_accounts: [],
      music_path: "",
      gallery_images: [],
      whatsapp_number: "",
      share_message_id: "",
      share_message_en: "",
      updated_at: new Date().toISOString(),
    } satisfies AdminSettings;

    const merged = mergeSettings(input);
    expect(merged.groom_name).toBe("Ahmad");
    expect(merged.bride_name).toBe("Siti");
    expect(merged.template_id).toBe("dark-luxe");
  });

  it("fills empty story_milestones from defaults", () => {
    const merged = mergeSettings({
      project_id: "p1",
      template_id: "reference",
      groom_name: "A",
      bride_name: "B",
      wedding_date: "2026-11-15",
      ceremony_time: "",
      ceremony_venue_name: "",
      ceremony_venue_address: "",
      ceremony_maps_embed_url: "",
      reception_time: "",
      reception_venue_name: "",
      reception_venue_address: "",
      reception_maps_embed_url: "",
      groom_father_name: "",
      groom_mother_name: "",
      bride_father_name: "",
      bride_mother_name: "",
      opening_quote: "",
      opening_greeting_id: "",
      opening_greeting_en: "",
      formal_address_id: "",
      gift_shipping_address: "",
      footer_sustainability_id: "",
      footer_sustainability_en: "",
      footer_credit: "",
      is_password_protected: false,
      access_password_hash: null,
      story_milestones: [],
      livestream_url: "",
      bank_accounts: [],
      music_path: "",
      gallery_images: null as unknown as [],
      whatsapp_number: "",
      share_message_id: "",
      share_message_en: "",
      updated_at: new Date().toISOString(),
    });
    expect(merged.story_milestones.length).toBeGreaterThan(0);
    expect(merged.bank_accounts.length).toBeGreaterThan(0);
    expect(merged.gallery_images).toEqual([]);
  });
});
