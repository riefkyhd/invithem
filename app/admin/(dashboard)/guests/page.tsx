"use client";

import { useEffect, useState } from "react";
import {
  addGuest,
  deleteGuest,
  getGuests,
  importGuestsCsv,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { buildInvitationLink } from "@/lib/utils/whatsapp";
import type { Guest, GuestCategory } from "@/lib/types/database";

const CATEGORIES: GuestCategory[] = [
  "family",
  "friends",
  "VIP",
  "colleagues",
];

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<GuestCategory>("friends");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  async function loadGuests() {
    const data = await getGuests();
    setGuests(data);
    setLoading(false);
  }

  useEffect(() => {
    void getGuests().then((data) => {
      setGuests(data);
      setLoading(false);
    });
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await addGuest(name, category, whatsapp || undefined);
    setName("");
    setWhatsapp("");
    loadGuests();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this guest?")) return;
    await deleteGuest(id);
    loadGuests();
  }

  async function handleCsvImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").slice(1);
    const rows = lines
      .map((line) => {
        const [name, category, whatsapp_number] = line
          .split(",")
          .map((s) => s.trim().replace(/^"|"$/g, ""));
        return { name, category: category || "friends", whatsapp_number };
      })
      .filter((r) => r.name);
    await importGuestsCsv(rows);
    loadGuests();
    e.target.value = "";
  }

  function copyLink(slug: string) {
    const link = buildInvitationLink(slug);
    navigator.clipboard.writeText(link);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="font-display mb-8 text-4xl">Guests</h1>

      <form
        onSubmit={handleAdd}
        className="mb-8 grid gap-4 rounded-2xl border border-card-border bg-card p-6 sm:grid-cols-4"
      >
        <Input
          placeholder="Guest name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="rounded-xl border border-card-border bg-surface px-4 py-3"
          value={category}
          onChange={(e) => setCategory(e.target.value as GuestCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Input
          placeholder="WhatsApp (optional)"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
        <Button type="submit">Add Guest</Button>
      </form>

      <div className="mb-6">
        <label className="cursor-pointer text-sm text-accent hover:underline">
          Import CSV
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCsvImport}
          />
        </label>
        <p className="mt-1 text-xs text-muted">
          CSV format: name, category, whatsapp_number
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-card-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-card-border bg-card">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Invitation Link</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id} className="border-b border-card-border">
                <td className="p-4">{guest.name}</td>
                <td className="p-4 capitalize">{guest.category}</td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => copyLink(guest.slug)}
                    className="text-accent hover:underline"
                  >
                    {copied === guest.slug ? "Copied!" : "Copy link"}
                  </button>
                </td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(guest.id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
