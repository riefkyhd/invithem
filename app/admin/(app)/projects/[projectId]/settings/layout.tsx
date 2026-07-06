"use client";

import { useParams, usePathname } from "next/navigation";
import { ProjectSettingsNav } from "@/components/admin/ProjectSettingsNav";
import { ProjectSettingsProvider } from "@/components/admin/project-settings/ProjectSettingsProvider";
import { SettingsSaveBar } from "@/components/admin/project-settings/SettingsSaveBar";

export default function ProjectSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { projectId } = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const isGeneral = pathname.endsWith("/settings/general");

  return (
    <div className={isGeneral ? "" : "pb-24"}>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <ProjectSettingsNav projectId={projectId} />
        </aside>
        <div className="min-w-0">
          {isGeneral ? (
            children
          ) : (
            <ProjectSettingsProvider projectId={projectId}>
              {children}
              <SettingsSaveBar />
            </ProjectSettingsProvider>
          )}
        </div>
      </div>
    </div>
  );
}
