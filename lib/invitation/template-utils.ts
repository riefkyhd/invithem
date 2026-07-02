import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import type { WeddingData } from "@/lib/types/wedding-data";

export const PLACEHOLDER_GALLERY = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
  "https://images.unsplash.com/photo-1465495976277-81e6c1e16d18?w=600&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
];

export function getGalleryImages(data: WeddingData) {
  if (data.gallery.length > 0) return data.gallery;
  return PLACEHOLDER_GALLERY.map((url, i) => ({
    url,
    alt: `Gallery ${i + 1}`,
  }));
}

export function formatWeddingDate(date: string, locale: "id" | "en") {
  const dateLocale = locale === "id" ? idLocale : enUS;
  return format(new Date(date), "EEEE, d MMMM yyyy", { locale: dateLocale });
}

export function getStoryImageUrl(imagePath?: string) {
  return imagePath
    ? getStoragePublicUrl("story", imagePath)
    : "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80";
}

export function getLivestreamEmbedUrl(url: string) {
  if (url.includes("youtube.com/watch")) {
    return url.replace("watch?v=", "embed/");
  }
  if (url.includes("youtu.be/")) {
    return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;
  }
  return url;
}
