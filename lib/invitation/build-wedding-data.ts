import { mergeSettings } from "@/lib/content/placeholders";
import { projectInvitationUrl } from "@/lib/projects/urls";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { AdminSettings, WeddingEvent, Wish } from "@/lib/types/database";
import type { WeddingData, WeddingGuest } from "@/lib/types/wedding-data";
import { toMapsEmbedUrl } from "@/lib/utils/maps";

function buildMonogram(groomName: string, brideName: string): string {
  const g = groomName.trim().charAt(0).toUpperCase();
  const b = brideName.trim().charAt(0).toUpperCase();
  return `${g}${b}`;
}

function formatEventTime(datetime: string | null): string {
  if (!datetime) return "";
  try {
    return new Date(datetime).toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return "";
  }
}

export interface BuildWeddingDataContext {
  projectId: string;
  projectSlug: string;
  guest?: WeddingGuest | null;
  wishes?: Wish[];
  invitationUrl?: string;
  events?: WeddingEvent[];
  resolvedMapsUrls?: Record<string, string>;
}

export function buildWeddingData(
  rawSettings: AdminSettings | null,
  context: BuildWeddingDataContext
): WeddingData {
  const settings = mergeSettings(rawSettings);
  const guestSlug = context.guest?.slug ?? "";
  const guestEventIds = context.guest?.eventIds ?? [];

  const invitationUrl =
    context.invitationUrl ??
    projectInvitationUrl(context.projectSlug, guestSlug || undefined);

  const allEvents = (context.events ?? []).map((event) => ({
    id: event.id,
    label: event.label,
    datetime: event.datetime,
    time: formatEventTime(event.datetime),
    venueName: event.venue_name,
    venueAddress: event.venue_address,
    mapsEmbedUrl:
      context.resolvedMapsUrls?.[event.id] ??
      toMapsEmbedUrl(event.maps_embed_url),
  }));

  const events =
    guestEventIds.length > 0
      ? allEvents.filter((e) => guestEventIds.includes(e.id))
      : allEvents;

  const gallery = (settings.gallery_images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => ({
      url: getStoragePublicUrl("gallery", img.path),
      alt: img.alt,
    }));

  const story = (settings.story_milestones ?? []).map((milestone) => ({
    ...milestone,
    image_path: milestone.image_path ? milestone.image_path : undefined,
  }));

  return {
    projectId: context.projectId,
    projectSlug: context.projectSlug,
    couple: {
      groomName: settings.groom_name,
      brideName: settings.bride_name,
      monogram: buildMonogram(settings.groom_name, settings.bride_name),
    },
    weddingDate: settings.wedding_date,
    events,
    parents: {
      groom: {
        father: settings.groom_father_name,
        mother: settings.groom_mother_name,
      },
      bride: {
        father: settings.bride_father_name,
        mother: settings.bride_mother_name,
      },
    },
    opening: {
      quote: settings.opening_quote,
      greetingId: settings.opening_greeting_id,
      greetingEn: settings.opening_greeting_en,
      formalAddressId: settings.formal_address_id,
    },
    gift: {
      bankAccounts: settings.bank_accounts ?? [],
      shippingAddress: settings.gift_shipping_address,
    },
    footer: {
      sustainabilityId: settings.footer_sustainability_id,
      sustainabilityEn: settings.footer_sustainability_en,
      credit: settings.footer_credit,
    },
    isPasswordProtected: settings.is_password_protected,
    story,
    gallery,
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
