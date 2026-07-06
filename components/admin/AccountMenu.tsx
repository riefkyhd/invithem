"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

interface AccountMenuProps {
  email?: string;
}

function emailInitial(email?: string): string {
  if (!email) return "?";
  return email.charAt(0).toUpperCase();
}

export function AccountMenu({ email }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative ml-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-card-border bg-surface/50 text-sm font-medium transition-colors hover:border-accent/50"
      >
        {emailInitial(email)}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-card-border bg-card shadow-lg"
        >
          {email && (
            <p className="truncate border-b border-card-border px-4 py-2.5 text-xs text-muted">
              {email}
            </p>
          )}
          <div className="p-1">
            <Button
              href="/admin/settings"
              variant="ghost"
              size="sm"
              className="w-full justify-start rounded-lg"
              onClick={() => setOpen(false)}
            >
              Account settings
            </Button>
          </div>
          <div className="border-t border-card-border p-1">
            <form action={signOut}>
              <Button
                type="submit"
                variant="danger"
                size="sm"
                className="w-full justify-start rounded-lg"
              >
                Log out
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
