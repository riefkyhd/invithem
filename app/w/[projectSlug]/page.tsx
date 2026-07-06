import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TemplateRenderer } from "@/components/invitation/TemplateRenderer";
import { PasswordGate } from "@/components/invitation/PasswordGate";
import { loadWeddingPageData } from "@/lib/invitation/load-wedding-page";
import { createTemplateLoadPromise } from "@/templates/registry";

export const dynamic = "force-dynamic";

export default async function WeddingPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const { templateId, weddingData, requiresPassword, hasAccess, gatePreview } =
    await loadWeddingPageData(projectSlug);

  if (requiresPassword && !hasAccess && gatePreview) {
    return <PasswordGate preview={gatePreview} />;
  }

  if (!weddingData) notFound();

  const templatePromise = createTemplateLoadPromise(templateId);

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
        templatePromise={templatePromise}
        projectSlug={projectSlug}
        data={weddingData}
      />
    </Suspense>
  );
}
