import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TemplateRenderer } from "@/components/invitation/TemplateRenderer";
import { buildWeddingData } from "@/lib/invitation/build-wedding-data";
import { mergeSettings } from "@/lib/content/placeholders";
import {
  getProjectBySlug,
  getProjectSettingsBySlug,
  getProjectWishesBySlug,
} from "@/lib/projects/resolve-project";
import type { TemplateId } from "@/lib/types/database";
import { resolveMapsEmbedUrl } from "@/lib/utils/maps";
import { isValidTemplateId } from "@/templates/registry";

export const dynamic = "force-dynamic";

export default async function WeddingPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const project = await getProjectBySlug(projectSlug);

  if (!project || project.status !== "published") {
    notFound();
  }

  const [settings, wishes] = await Promise.all([
    getProjectSettingsBySlug(projectSlug),
    getProjectWishesBySlug(projectSlug),
  ]);

  const merged = mergeSettings(settings);
  const templateId: TemplateId = isValidTemplateId(merged.template_id)
    ? merged.template_id
    : "reference";

  const [ceremonyMapsEmbedUrl, receptionMapsEmbedUrl] = await Promise.all([
    resolveMapsEmbedUrl(merged.ceremony_maps_embed_url),
    resolveMapsEmbedUrl(merged.reception_maps_embed_url),
  ]);

  const weddingData = buildWeddingData(merged, {
    projectId: project.id,
    projectSlug: project.slug,
    wishes,
    ceremonyMapsEmbedUrl,
    receptionMapsEmbedUrl,
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
        templateId={templateId}
        projectSlug={projectSlug}
        data={weddingData}
      />
    </Suspense>
  );
}
