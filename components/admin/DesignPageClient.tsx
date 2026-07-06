"use client";

import { useTransition } from "react";
import { updateTemplateId } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import type { TemplateId } from "@/lib/types/database";
import { getAllTemplateMeta } from "@/templates/registry";

interface DesignPageClientProps {
  projectId: string;
  projectSlug: string;
  currentTemplateId: TemplateId;
}

export function DesignPageClient({
  projectId,
  projectSlug,
  currentTemplateId,
}: DesignPageClientProps) {
  const templates = getAllTemplateMeta();
  const [isPending, startTransition] = useTransition();

  function handleSelect(id: string) {
    startTransition(async () => {
      await updateTemplateId(projectId, id);
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Design"
        description="Choose a visual template for your invitation. Changes apply immediately — no redeploy needed."
      />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const isActive = template.id === currentTemplateId;
          return (
            <div
              key={template.id}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isActive
                  ? "border-accent ring-2 ring-accent/30"
                  : "border-card-border hover:border-accent/50"
              }`}
            >
              <div className="relative aspect-[9/16] bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="space-y-3 p-5">
                <div>
                  <h3 className="font-display text-lg">{template.name}</h3>
                  <p className="mt-1 text-sm text-muted">{template.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    href={`/preview/${template.id}?project=${encodeURIComponent(projectSlug)}`}
                    target="_blank"
                    variant="secondary"
                    size="sm"
                  >
                    Preview
                  </Button>
                  <Button
                    type="button"
                    disabled={isActive || isPending}
                    onClick={() => handleSelect(template.id)}
                    variant="primary"
                    size="sm"
                  >
                    {isActive ? "Active" : "Use this design"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
