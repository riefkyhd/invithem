"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SETTINGS_NAV = [
  { href: "general", label: "General", description: "Name, URL, publish status" },
  { href: "content", label: "Invitation", description: "Couple, events, story" },
  { href: "media", label: "Gifts & media", description: "Banks, music, photos" },
  { href: "privacy", label: "Privacy", description: "Password protection" },
] as const;

export function ProjectSettingsNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/admin/projects/${projectId}/settings`;

  return (
    <nav className="space-y-1">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
        Project settings
      </p>
      {SETTINGS_NAV.map((item) => {
        const href = `${base}/${item.href}`;
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={item.href}
            href={href}
            className={`block rounded-xl px-4 py-3 transition-colors ${
              active
                ? "bg-accent/15 text-accent"
                : "text-foreground hover:bg-surface"
            }`}
          >
            <span className="block text-sm font-medium">{item.label}</span>
            <span className="mt-0.5 block text-xs text-muted">{item.description}</span>
          </Link>
        );
      })}
    </nav>
  );
}
