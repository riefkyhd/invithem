"use client";

import { useEffect, useState } from "react";
import { getRsvps } from "@/app/admin/actions";

interface RsvpRow {
  id: string;
  name: string;
  attending: boolean;
  guest_count: number;
  meal_preference: string | null;
  message: string | null;
  created_at: string;
}

export default function AdminRsvpsPage() {
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRsvps().then((data) => {
      setRsvps(data as RsvpRow[]);
      setLoading(false);
    });
  }, []);

  const filtered = rsvps.filter((r) => {
    const matchesSearch = r.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "yes" && r.attending) ||
      (filter === "no" && !r.attending);
    return matchesSearch && matchesFilter;
  });

  function exportCsv() {
    const header = "Name,Attending,Guest Count,Meal,Message,Created At\n";
    const rows = filtered
      .map(
        (r) =>
          `"${r.name}",${r.attending},${r.guest_count},"${r.meal_preference || ""}","${(r.message || "").replace(/"/g, '""')}","${r.created_at}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rsvps.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl">RSVPs</h1>
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-full border border-card-border px-4 py-2 text-sm hover:border-accent"
        >
          Export CSV
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-card-border bg-surface px-4 py-2"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "yes" | "no")}
          className="rounded-xl border border-card-border bg-surface px-4 py-2"
        >
          <option value="all">All</option>
          <option value="yes">Attending</option>
          <option value="no">Not Attending</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-card-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-card-border bg-card">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Attending</th>
              <th className="p-4">Guests</th>
              <th className="p-4">Meal</th>
              <th className="p-4">Message</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rsvp) => (
              <tr key={rsvp.id} className="border-b border-card-border">
                <td className="p-4">{rsvp.name}</td>
                <td className="p-4">
                  <span
                    className={
                      rsvp.attending ? "text-accent" : "text-muted"
                    }
                  >
                    {rsvp.attending ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-4">{rsvp.guest_count}</td>
                <td className="p-4">{rsvp.meal_preference || "—"}</td>
                <td className="p-4 max-w-xs truncate">
                  {rsvp.message || "—"}
                </td>
                <td className="p-4 text-muted">
                  {new Date(rsvp.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
