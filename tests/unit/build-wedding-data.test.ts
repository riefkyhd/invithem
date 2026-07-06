import { describe, expect, it } from "vitest";
import { buildWeddingData } from "@/lib/invitation/build-wedding-data";
import type { AdminSettings, WeddingEvent } from "@/lib/types/database";

const baseSettings: AdminSettings = {
  project_id: "proj-1",
  template_id: "reference",
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
  groom_father_name: "Bapak Ahmad",
  groom_mother_name: "Ibu Ahmad",
  bride_father_name: "Bapak Siti",
  bride_mother_name: "Ibu Siti",
  opening_quote: "Quote",
  opening_greeting_id: "Halo",
  opening_greeting_en: "Hello",
  formal_address_id: "Bapak/Ibu",
  gift_shipping_address: "",
  footer_sustainability_id: "",
  footer_sustainability_en: "",
  footer_credit: "Invithem",
  is_password_protected: false,
  access_password_hash: null,
  story_milestones: [],
  livestream_url: "",
  bank_accounts: [],
  music_path: "",
  gallery_images: [],
  whatsapp_number: "628123456789",
  share_message_id: "Undangan",
  share_message_en: "Invitation",
  updated_at: new Date().toISOString(),
};

const events: WeddingEvent[] = [
  {
    id: "evt-1",
    project_id: "proj-1",
    label: "Akad",
    datetime: "2026-11-15T02:00:00.000Z",
    venue_name: "Masjid",
    venue_address: "Jakarta",
    maps_embed_url: "https://maps.google.com/maps?q=Jakarta&output=embed",
    sort_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "evt-2",
    project_id: "proj-1",
    label: "Reception",
    datetime: "2026-11-15T06:00:00.000Z",
    venue_name: "Hotel",
    venue_address: "Jakarta",
    maps_embed_url: "",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
];

describe("buildWeddingData", () => {
  it("builds couple monogram from names", () => {
    const data = buildWeddingData(baseSettings, {
      projectId: "proj-1",
      projectSlug: "ahmad-siti",
      events,
    });
    expect(data.couple.monogram).toBe("AS");
    expect(data.couple.groomName).toBe("Ahmad");
    expect(data.couple.brideName).toBe("Siti");
  });

  it("includes all events when guest has no event filter", () => {
    const data = buildWeddingData(baseSettings, {
      projectId: "proj-1",
      projectSlug: "ahmad-siti",
      events,
    });
    expect(data.events).toHaveLength(2);
  });

  it("filters events by guest invitation", () => {
    const data = buildWeddingData(baseSettings, {
      projectId: "proj-1",
      projectSlug: "ahmad-siti",
      events,
      guest: {
        id: "g1",
        slug: "budi",
        name: "Budi",
        category: "friends",
        eventIds: ["evt-1"],
      },
    });
    expect(data.events).toHaveLength(1);
    expect(data.events[0].label).toBe("Akad");
  });

  it("uses custom invitation URL when provided", () => {
    const data = buildWeddingData(baseSettings, {
      projectId: "proj-1",
      projectSlug: "ahmad-siti",
      invitationUrl: "https://custom.example/invite",
      events,
    });
    expect(data.share.invitationUrl).toBe("https://custom.example/invite");
  });

  it("marks password protected from settings", () => {
    const data = buildWeddingData(
      { ...baseSettings, is_password_protected: true },
      { projectId: "proj-1", projectSlug: "ahmad-siti", events }
    );
    expect(data.isPasswordProtected).toBe(true);
  });

  it("handles null settings with defaults", () => {
    const data = buildWeddingData(null, {
      projectId: "proj-1",
      projectSlug: "ahmad-siti",
      events: [],
    });
    expect(data.couple.groomName).toContain("FILL IN");
    expect(data.events).toHaveLength(0);
  });
});
