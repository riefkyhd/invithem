"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getEvents, getSettings, updateSettings, uploadFile } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  saveEventsForProject,
  SettingsExtendedSections,
} from "@/components/admin/SettingsExtendedSections";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { compressImage } from "@/lib/utils/image-compression";
import type {
  AdminSettings,
  BankAccount,
  GalleryImage,
  StoryMilestone,
  WeddingEvent,
} from "@/lib/types/database";

function toDatetimeLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string): string {
  return value ? new Date(value).toISOString() : "";
}

const emptyBankAccount = (): BankAccount => ({
  label: "",
  bank: "",
  account_number: "",
  account_name: "",
});

const emptyMilestone = (): StoryMilestone => ({
  year: "",
  title: "",
  description: "",
});

export default function AdminSettingsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [pendingEvents, setPendingEvents] = useState<
    Omit<WeddingEvent, "created_at" | "project_id">[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    void Promise.all([getSettings(projectId), getEvents(projectId)]).then(
      ([s, e]) => {
        setSettings(s);
        setEvents(e);
        setPendingEvents(
          e.map((ev) => ({
            id: ev.id,
            label: ev.label,
            datetime: ev.datetime,
            venue_name: ev.venue_name,
            venue_address: ev.venue_address,
            maps_embed_url: ev.maps_embed_url,
            sort_order: ev.sort_order,
          }))
        );
      }
    );
  }, [projectId]);

  function updateField<K extends keyof AdminSettings>(
    key: K,
    value: AdminSettings[K]
  ) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    const { access_password_hash: _aph, ...safeSettings } = settings;
    const [settingsResult] = await Promise.all([
      updateSettings(projectId, safeSettings),
      saveEventsForProject(projectId, pendingEvents),
    ]);
    setSaving(false);
    setMessage(settingsResult.error ? settingsResult.error : "Settings saved successfully.");
    setTimeout(() => setMessage(""), 4000);
  }

  async function handleMusicUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `wedding-music-${Date.now()}.mp3`;
    const result = await uploadFile(projectId, "music", path, file);
    if (result.path) updateField("music_path", result.path);
    setUploading(false);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !settings) return;
    setUploading(true);
    const newImages: GalleryImage[] = [...settings.gallery_images];

    for (const file of Array.from(files)) {
      const compressed = await compressImage(file);
      const path = `gallery/${Date.now()}-${file.name}`;
      const result = await uploadFile(projectId, "gallery", path, compressed);
      if (result.path) {
        newImages.push({
          path: result.path,
          alt: file.name,
          sort_order: newImages.length,
        });
      }
    }
    updateField("gallery_images", newImages);
    setUploading(false);
    e.target.value = "";
  }

  function updateBankAccount(index: number, field: keyof BankAccount, value: string) {
    if (!settings) return;
    const accounts = [...settings.bank_accounts];
    accounts[index] = { ...accounts[index], [field]: value };
    updateField("bank_accounts", accounts);
  }

  function addBankAccount() {
    if (!settings) return;
    updateField("bank_accounts", [...settings.bank_accounts, emptyBankAccount()]);
  }

  function removeBankAccount(index: number) {
    if (!settings) return;
    updateField(
      "bank_accounts",
      settings.bank_accounts.filter((_, i) => i !== index)
    );
  }

  function updateMilestone(
    index: number,
    field: keyof StoryMilestone,
    value: string
  ) {
    if (!settings) return;
    const milestones = [...settings.story_milestones];
    milestones[index] = { ...milestones[index], [field]: value };
    updateField("story_milestones", milestones);
  }

  function addMilestone() {
    if (!settings) return;
    updateField("story_milestones", [
      ...settings.story_milestones,
      emptyMilestone(),
    ]);
  }

  function removeMilestone(index: number) {
    if (!settings) return;
    updateField(
      "story_milestones",
      settings.story_milestones.filter((_, i) => i !== index)
    );
  }

  function removeGalleryImage(index: number) {
    if (!settings) return;
    updateField(
      "gallery_images",
      settings.gallery_images.filter((_, i) => i !== index)
    );
  }

  if (!settings) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <AdminPageHeader
        title="Settings"
        description="Manage your wedding details, story, gifts, and media. Changes appear on the guest site after saving."
      />

      <form onSubmit={handleSave} className="space-y-6">
        <FormSection title="The Couple" description="Names and wedding date shown on the cover screen.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Groom name"
              placeholder="e.g. Ahmad"
              value={settings.groom_name}
              onChange={(e) => updateField("groom_name", e.target.value)}
            />
            <Input
              label="Bride name"
              placeholder="e.g. Siti"
              value={settings.bride_name}
              onChange={(e) => updateField("bride_name", e.target.value)}
            />
          </div>
          <Input
            label="Wedding date & time"
            type="datetime-local"
            hint="Used for countdown and add-to-calendar"
            value={toDatetimeLocal(settings.wedding_date)}
            onChange={(e) =>
              updateField("wedding_date", fromDatetimeLocal(e.target.value))
            }
          />
        </FormSection>

        <SettingsExtendedSections
          projectId={projectId}
          settings={settings}
          events={events}
          onSettingsChange={updateField}
          onEventsChange={setPendingEvents}
        />

        <FormSection
          title="Our Story"
          description="Timeline milestones shown on the guest site."
        >
          <div className="space-y-4">
            {settings.story_milestones.map((milestone, index) => (
              <div
                key={index}
                className="rounded-xl border border-card-border bg-surface/50 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-accent">
                    Milestone {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="Year"
                    placeholder="2019"
                    value={milestone.year}
                    onChange={(e) =>
                      updateMilestone(index, "year", e.target.value)
                    }
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Title"
                      placeholder="How we met"
                      value={milestone.title}
                      onChange={(e) =>
                        updateMilestone(index, "title", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Textarea
                    label="Description"
                    placeholder="A short editorial note…"
                    value={milestone.description}
                    onChange={(e) =>
                      updateMilestone(index, "description", e.target.value)
                    }
                    className="min-h-20"
                  />
                </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={addMilestone}>
            + Add milestone
          </Button>
        </FormSection>

        <FormSection
          title="Amplop Digital"
          description="Bank or e-wallet details for remote gifts."
        >
          <div className="space-y-4">
            {settings.bank_accounts.map((account, index) => (
              <div
                key={index}
                className="rounded-xl border border-card-border bg-surface/50 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-accent">
                    Account {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBankAccount(index)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Label"
                    placeholder="BCA / GoPay"
                    value={account.label}
                    onChange={(e) =>
                      updateBankAccount(index, "label", e.target.value)
                    }
                  />
                  <Input
                    label="Bank / Provider"
                    placeholder="BCA"
                    value={account.bank}
                    onChange={(e) =>
                      updateBankAccount(index, "bank", e.target.value)
                    }
                  />
                  <Input
                    label="Account number"
                    placeholder="1234567890"
                    value={account.account_number}
                    onChange={(e) =>
                      updateBankAccount(index, "account_number", e.target.value)
                    }
                  />
                  <Input
                    label="Account name"
                    placeholder="John Doe"
                    value={account.account_name}
                    onChange={(e) =>
                      updateBankAccount(index, "account_name", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={addBankAccount}>
            + Add account
          </Button>
          <Textarea
            label="Gift shipping address"
            hint="Physical gift address for guests who cannot attend"
            value={settings.gift_shipping_address}
            onChange={(e) =>
              updateField("gift_shipping_address", e.target.value)
            }
            className="mt-4 min-h-24"
          />
        </FormSection>

        <FormSection
          title="Livestream & Sharing"
          description="Optional livestream and WhatsApp share settings."
        >
          <Input
            label="Livestream URL"
            placeholder="YouTube live embed URL"
            hint="Leave empty to hide the livestream section"
            value={settings.livestream_url}
            onChange={(e) => updateField("livestream_url", e.target.value)}
          />
          <Input
            label="WhatsApp number"
            placeholder="6281234567890"
            hint="Country code, no + or spaces"
            value={settings.whatsapp_number}
            onChange={(e) => updateField("whatsapp_number", e.target.value)}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <Textarea
              label="Share message (Indonesian)"
              value={settings.share_message_id}
              onChange={(e) => updateField("share_message_id", e.target.value)}
              className="min-h-24"
            />
            <Textarea
              label="Share message (English)"
              value={settings.share_message_en}
              onChange={(e) => updateField("share_message_en", e.target.value)}
              className="min-h-24"
            />
          </div>
        </FormSection>

        <FormSection title="Media" description="Background music and photo gallery.">
          <div className="grid gap-6 lg:grid-cols-2">
            <FileUpload
              label="Background music"
              hint="MP3, max 2–3MB recommended"
              accept="audio/mpeg,audio/mp3"
              currentLabel={
                settings.music_path
                  ? `Uploaded: ${settings.music_path.split("/").pop()}`
                  : undefined
              }
              onChange={handleMusicUpload}
            />
            <FileUpload
              label="Gallery photos"
              hint="JPEG/PNG, auto-compressed to 1600px"
              accept="image/*"
              multiple
              currentLabel={
                settings.gallery_images.length > 0
                  ? `${settings.gallery_images.length} photo(s) uploaded`
                  : undefined
              }
              onChange={handleGalleryUpload}
            />
          </div>

          {settings.gallery_images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {settings.gallery_images.map((img, index) => (
                <div
                  key={img.path}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-card-border"
                >
                  <Image
                    src={getStoragePublicUrl("gallery", img.path)}
                    alt={img.alt}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormSection>

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-card-border bg-card/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <p
              className={`text-sm ${message.includes("success") ? "text-accent" : message ? "text-red-400" : "text-muted"}`}
            >
              {message || (uploading ? "Uploading…" : "Unsaved changes are not live until you save.")}
            </p>
            <Button type="submit" disabled={saving || uploading} size="lg">
              {saving ? "Saving…" : "Save settings"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
