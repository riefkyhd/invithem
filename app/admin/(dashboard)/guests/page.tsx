"use client";

import { useEffect, useState } from "react";
import {
  addGuest,
  deleteGuest,
  getGuests,
  importGuestsCsv,
} from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { buildInvitationLink } from "@/lib/utils/whatsapp";
import type { Guest, GuestCategory } from "@/lib/types/database";

const CATEGORIES: { value: GuestCategory; label: string }[] = [
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
  { value: "VIP", label: "VIP" },
  { value: "colleagues", label: "Colleagues" },
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

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted">Loading guests…</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Guests"
        description="Add guests and copy personalized invitation links to send via WhatsApp."
      />

      <FormSection title="Add guest" className="mb-6">
        <form
          onSubmit={handleAdd}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
        >
          <Input
            label="Name"
            placeholder="Budi & Keluarga"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as GuestCategory)}
            options={CATEGORIES}
          />
          <Input
            label="WhatsApp"
            placeholder="6281234567890 (optional)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <Button type="submit" className="w-full sm:w-auto">
            Add guest
          </Button>
        </form>
      </FormSection>

      <FormSection title="Import CSV" className="mb-6">
        <FileUpload
          label="Guest list file"
          hint="Format: name, category, whatsapp_number"
          accept=".csv"
          onChange={handleCsvImport}
        />
      </FormSection>

      <div className="overflow-hidden rounded-2xl border border-card-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-card-border bg-surface/50">
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-muted">
                Name
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-muted">
                Category
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-muted">
                Invitation
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-muted">
                  No guests yet. Add one above or import a CSV.
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr
                  key={guest.id}
                  className="border-b border-card-border last:border-0 transition-colors hover:bg-surface/30"
                >
                  <td className="px-5 py-4 font-medium">{guest.name}</td>
                  <td className="px-5 py-4 capitalize text-muted">
                    {guest.category}
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => copyLink(guest.slug)}
                    >
                      {copied === guest.slug ? "Copied!" : "Copy link"}
                    </Button>
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(guest.id)}
                    >
                      Delete
                    </Button>
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
