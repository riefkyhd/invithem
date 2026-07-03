import { Suspense } from "react";
import { TemplateRenderer } from "@/components/invitation/TemplateRenderer";
import { buildWeddingData } from "@/lib/invitation/build-wedding-data";
import { mergeSettings } from "@/lib/content/placeholders";
import {
  getProjectSettingsBySlug,
  getProjectWishesBySlug,
  getProjectBySlug,
} from "@/lib/projects/resolve-project";
import type { TemplateId } from "@/lib/types/database";
import { getTemplateMeta, isValidTemplateId } from "@/templates/registry";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ template_id: string }>;
  searchParams: Promise<{ project?: string }>;
}) {
  const { template_id } = await params;
  const { project: projectSlugParam } = await searchParams;

  if (!isValidTemplateId(template_id)) {
    notFound();
  }

  const projectSlug = projectSlugParam ?? "my-wedding";
  const project = await getProjectBySlug(projectSlug);
  if (!project) notFound();

  const meta = getTemplateMeta(template_id);
  const [settings, wishes] = await Promise.all([
    getProjectSettingsBySlug(projectSlug),
    getProjectWishesBySlug(projectSlug),
  ]);
  const merged = mergeSettings(settings);
  const weddingData = buildWeddingData(merged, {
    projectId: project.id,
    projectSlug: project.slug,
    wishes,
  });

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <TemplateRenderer
        templateId={template_id as TemplateId}
        projectSlug={projectSlug}
        data={weddingData}
        previewMode
        previewLabel={meta?.name}
      />
    </Suspense>
  );
}
