import { Suspense } from "react";
import { TemplateRenderer } from "@/components/invitation/TemplateRenderer";
import { loadWeddingPageData } from "@/lib/invitation/load-wedding-page";
import { getTemplateMeta, isValidTemplateId } from "@/templates/registry";
import type { TemplateId } from "@/lib/types/database";
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

  if (!isValidTemplateId(template_id)) notFound();

  const projectSlug = projectSlugParam ?? "my-wedding";
  const meta = getTemplateMeta(template_id);
  const { weddingData } = await loadWeddingPageData(projectSlug);

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
