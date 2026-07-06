"use client";

import type { Project } from "@/lib/types/database";
import { AdminNav } from "@/components/admin/AdminNav";

export function AdminShell({
  projects,
  accountEmail,
  authDisabled = false,
  children,
}: {
  projects: Project[];
  accountEmail?: string;
  authDisabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      {authDisabled ? (
        <div className="border-b border-amber-300 bg-amber-50 px-6 py-2 text-center text-sm text-amber-950">
          Auth disabled for UI tooling — remove{" "}
          <code className="rounded bg-amber-100 px-1">INVITHEM_DISABLE_AUTH</code>{" "}
          before going live.
        </div>
      ) : null}
      <AdminNav projects={projects} accountEmail={accountEmail} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </>
  );
}
