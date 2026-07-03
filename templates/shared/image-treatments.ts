import type { TemplateId } from "@/lib/types/database";

export const IMAGE_TREATMENTS: Record<TemplateId, string> = {
  reference: "tmpl-img-reference",
  "editorial-mono": "tmpl-img-editorial-mono",
  "dark-luxe": "tmpl-img-dark-luxe",
  "botanical-editorial": "tmpl-img-botanical",
  "maximalist-bold": "tmpl-img-maximalist",
  "architectural-modern": "tmpl-img-architectural",
  "romantic-heirloom": "tmpl-img-heirloom",
};

export function getImageTreatmentClass(templateId: TemplateId): string {
  return IMAGE_TREATMENTS[templateId] ?? "";
}
