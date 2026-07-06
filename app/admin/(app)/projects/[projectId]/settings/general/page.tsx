"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getProject,
  updateProject,
  updateProjectStatus,
} from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { projectInvitationUrl } from "@/lib/projects/urls";
import type { Project } from "@/lib/types/database";
import { useParams } from "next/navigation";

export default function GeneralProjectSettingsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getProject(projectId).then((p) => {
      if (p) {
        setProject(p);
        setName(p.name);
        setSlug(p.slug);
      }
    });
  }, [projectId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await updateProject(projectId, { name, slug });
    setSaving(false);
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Project updated.");
      const updated = await getProject(projectId);
      if (updated) setProject(updated);
    }
    setTimeout(() => setMessage(""), 4000);
  }

  async function setStatus(status: Project["status"]) {
    const result = await updateProjectStatus(projectId, status);
    setMessage(result.error ?? `Status set to ${status}.`);
    const updated = await getProject(projectId);
    if (updated) setProject(updated);
    setTimeout(() => setMessage(""), 4000);
  }

  if (!project) {
    return <p className="text-sm text-muted">Loading project…</p>;
  }

  const inviteUrl = projectInvitationUrl(project.slug);

  return (
    <div>
      <AdminPageHeader
        title="General"
        description="Name, URL, and publish status."
      />

      <form onSubmit={handleSave} className="space-y-6">
        <FormSection title="Project" description="Internal name and public URL slug.">
          <Input
            label="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="URL slug"
            hint="Public path: /w/your-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          {message && (
            <p
              className={`text-sm ${message.includes("updated") || message.includes("Status") ? "text-accent" : "text-red-400"}`}
            >
              {message}
            </p>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save project"}
          </Button>
        </FormSection>
      </form>

      <FormSection
        title="Invitation link"
        description="Share this URL with guests after publishing."
        className="mt-6"
      >
        <div className="rounded-xl border border-card-border bg-surface/50 px-4 py-3 text-sm">
          <Link
            href={inviteUrl}
            target="_blank"
            className="break-all text-accent hover:underline"
          >
            {inviteUrl}
          </Link>
        </div>
      </FormSection>

      <FormSection
        title="Publish status"
        description="Draft invitations are only visible to you. Published invitations are live."
        className="mt-6"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
              project.status === "published"
                ? "bg-accent/15 text-accent"
                : "bg-surface text-muted"
            }`}
          >
            {project.status}
          </span>
          {project.status !== "published" && (
            <Button type="button" size="sm" onClick={() => void setStatus("published")}>
              Publish invitation
            </Button>
          )}
          {project.status === "published" && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => void setStatus("draft")}
            >
              Unpublish
            </Button>
          )}
          {project.status !== "archived" && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => void setStatus("archived")}
            >
              Archive
            </Button>
          )}
        </div>
      </FormSection>
    </div>
  );
}
