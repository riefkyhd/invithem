import { unstable_cache } from "next/cache";
import { toMapsEmbedUrl } from "@/lib/utils/maps";
import type { WeddingEvent } from "@/lib/types/database";

const SHORT_LINK_HOSTS = ["maps.app.goo.gl", "goo.gl", "g.co"];

function isShortLink(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return SHORT_LINK_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

function isEmbeddable(url: string): boolean {
  return url.includes("/maps/embed") || /[?&]output=embed\b/.test(url);
}

const resolveShortMapLink = unstable_cache(
  async (url: string): Promise<string> => {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        next: { revalidate: 60 * 60 * 24 },
      });
      return res.url || url;
    } catch {
      return url;
    }
  },
  ["maps-short-link"],
  { revalidate: 60 * 60 * 24 }
);

async function resolveEventMapUrl(raw: string | null | undefined): Promise<string> {
  if (!raw) return "";
  const url = raw.trim();
  if (!url) return "";
  if (isEmbeddable(url)) return url;
  if (isShortLink(url)) {
    const resolved = await resolveShortMapLink(url);
    return toMapsEmbedUrl(resolved);
  }
  return toMapsEmbedUrl(url);
}

/** Resolve map embed URLs in parallel; only short links hit the network (cached 24h). */
export async function resolveEventMapsUrls(
  events: WeddingEvent[]
): Promise<Record<string, string>> {
  const entries = await Promise.all(
    events.map(async (event) => {
      const embed = await resolveEventMapUrl(event.maps_embed_url);
      return [event.id, embed] as const;
    })
  );
  return Object.fromEntries(entries);
}
