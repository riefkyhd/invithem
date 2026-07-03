"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { duplicateProject } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface DuplicateProjectButtonProps {
  sourceProjectId: string;
  sourceName: string;
  sourceSlug: string;
}

export function DuplicateProjectButton({
  sourceProjectId,
  sourceName,
  sourceSlug,
}: DuplicateProjectButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(`${sourceName} (copy)`);
  const [slug, setSlug] = useState(`${sourceSlug}-copy`);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDuplicate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await duplicateProject(sourceProjectId, name, slug);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.project) {
      router.push(`/admin/projects/${result.project.id}`);
      router.refresh();
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="mt-3 text-xs text-muted transition-colors hover:text-accent"
      >
        Duplicate
      </button>
    );
  }

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleDuplicate}
      className="mt-4 space-y-3 border-t border-card-border pt-4"
    >
      <Input
        label="New name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="New slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "Duplicating…" : "Duplicate"}
        </Button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full px-3 py-1.5 text-xs text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
