"use client";

import { useState } from "react";
import { setProjectPassword, upsertEvents } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { OPENING_GREETING_PRESETS } from "@/lib/content/placeholders";
import type { AdminSettings, WeddingEvent } from "@/lib/types/database";

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}

const emptyEvent = (): Omit<WeddingEvent, "created_at" | "project_id"> => ({
  id: crypto.randomUUID(),
  label: "",
  datetime: null,
  venue_name: "",
  venue_address: "",
  maps_embed_url: "",
  sort_order: 0,
});

interface SettingsExtendedProps {
  projectId: string;
  settings: AdminSettings;
  events: WeddingEvent[];
  onSettingsChange: <K extends keyof AdminSettings>(
    key: K,
    value: AdminSettings[K]
  ) => void;
  onEventsChange: (events: Omit<WeddingEvent, "created_at" | "project_id">[]) => void;
  /** When set, only render matching sections */
  sections?: "content" | "privacy";
}

export function SettingsExtendedSections({
  projectId,
  settings,
  events,
  onSettingsChange,
  onEventsChange,
  sections,
}: SettingsExtendedProps) {
  const [password, setPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const eventRows = events.map((e) => ({
    id: e.id,
    label: e.label,
    datetime: e.datetime,
    venue_name: e.venue_name,
    venue_address: e.venue_address,
    maps_embed_url: e.maps_embed_url,
    sort_order: e.sort_order,
  }));

  function updateEvent(
    index: number,
    field: keyof Omit<WeddingEvent, "created_at" | "project_id">,
    value: string | null
  ) {
    const next = [...eventRows];
    next[index] = { ...next[index], [field]: value };
    onEventsChange(next);
  }

  async function savePassword() {
    setPasswordMsg("");
    const result = await setProjectPassword(
      projectId,
      password || null,
      settings.is_password_protected
    );
    setPasswordMsg(result.error ?? "Password updated.");
    setPassword("");
    setTimeout(() => setPasswordMsg(""), 3000);
  }

  const showContent = !sections || sections === "content";
  const showPrivacy = !sections || sections === "privacy";

  return (
    <>
      {showContent && (
        <>
      <FormSection title="Parents" description="Free-text parent names with honorifics.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Groom's father"
            value={settings.groom_father_name}
            onChange={(e) => onSettingsChange("groom_father_name", e.target.value)}
          />
          <Input
            label="Groom's mother"
            value={settings.groom_mother_name}
            onChange={(e) => onSettingsChange("groom_mother_name", e.target.value)}
          />
          <Input
            label="Bride's father"
            value={settings.bride_father_name}
            onChange={(e) => onSettingsChange("bride_father_name", e.target.value)}
          />
          <Input
            label="Bride's mother"
            value={settings.bride_mother_name}
            onChange={(e) => onSettingsChange("bride_mother_name", e.target.value)}
          />
        </div>
      </FormSection>

      <FormSection title="Opening" description="Quote and greeting after the cover opens.">
        <div className="mb-4 flex flex-wrap gap-2">
          {(
            Object.entries(OPENING_GREETING_PRESETS) as [
              keyof typeof OPENING_GREETING_PRESETS,
              (typeof OPENING_GREETING_PRESETS)[keyof typeof OPENING_GREETING_PRESETS],
            ][]
          ).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                onSettingsChange("opening_greeting_id", preset.id);
                onSettingsChange("opening_greeting_en", preset.en);
              }}
              className="rounded-full border border-card-border px-3 py-1.5 text-xs capitalize transition-colors hover:border-accent"
            >
              {key}
            </button>
          ))}
        </div>
        <Textarea
          label="Opening quote (optional)"
          value={settings.opening_quote}
          onChange={(e) => onSettingsChange("opening_quote", e.target.value)}
          className="min-h-20"
        />
        <Textarea
          label="Greeting (Indonesian)"
          value={settings.opening_greeting_id}
          onChange={(e) => onSettingsChange("opening_greeting_id", e.target.value)}
          className="min-h-20"
        />
        <Textarea
          label="Greeting (English)"
          value={settings.opening_greeting_en}
          onChange={(e) => onSettingsChange("opening_greeting_en", e.target.value)}
          className="min-h-20"
        />
        <Input
          label="Formal address (Indonesian)"
          hint='Used before guest name, e.g. "Bapak/Ibu/Saudara/i"'
          value={settings.formal_address_id}
          onChange={(e) => onSettingsChange("formal_address_id", e.target.value)}
        />
      </FormSection>

      <FormSection title="Events" description="Add 1–4 events (Akad, Resepsi, Sangjit, etc.).">
        <div className="space-y-4">
          {eventRows.map((event, index) => (
            <div
              key={event.id}
              className="rounded-xl border border-card-border bg-surface/50 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-accent">
                  Event {index + 1}
                </span>
                {eventRows.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onEventsChange(eventRows.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid gap-4">
                <Input
                  label="Label"
                  placeholder="Akad / Resepsi / Sangjit"
                  value={event.label}
                  onChange={(e) => updateEvent(index, "label", e.target.value)}
                />
                <Input
                  label="Date & time"
                  type="datetime-local"
                  value={toDatetimeLocal(event.datetime)}
                  onChange={(e) =>
                    updateEvent(index, "datetime", fromDatetimeLocal(e.target.value))
                  }
                />
                <Input
                  label="Venue"
                  value={event.venue_name}
                  onChange={(e) => updateEvent(index, "venue_name", e.target.value)}
                />
                <Textarea
                  label="Address"
                  value={event.venue_address}
                  onChange={(e) =>
                    updateEvent(index, "venue_address", e.target.value)
                  }
                  className="min-h-20"
                />
                <Input
                  label="Google Maps link"
                  value={event.maps_embed_url}
                  onChange={(e) =>
                    updateEvent(index, "maps_embed_url", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
        {eventRows.length < 4 && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => onEventsChange([...eventRows, emptyEvent()])}
          >
            + Add event
          </Button>
        )}
      </FormSection>

      <FormSection title="Footer" description="Sustainability note and credit line.">
        <Textarea
          label="Sustainability (Indonesian)"
          value={settings.footer_sustainability_id}
          onChange={(e) =>
            onSettingsChange("footer_sustainability_id", e.target.value)
          }
          className="min-h-16"
        />
        <Textarea
          label="Sustainability (English)"
          value={settings.footer_sustainability_en}
          onChange={(e) =>
            onSettingsChange("footer_sustainability_en", e.target.value)
          }
          className="min-h-16"
        />
        <Input
          label="Credit line"
          value={settings.footer_credit}
          onChange={(e) => onSettingsChange("footer_credit", e.target.value)}
        />
      </FormSection>
        </>
      )}

      {showPrivacy && (
      <FormSection title="Passphrase gate" description="Optional password gate for the invitation.">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={settings.is_password_protected}
            onChange={(e) =>
              onSettingsChange("is_password_protected", e.target.checked)
            }
          />
          Require password to view invitation
        </label>
        <div className="mt-4 space-y-3">
          {settings.is_password_protected && (
            <Input
              label="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint="Leave blank to keep existing password"
            />
          )}
          <Button type="button" size="sm" onClick={savePassword}>
            {settings.is_password_protected
              ? "Update password"
              : "Remove password protection"}
          </Button>
          {passwordMsg && (
            <p className="text-sm text-muted">{passwordMsg}</p>
          )}
        </div>
      </FormSection>
      )}
    </>
  );
}

export async function saveEventsForProject(
  projectId: string,
  events: Omit<WeddingEvent, "created_at" | "project_id">[]
) {
  return upsertEvents(projectId, events);
}
