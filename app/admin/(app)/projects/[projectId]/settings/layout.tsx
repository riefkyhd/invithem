"use client";

import { useParams, usePathname } from "next/navigation";
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
      {isGeneral ? (
        children
      ) : (
        <ProjectSettingsProvider projectId={projectId}>
          {children}
          <SettingsSaveBar />
        </ProjectSettingsProvider>
      )}
    </div>
  );
}
