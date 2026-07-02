import { getStats } from "@/app/admin/actions";

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Invited", value: stats.totalInvited },
    { label: "Total RSVPs", value: stats.totalRsvp },
    { label: "Attending", value: stats.attending },
    { label: "Not Attending", value: stats.notAttending },
    { label: "Pending", value: stats.pending },
    { label: "Headcount", value: stats.headcount },
  ];

  return (
    <div>
      <h1 className="font-display mb-8 text-4xl">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-card-border bg-card p-6"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="font-display mt-2 text-4xl text-accent">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
