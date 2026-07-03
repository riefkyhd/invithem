"use client";

import QRCode from "qrcode";
import { Fragment, useState } from "react";
import {
  addGuest,
  deleteGuest,
  getGuests,
  importGuestsCsv,
  updateGuest,
} from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { projectInvitationUrl } from "@/lib/projects/urls";
import type { Guest, GuestCategory, WeddingEvent } from "@/lib/types/database";

const CATEGORIES: { value: GuestCategory; label: string }[] = [
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
  { value: "VIP", label: "VIP" },
  { value: "colleagues", label: "Colleagues" },
];

interface GuestsPageClientProps {
  projectId: string;
  projectSlug: string;
  initialGuests: Guest[];
  events: WeddingEvent[];
}

export function GuestsPageClient({
  projectId,
  projectSlug,
  initialGuests,
  events,
}: GuestsPageClientProps) {
  const [guests, setGuests] = useState(initialGuests);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<GuestCategory>("friends");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(
    events.map((e) => e.id)
  );
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [qrDataUrls, setQrDataUrls] = useState<Record<string, string>>({});

  function invitationLink(guestSlug: string) {
    return projectInvitationUrl(projectSlug, guestSlug);
  }

  async function refreshGuests() {
    const data = await getGuests(projectId);
    setGuests(data);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await addGuest(
      projectId,
      name,
      category,
      whatsapp || undefined,
      selectedEventIds
    );
    setName("");
    setWhatsapp("");
    await refreshGuests();
  }

  function toggleEventSelection(eventId: string) {
    setSelectedEventIds((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  }

  async function toggleGuestEvent(guest: Guest, eventId: string) {
    const current = guest.event_ids ?? [];
    const next = current.includes(eventId)
      ? current.filter((id) => id !== eventId)
      : [...current, eventId];
    await updateGuest(projectId, guest.id, { eventIds: next });
    await refreshGuests();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this guest?")) return;
    await deleteGuest(projectId, id);
    if (expandedId === id) setExpandedId(null);
    await refreshGuests();
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
    await importGuestsCsv(projectId, rows);
    await refreshGuests();
    e.target.value = "";
  }

  function copyLink(guestSlug: string) {
    const link = invitationLink(guestSlug);
    navigator.clipboard.writeText(link);
    setCopied(guestSlug);
    setTimeout(() => setCopied(null), 2000);
  }

  async function downloadQr(guest: Guest) {
    const link = invitationLink(guest.slug);
    const dataUrl = await QRCode.toDataURL(link, { width: 512, margin: 2 });
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = `${guest.slug}-qr.png`;
    anchor.click();
  }

  async function toggleExpand(guest: Guest) {
    if (expandedId === guest.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(guest.id);
    if (!qrDataUrls[guest.id]) {
      const link = invitationLink(guest.slug);
      const dataUrl = await QRCode.toDataURL(link, { width: 256, margin: 2 });
      setQrDataUrls((prev) => ({ ...prev, [guest.id]: dataUrl }));
    }
  }

  function exportCsv() {
    const header = "name,category,whatsapp_number,slug,invitation_link\n";
    const rows = guests
      .map(
        (g) =>
          `"${g.name}","${g.category}","${g.whatsapp_number || ""}","${g.slug}","${invitationLink(g.slug)}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "guests.csv";
    link.click();
    URL.revokeObjectURL(url);
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
          {events.length > 0 && (
            <div className="sm:col-span-2">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                Invited to events
              </p>
              <div className="flex flex-wrap gap-3">
                {events.map((event) => (
                  <label
                    key={event.id}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-card-border px-3 py-1.5 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEventIds.includes(event.id)}
                      onChange={() => toggleEventSelection(event.id)}
                    />
                    {event.label}
                  </label>
                ))}
              </div>
            </div>
          )}
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

      <div className="mb-4 flex justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={exportCsv}
          disabled={guests.length === 0}
        >
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
                <Fragment key={guest.id}>
                  <tr className="border-b border-card-border transition-colors hover:bg-surface/30">
                    <td className="px-5 py-4 font-medium">{guest.name}</td>
                    <td className="px-5 py-4 capitalize text-muted">
                      {guest.category}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => copyLink(guest.slug)}
                        >
                          {copied === guest.slug ? "Copied!" : "Copy link"}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => downloadQr(guest)}
                        >
                          QR
                        </Button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(guest)}
                        >
                          {expandedId === guest.id ? "Hide" : "Details"}
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(guest.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === guest.id && (
                    <tr className="border-b border-card-border bg-surface/20">
                      <td colSpan={4} className="px-5 py-6">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                          {qrDataUrls[guest.id] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={qrDataUrls[guest.id]}
                              alt={`QR code for ${guest.name}`}
                              className="h-40 w-40 shrink-0 rounded-lg border border-card-border bg-white p-2"
                            />
                          )}
                          <div className="min-w-0 flex-1 space-y-3">
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                                Invitation link
                              </p>
                              <p className="mt-1 break-all text-sm">
                                {invitationLink(guest.slug)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                                Guest slug
                              </p>
                              <p className="mt-1 text-sm text-muted">
                                {guest.slug}
                              </p>
                            </div>
                            {events.length > 0 && (
                              <div>
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                                  Invited events
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {events.map((event) => (
                                    <label
                                      key={event.id}
                                      className="flex items-center gap-2 text-sm"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={(guest.event_ids ?? []).includes(
                                          event.id
                                        )}
                                        onChange={() =>
                                          toggleGuestEvent(guest, event.id)
                                        }
                                      />
                                      {event.label}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => copyLink(guest.slug)}
                              >
                                Copy link
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => downloadQr(guest)}
                              >
                                Download QR
                              </Button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
