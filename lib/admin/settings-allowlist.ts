import type { AdminSettings } from "@/lib/types/database";

/** Fields admins may update via updateSettings (password hash uses setProjectPassword). */
const UPDATABLE_SETTINGS_KEYS = [
  "template_id",
  "groom_name",
  "bride_name",
  "wedding_date",
  "ceremony_time",
  "ceremony_venue_name",
  "ceremony_venue_address",
  "ceremony_maps_embed_url",
  "reception_time",
  "reception_venue_name",
  "reception_venue_address",
  "reception_maps_embed_url",
  "groom_father_name",
  "groom_mother_name",
  "bride_father_name",
  "bride_mother_name",
  "opening_quote",
  "opening_greeting_id",
  "opening_greeting_en",
  "formal_address_id",
  "gift_shipping_address",
  "footer_sustainability_id",
  "footer_sustainability_en",
  "footer_credit",
  "story_milestones",
  "livestream_url",
  "bank_accounts",
  "music_path",
  "gallery_images",
  "whatsapp_number",
  "share_message_id",
  "share_message_en",
] as const satisfies readonly (keyof AdminSettings)[];

export function pickUpdatableSettings(
  settings: Partial<AdminSettings>
): Partial<AdminSettings> {
  const out: Partial<AdminSettings> = {};
  for (const key of UPDATABLE_SETTINGS_KEYS) {
    if (key in settings && settings[key] !== undefined) {
      (out as Record<string, unknown>)[key] = settings[key];
    }
  }
  return out;
}
