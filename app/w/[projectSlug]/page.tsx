import { Suspense } from "react";
import { TemplateRenderer } from "@/components/invitation/TemplateRenderer";
import { PasswordGate } from "@/components/invitation/PasswordGate";
import { loadWeddingPageData } from "@/lib/invitation/load-wedding-page";

export const dynamic = "force-dynamic";

export default async function WeddingPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const { templateId, weddingData, requiresPassword, hasAccess } =
    await loadWeddingPageData(projectSlug);

  const content = (
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

  if (requiresPassword && !hasAccess) {
    return <PasswordGate data={weddingData}>{content}</PasswordGate>;
  }

  return content;
}
