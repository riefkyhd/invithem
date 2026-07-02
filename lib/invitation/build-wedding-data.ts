import { mergeSettings } from "@/lib/content/placeholders";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { AdminSettings, Wish } from "@/lib/types/database";
import type { WeddingData } from "@/lib/types/wedding-data";

function buildMonogram(groomName: string, brideName: string): string {
  const g = groomName.trim().charAt(0).toUpperCase();
  const b = brideName.trim().charAt(0).toUpperCase();
  return `${g}${b}`;
}

export interface BuildWeddingDataContext {
  guest?: { id: string; name: string; slug: string } | null;
  wishes?: Wish[];
  invitationUrl?: string;
}

export function buildWeddingData(
  rawSettings: AdminSettings | null,
  context: BuildWeddingDataContext = {}
): WeddingData {
  const settings = mergeSettings(rawSettings);
  const slug = context.guest?.slug ?? "";

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const invitationUrl =
    context.invitationUrl ?? `${baseUrl}/?to=${slug}`;

  const gallery = (settings.gallery_images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => ({
      url: getStoragePublicUrl("gallery", img.path),
      alt: img.alt,
    }));

  const story = (settings.story_milestones ?? []).map((milestone) => ({
    ...milestone,
    image_path: milestone.image_path
      ? milestone.image_path
      : undefined,
  }));

  return {
    couple: {
      groomName: settings.groom_name,
      brideName: settings.bride_name,
      monogram: buildMonogram(settings.groom_name, settings.bride_name),
    },
    weddingDate: settings.wedding_date,
    venues: {
      ceremony: {
        time: settings.ceremony_time,
        name: settings.ceremony_venue_name,
        address: settings.ceremony_venue_address,
        mapsEmbedUrl: settings.ceremony_maps_embed_url,
      },
      reception: {
        time: settings.reception_time,
        name: settings.reception_venue_name,
        address: settings.reception_venue_address,
        mapsEmbedUrl: settings.reception_maps_embed_url,
      },
    },
    story,
    gallery,
    bankAccounts: settings.bank_accounts ?? [],
    livestreamUrl: settings.livestream_url || null,
    musicUrl: settings.music_path
      ? getStoragePublicUrl("music", settings.music_path)
      : null,
    whatsappNumber: settings.whatsapp_number,
    guest: context.guest ?? null,
    wishes: context.wishes ?? [],
    share: {
      invitationUrl,
      messageId: settings.share_message_id,
      messageEn: settings.share_message_en,
    },
  };
}
