"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import { ProjectSwitcher } from "@/components/admin/ProjectSwitcher";
import type { Project } from "@/lib/types/database";

interface AdminNavProps {
  projectId?: string;
  projects?: Project[];
}

export function AdminNav({ projectId, projects = [] }: AdminNavProps) {
  const pathname = usePathname();
  const base = projectId ? `/admin/projects/${projectId}` : "/admin/projects";

  const navItems = projectId
    ? [
        { href: base, label: "Dashboard", exact: true },
        { href: `${base}/guests`, label: "Guests", exact: false },
        { href: `${base}/rsvps`, label: "RSVPs", exact: false },
        { href: `${base}/wishes`, label: "Wishes", exact: false },
        { href: `${base}/design`, label: "Design", exact: false },
        { href: `${base}/settings`, label: "Settings", exact: false },
      ]
    : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-card-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={projectId ? base : "/admin/projects"}
            className="shrink-0 font-display text-xl tracking-tight"
          >
            Invithem
            <span className="ml-2 text-xs font-sans font-normal uppercase tracking-widest text-muted">
              Admin
            </span>
          </Link>
          {projectId && projects.length > 0 && (
            <ProjectSwitcher
              projects={projects}
              currentProjectId={projectId}
            />
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`hidden rounded-full px-3 py-1.5 text-sm transition-all sm:inline-block sm:px-4 ${
                  active
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {!projectId && (
            <Link
              href="/admin/projects/new"
              className="rounded-full bg-accent px-3 py-1.5 text-sm text-accent-foreground transition-opacity hover:opacity-90 sm:px-4"
            >
              New project
            </Link>
          )}
          <form action={signOut} className="ml-1 sm:ml-2">
            <button
              type="submit"
              className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
