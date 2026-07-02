"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/actions";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/guests", label: "Guests" },
  { href: "/admin/rsvps", label: "RSVPs" },
  { href: "/admin/wishes", label: "Wishes" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-card-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/admin" className="font-display text-xl tracking-tight">
          Invithem
          <span className="ml-2 text-xs font-sans font-normal uppercase tracking-widest text-muted">
            Admin
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm transition-all sm:px-4 ${
                  active
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <form action={signOut} className="ml-2">
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
