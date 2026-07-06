"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types/database";

interface ProjectSwitcherProps {
  projects: Project[];
  currentProjectId: string;
  currentPathSuffix?: string;
}

export function ProjectSwitcher({
  projects,
  currentProjectId,
  currentPathSuffix = "",
}: ProjectSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = projects.find((p) => p.id === currentProjectId);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function projectHref(id: string) {
    return `/admin/projects/${id}${currentPathSuffix}`;
  }

  return (
    <div ref={ref} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex max-w-[min(100%,14rem)] items-center gap-2 rounded-lg border border-card-border bg-surface/50 px-3 py-1.5 text-sm transition-colors hover:border-accent/50"
      >
        <span className="truncate font-medium">
          {current?.name ?? "Select project"}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-card-border bg-card shadow-lg">
          <div className="max-h-64 overflow-y-auto py-1">
            {projects.map((project) => {
              const isCurrent = project.id === currentProjectId;
              return (
                <Link
                  key={project.id}
                  href={projectHref(project.id)}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    isCurrent
                      ? "bg-accent/15 font-medium text-accent"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <span className="block truncate">{project.name}</span>
                  <span className="text-xs text-muted">/{project.slug}</span>
                </Link>
              );
            })}
          </div>
          <div className="border-t border-card-border">
            <Link
              href="/admin/projects"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              All projects
            </Link>
            <Link
              href="/admin/projects/new"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-accent transition-colors hover:bg-surface"
            >
              + New project
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
