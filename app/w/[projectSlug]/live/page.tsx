import { notFound } from "next/navigation";
import { LiveWishesWall } from "@/components/invitation/LiveWishesWall";
import { mergeSettings } from "@/lib/content/placeholders";
import {
  getProjectBySlug,
  getProjectSettingsBySlug,
} from "@/lib/projects/resolve-project";
import type { TemplateId } from "@/lib/types/database";
import { isValidTemplateId, loadTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

export default async function LivePage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const project = await getProjectBySlug(projectSlug);

  if (!project || project.status !== "published") {
    notFound();
  }

  const settings = await getProjectSettingsBySlug(projectSlug);
  const merged = mergeSettings(settings);
  const templateId: TemplateId = isValidTemplateId(merged.template_id)
    ? merged.template_id
    : "silent-heritage";

  const template = await loadTemplate(templateId);

  return (
    <div className={template.fonts.className}>
      <LiveWishesWall projectSlug={projectSlug} templateId={templateId} />
    </div>
  );
}
