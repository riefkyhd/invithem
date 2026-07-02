import { getSettings } from "@/app/admin/actions";
import { DesignPageClient } from "@/components/admin/DesignPageClient";
import { mergeSettings } from "@/lib/content/placeholders";
import type { TemplateId } from "@/lib/types/database";

export default async function DesignPage() {
  const settings = await getSettings();
  const merged = mergeSettings(settings);
  const currentTemplateId: TemplateId = merged.template_id ?? "reference";

  return <DesignPageClient currentTemplateId={currentTemplateId} />;
}
