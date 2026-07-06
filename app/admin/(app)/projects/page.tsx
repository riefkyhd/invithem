import Link from "next/link";
import { listProjects } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DuplicateProjectButton } from "@/components/admin/DuplicateProjectButton";

export const dynamic = "force-dynamic";

export default async function ProjectsListPage() {
  const projects = await listProjects();

  return (
    <div>
      <AdminPageHeader
        title="Your projects"
        description="Each project is a separate wedding invitation — like a repository in GitHub or a project in Vercel."
      />

      <div className="mb-8">
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm text-accent-foreground transition-opacity hover:opacity-90"
        >
          + Create new project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-card-border bg-card px-6 py-16 text-center">
          <p className="text-muted">No projects yet.</p>
          <Link
            href="/admin/projects/new"
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            Create your first invitation
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl border border-card-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-sm"
            >
              <Link href={`/admin/projects/${project.id}`} className="block">
                <h2 className="font-display text-xl group-hover:text-accent">
                  {project.name}
                </h2>
                <p className="mt-1 text-sm text-muted">/{project.slug}</p>
                <span
                  className={`mt-4 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    project.status === "published"
                      ? "bg-accent/15 text-accent"
                      : "bg-surface text-muted"
                  }`}
                >
                  {project.status}
                </span>
              </Link>
              <DuplicateProjectButton
                sourceProjectId={project.id}
                sourceName={project.name}
                sourceSlug={project.slug}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
