import { getStats } from "@/app/admin/actions";
import { GettingStartedChecklist } from "@/components/admin/GettingStartedChecklist";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function ProjectDashboardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const stats = await getStats(projectId);

  const cards = [
    { label: "Total Invited", value: stats.totalInvited },
    { label: "Opened Invitations", value: stats.openedInvitations },
    { label: "Total RSVPs", value: stats.totalRsvp },
    { label: "Attending", value: stats.attending },
    { label: "Not Attending", value: stats.notAttending },
    { label: "Pending", value: stats.pending },
    { label: "Headcount", value: stats.headcount },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of invitations and RSVP responses."
      />

      <div className="mb-10">
        <GettingStartedChecklist projectId={projectId} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-card-border bg-card p-6 transition-colors hover:border-accent/30"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              {card.label}
            </p>
            <p className="font-display mt-3 text-4xl text-accent">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
