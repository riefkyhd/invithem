"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProject } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";

function slugifyInput(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(slugifyInput(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await createProject(name, slug);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.project) {
      router.push(`/admin/projects/${result.project.id}`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader
        title="New project"
        description="Create a wedding invitation project. Configure content and design after creation."
      />

      <FormSection title="Project details">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Project name"
            placeholder="Ahmad & Siti Wedding"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
          <Input
            label="URL slug"
            placeholder="ahmad-siti"
            hint="Used in your invitation link: /w/your-slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create project"}
            </Button>
            <Button href="/admin/projects" variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </FormSection>
    </div>
  );
}
