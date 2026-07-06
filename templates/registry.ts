import type { TemplateId } from "@/lib/types/database";
import type { TemplateMeta, TemplateModule } from "./types";

export const TEMPLATE_IDS = [
  "reference",
  "editorial-mono",
  "dark-luxe",
  "botanical-editorial",
  "maximalist-bold",
  "architectural-modern",
  "romantic-heirloom",
] as const satisfies readonly TemplateId[];

const TEMPLATE_META: Record<TemplateId, Omit<TemplateMeta, "id">> = {
  reference: {
    name: "Sage Editorial",
    description: "The original Invithem design — sage accents, editorial typography, dark elegance.",
    thumbnail: "/template-previews/reference.svg",
  },
  "editorial-mono": {
    name: "Editorial Mono",
    description: "Metropolitan gallery-poster — oversized type, true monochrome, asymmetric grid.",
    thumbnail: "/template-previews/editorial-mono.svg",
  },
  "dark-luxe": {
    name: "Dark Luxe",
    description: "Near-black luxury with champagne gold — formal, symmetrical, red-carpet elegance.",
    thumbnail: "/template-previews/dark-luxe.svg",
  },
  "botanical-editorial": {
    name: "Botanical Editorial",
    description: "Warm ivory garden wedding — sage and terracotta, organic flow, botanical accents.",
    thumbnail: "/template-previews/botanical-editorial.svg",
  },
  "maximalist-bold": {
    name: "Maximalist Bold",
    description: "Saturated color blocks, playful display type, magazine-cover energy.",
    thumbnail: "/template-previews/maximalist-bold.svg",
  },
  "architectural-modern": {
    name: "Architectural Modern",
    description: "Hard grid structure, sculptural blocks, precise sans-serif — portfolio minimalism.",
    thumbnail: "/template-previews/architectural-modern.svg",
  },
  "romantic-heirloom": {
    name: "Romantic Heirloom",
    description: "Timeless keepsake — dusty rose, monogram anchor, classic serif warmth.",
    thumbnail: "/template-previews/romantic-heirloom.svg",
  },
};

export function getAllTemplateMeta(): TemplateMeta[] {
  return TEMPLATE_IDS.map((id) => ({
    id,
    ...TEMPLATE_META[id],
  }));
}

export function getTemplateMeta(id: string): TemplateMeta | null {
  if (!TEMPLATE_IDS.includes(id as TemplateId)) return null;
  return { id, ...TEMPLATE_META[id as TemplateId] };
}

export function isValidTemplateId(id: string): id is TemplateId {
  return TEMPLATE_IDS.includes(id as TemplateId);
}

export async function loadTemplate(id: TemplateId): Promise<TemplateModule> {
  switch (id) {
    case "reference":
      return (await import("./reference")).default;
    case "editorial-mono":
      return (await import("./editorial-mono")).default;
    case "dark-luxe":
      return (await import("./dark-luxe")).default;
    case "botanical-editorial":
      return (await import("./botanical-editorial")).default;
    case "maximalist-bold":
      return (await import("./maximalist-bold")).default;
    case "architectural-modern":
      return (await import("./architectural-modern")).default;
    case "romantic-heirloom":
      return (await import("./romantic-heirloom")).default;
    default:
      return (await import("./reference")).default;
  }
}

const templateLoadPromises = new Map<TemplateId, Promise<TemplateModule>>();

/** Start template chunk load during SSR; pass the promise to TemplateRenderer. */
export function createTemplateLoadPromise(id: TemplateId): Promise<TemplateModule> {
  const existing = templateLoadPromises.get(id);
  if (existing) return existing;
  const promise = loadTemplate(id);
  templateLoadPromises.set(id, promise);
  return promise;
}
