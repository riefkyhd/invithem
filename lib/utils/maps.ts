/**
 * Google Maps embed helpers.
 *
 * Users typically paste a Maps *share* link (e.g. https://maps.app.goo.gl/xxx)
 * or a place URL. Neither can be loaded inside an <iframe> because Google sends
 * X-Frame-Options on those pages. Only the `output=embed` / `/maps/embed`
 * variants are frame-safe, so we normalize whatever the user provides.
 */

const SHORT_LINK_HOSTS = ["maps.app.goo.gl", "goo.gl", "g.co"];

function isEmbeddable(url: string): boolean {
  return url.includes("/maps/embed") || /[?&]output=embed\b/.test(url);
}

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

/**
 * Extract a query usable by `?q=...&output=embed` from a full Maps URL.
 * Prefers explicit coordinates, then a `q`/`query` param, then the place name.
 */
function extractMapQuery(url: string): string {
  try {
    const parsed = new URL(url);

    const coordMatch = parsed.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) return `${coordMatch[1]},${coordMatch[2]}`;

    const dataCoord = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (dataCoord) return `${dataCoord[1]},${dataCoord[2]}`;

    const q = parsed.searchParams.get("q") || parsed.searchParams.get("query");
    if (q) return q;

    const placeMatch = parsed.pathname.match(/\/maps\/place\/([^/]+)/);
    if (placeMatch) return decodeURIComponent(placeMatch[1]).replace(/\+/g, " ");
  } catch {
    // fall through
  }
  return url;
}

/**
 * Convert any Maps URL/address into a frame-safe embed URL. Synchronous:
 * assumes short links are already resolved (see resolveMapsEmbedUrl).
 */
export function toMapsEmbedUrl(raw: string | null | undefined): string {
  if (!raw) return "";
  const url = raw.trim();
  if (!url) return "";
  if (isEmbeddable(url)) return url;

  const query = extractMapQuery(url);
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    query
  )}&z=16&output=embed`;
}

/**
 * Server-side: follow short-link redirects to their full Maps URL, then
 * normalize into an embeddable URL. Falls back gracefully on network errors.
 */
export async function resolveMapsEmbedUrl(
  raw: string | null | undefined
): Promise<string> {
  if (!raw) return "";
  let url = raw.trim();
  if (!url) return "";
  if (isEmbeddable(url)) return url;

  if (isShortLink(url)) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.url) url = res.url;
    } catch {
      // keep original; toMapsEmbedUrl will still produce a best-effort embed
    }
  }

  return toMapsEmbedUrl(url);
}
