"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getRsvps } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

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
  const { projectId } = useParams<{ projectId: string }>();
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getRsvps(projectId).then((data) => {
      setRsvps(data as RsvpRow[]);
      setLoading(false);
    });
  }, [projectId]);

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

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted">Loading RSVPs…</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="RSVPs"
        description="Search, filter, and export guest confirmations."
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Search"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              label="Filter"
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "yes" | "no")
              }
              options={[
                { value: "all", label: "All responses" },
                { value: "yes", label: "Attending" },
                { value: "no", label: "Not attending" },
              ]}
            />
          </div>
        </div>
        <Button type="button" variant="secondary" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-card-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-card-border bg-surface/50">
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-muted">
                Name
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-muted">
                Attending
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-muted">
                Guests
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-muted">
                Meal
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-muted">
                Message
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-muted">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted">
                  No RSVPs found.
                </td>
              </tr>
            ) : (
              filtered.map((rsvp) => (
                <tr
                  key={rsvp.id}
                  className="border-b border-card-border last:border-0 hover:bg-surface/30"
                >
                  <td className="px-5 py-4 font-medium">{rsvp.name}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        rsvp.attending
                          ? "bg-accent/15 text-accent"
                          : "bg-surface text-muted"
                      }`}
                    >
                      {rsvp.attending ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-5 py-4">{rsvp.guest_count}</td>
                  <td className="px-5 py-4 text-muted">
                    {rsvp.meal_preference || "—"}
                  </td>
                  <td className="max-w-xs truncate px-5 py-4 text-muted">
                    {rsvp.message || "—"}
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {new Date(rsvp.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
