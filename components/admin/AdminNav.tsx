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
    <nav className="border-b border-card-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/admin" className="font-display text-xl">
          Invithem Admin
        </Link>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors hover:text-accent ${
                pathname === item.href ? "text-accent" : "text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
