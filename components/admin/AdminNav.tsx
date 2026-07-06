"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import { ProjectSwitcher } from "@/components/admin/ProjectSwitcher";
import type { Project } from "@/lib/types/database";

interface AdminNavProps {
  projects: Project[];
}

const PROJECT_NAV = [
  { segment: "", label: "Dashboard", exact: true },
  { segment: "/guests", label: "Guests" },
  { segment: "/rsvps", label: "RSVPs" },
  { segment: "/wishes", label: "Wishes" },
  { segment: "/checkin", label: "Check-in" },
  { segment: "/design", label: "Design" },
  { segment: "/settings/general", label: "Settings" },
] as const;

function extractProjectId(pathname: string): string | null {
  const match = pathname.match(/^\/admin\/projects\/([^/]+)/);
  return match?.[1] ?? null;
}

export function AdminNav({ projects }: AdminNavProps) {
  const pathname = usePathname();
  const projectId = extractProjectId(pathname);
  const currentProject = projectId
    ? projects.find((p) => p.id === projectId)
    : undefined;
  const projectBase = projectId ? `/admin/projects/${projectId}` : null;

  const isAppSettings = pathname.startsWith("/admin/settings");
  const isProjectsList =
    pathname === "/admin/projects" || pathname === "/admin/projects/new";

  return (
    <header className="sticky top-0 z-50 border-b border-card-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/admin/projects" className="shrink-0 font-display text-lg">
            Invithem
          </Link>

          {projectId && currentProject ? (
            <>
              <span className="text-muted" aria-hidden>
                /
              </span>
              <ProjectSwitcher
                projects={projects}
                currentProjectId={projectId}
                currentPathSuffix={
                  pathname.replace(`/admin/projects/${projectId}`, "") || ""
                }
              />
            </>
          ) : (
            <span className="hidden text-sm text-muted sm:inline">
              Workspace
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/admin/projects"
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              isProjectsList
                ? "bg-accent/15 text-accent"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            Projects
          </Link>
          <Link
            href="/admin/settings"
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              isAppSettings
                ? "bg-accent/15 text-accent"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            Account
          </Link>
          {!projectId && (
            <Link
              href="/admin/projects/new"
              className="ml-1 rounded-full bg-accent px-3 py-1.5 text-sm text-accent-foreground transition-opacity hover:opacity-90"
            >
              New project
            </Link>
          )}
          <form action={signOut} className="ml-1">
            <button
              type="submit"
              className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              Logout
            </button>
          </form>
        </div>
      </div>

      {projectBase && (
        <div className="border-t border-card-border/60">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 py-2">
            {PROJECT_NAV.map((item) => {
              const href = `${projectBase}${item.segment}`;
              const active =
                "exact" in item && item.exact
                  ? pathname === href
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={item.segment}
                  href={href}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-accent/15 font-medium text-accent"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
