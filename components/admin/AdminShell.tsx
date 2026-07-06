"use client";

import type { Project } from "@/lib/types/database";
import { AdminNav } from "@/components/admin/AdminNav";

export function AdminShell({
  projects,
  children,
}: {
  projects: Project[];
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNav projects={projects} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </>
  );
}
