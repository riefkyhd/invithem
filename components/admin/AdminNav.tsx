"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "@/components/admin/AccountMenu";
import { ProjectSwitcher } from "@/components/admin/ProjectSwitcher";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/lib/types/database";

interface AdminNavProps {
  projects: Project[];
  accountEmail?: string;
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

const SETTINGS_NAV = [
  { href: "general", label: "General" },
  { href: "content", label: "Invitation" },
  { href: "media", label: "Gifts & media" },
  { href: "privacy", label: "Privacy" },
] as const;

function extractProjectId(pathname: string): string | null {
  const match = pathname.match(/^\/admin\/projects\/([^/]+)/);
  return match?.[1] ?? null;
}

function NavTabRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl">
      <div
        className="flex gap-1 overflow-x-auto px-6 py-2 [-webkit-mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)]"
      >
        {children}
      </div>
    </div>
  );
}

export function AdminNav({ projects, accountEmail }: AdminNavProps) {
  const pathname = usePathname();
  const projectId = extractProjectId(pathname);
  const currentProject = projectId
    ? projects.find((p) => p.id === projectId)
    : undefined;
  const projectBase = projectId ? `/admin/projects/${projectId}` : null;

  const isProjectsList =
    pathname === "/admin/projects" || pathname === "/admin/projects/new";

  const isSettingsRoute =
    !!projectBase && pathname.startsWith(`${projectBase}/settings`);

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
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          <Button
            href="/admin/projects"
            variant="ghost"
            size="sm"
            active={isProjectsList}
          >
            Projects
          </Button>
          {!projectId && (
            <Button href="/admin/projects/new" variant="primary" size="sm">
              New project
            </Button>
          )}
          <AccountMenu email={accountEmail} />
        </div>
      </div>

      {projectBase && (
        <div className="border-t border-card-border/60">
          <NavTabRow>
            {PROJECT_NAV.map((item) => {
              const href = `${projectBase}${item.segment}`;
              const active =
                item.segment === "/settings/general"
                  ? pathname.startsWith(`${projectBase}/settings`)
                  : "exact" in item && item.exact
                    ? pathname === href
                    : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Button
                  key={item.segment}
                  href={href}
                  variant="ghost"
                  size="sm"
                  active={active}
                >
                  {item.label}
                </Button>
              );
            })}
          </NavTabRow>
        </div>
      )}

      {isSettingsRoute && projectId && (
        <div className="border-t border-card-border/40 bg-surface/30">
          <NavTabRow>
            {SETTINGS_NAV.map((item) => {
              const href = `/admin/projects/${projectId}/settings/${item.href}`;
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Button
                  key={item.href}
                  href={href}
                  variant="ghost"
                  size="sm"
                  active={active}
                >
                  {item.label}
                </Button>
              );
            })}
          </NavTabRow>
        </div>
      )}
    </header>
  );
}
