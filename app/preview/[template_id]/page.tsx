import { Suspense } from "react";
import { TemplateRenderer } from "@/components/invitation/TemplateRenderer";
import { buildWeddingData } from "@/lib/invitation/build-wedding-data";
import { mergeSettings } from "@/lib/content/placeholders";
import { createClient } from "@/lib/supabase/server";
import type { AdminSettings, TemplateId, Wish } from "@/lib/types/database";
import { getTemplateMeta, isValidTemplateId } from "@/templates/registry";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getSettings(): Promise<AdminSettings | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("admin_settings")
      .select("*")
      .eq("id", 1)
      .single();
    return data as AdminSettings | null;
  } catch {
    return null;
  }
}

async function getWishes(): Promise<Wish[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("wishes")
      .select("*")
      .eq("is_hidden", false)
      .order("created_at", { ascending: false })
      .limit(50);
    return (data as Wish[]) ?? [];
  } catch {
    return [];
  }
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ template_id: string }>;
}) {
  const { template_id } = await params;

  if (!isValidTemplateId(template_id)) {
    notFound();
  }

  const meta = getTemplateMeta(template_id);
  const [settings, wishes] = await Promise.all([getSettings(), getWishes()]);
  const merged = mergeSettings(settings);
  const weddingData = buildWeddingData(merged, { wishes });

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
        data={weddingData}
        previewMode
        previewLabel={meta?.name}
      />
    </Suspense>
  );
}
