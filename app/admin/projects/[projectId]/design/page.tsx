import { getProject, getSettings } from "@/app/admin/actions";
import { DesignPageClient } from "@/components/admin/DesignPageClient";
import { mergeSettings } from "@/lib/content/placeholders";
import type { TemplateId } from "@/lib/types/database";

export default async function DesignPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [settings, project] = await Promise.all([
    getSettings(projectId),
    getProject(projectId),
  ]);
  const merged = mergeSettings(settings);
  const currentTemplateId: TemplateId = merged.template_id ?? "reference";

  return (
    <DesignPageClient
      projectId={projectId}
      projectSlug={project?.slug ?? "my-wedding"}
      currentTemplateId={currentTemplateId}
    />
  );
}
