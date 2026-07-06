import { redirect } from "next/navigation";

export default async function ProjectSettingsIndex({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/admin/projects/${projectId}/settings/general`);
}
