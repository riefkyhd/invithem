import { getGuests, getProject } from "@/app/admin/actions";
import { GuestsPageClient } from "@/components/admin/GuestsPageClient";
import { notFound } from "next/navigation";

export default async function AdminGuestsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [guests, project] = await Promise.all([
    getGuests(projectId),
    getProject(projectId),
  ]);

  if (!project) notFound();

  return (
    <GuestsPageClient
      projectId={projectId}
      projectSlug={project.slug}
      initialGuests={guests}
    />
  );
}
