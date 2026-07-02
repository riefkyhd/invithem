"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings, uploadFile } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { compressImage } from "@/lib/utils/image-compression";
import type { AdminSettings, GalleryImage } from "@/lib/types/database";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

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
    const result = await updateSettings(settings);
    setSaving(false);
    setMessage(result.error ? result.error : "Settings saved!");
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleMusicUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `wedding-music-${Date.now()}.mp3`;
    const result = await uploadFile("music", path, file);
    if (result.path) updateField("music_path", result.path);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !settings) return;
    const newImages: GalleryImage[] = [...settings.gallery_images];

    for (const file of Array.from(files)) {
      const compressed = await compressImage(file);
      const path = `gallery/${Date.now()}-${file.name}`;
      const result = await uploadFile("gallery", path, compressed);
      if (result.path) {
        newImages.push({
          path: result.path,
          alt: file.name,
          sort_order: newImages.length,
        });
      }
    }
    updateField("gallery_images", newImages);
  }

  if (!settings) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="font-display mb-8 text-4xl">Settings</h1>
      <form onSubmit={handleSave} className="max-w-2xl space-y-8">
        <section className="space-y-4">
          <h2 className="text-lg font-medium">Couple</h2>
          <Input
            label="Groom Name"
            value={settings.groom_name}
            onChange={(e) => updateField("groom_name", e.target.value)}
          />
          <Input
            label="Bride Name"
            value={settings.bride_name}
            onChange={(e) => updateField("bride_name", e.target.value)}
          />
          <Input
            label="Wedding Date (ISO)"
            value={settings.wedding_date}
            onChange={(e) => updateField("wedding_date", e.target.value)}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Ceremony</h2>
          <Input
            label="Time"
            value={settings.ceremony_time}
            onChange={(e) => updateField("ceremony_time", e.target.value)}
          />
          <Input
            label="Venue"
            value={settings.ceremony_venue_name}
            onChange={(e) =>
              updateField("ceremony_venue_name", e.target.value)
            }
          />
          <Textarea
            label="Address"
            value={settings.ceremony_venue_address}
            onChange={(e) =>
              updateField("ceremony_venue_address", e.target.value)
            }
          />
          <Input
            label="Google Maps Embed URL"
            value={settings.ceremony_maps_embed_url}
            onChange={(e) =>
              updateField("ceremony_maps_embed_url", e.target.value)
            }
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Reception</h2>
          <Input
            label="Time"
            value={settings.reception_time}
            onChange={(e) => updateField("reception_time", e.target.value)}
          />
          <Input
            label="Venue"
            value={settings.reception_venue_name}
            onChange={(e) =>
              updateField("reception_venue_name", e.target.value)
            }
          />
          <Textarea
            label="Address"
            value={settings.reception_venue_address}
            onChange={(e) =>
              updateField("reception_venue_address", e.target.value)
            }
          />
          <Input
            label="Google Maps Embed URL"
            value={settings.reception_maps_embed_url}
            onChange={(e) =>
              updateField("reception_maps_embed_url", e.target.value)
            }
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Livestream & Share</h2>
          <Input
            label="Livestream URL"
            value={settings.livestream_url}
            onChange={(e) => updateField("livestream_url", e.target.value)}
          />
          <Input
            label="WhatsApp Number"
            value={settings.whatsapp_number}
            onChange={(e) => updateField("whatsapp_number", e.target.value)}
          />
          <Textarea
            label="Share Message (ID)"
            value={settings.share_message_id}
            onChange={(e) => updateField("share_message_id", e.target.value)}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Admin Emails</h2>
          <Input
            label="Comma-separated admin emails"
            value={settings.admin_emails.join(", ")}
            onChange={(e) =>
              updateField(
                "admin_emails",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Bank Accounts (JSON)</h2>
          <Textarea
            label="Bank accounts JSON array"
            value={JSON.stringify(settings.bank_accounts, null, 2)}
            onChange={(e) => {
              try {
                updateField("bank_accounts", JSON.parse(e.target.value));
              } catch {
                // ignore invalid JSON while typing
              }
            }}
            className="font-mono text-xs"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Story Milestones (JSON)</h2>
          <Textarea
            label="Story milestones JSON array"
            value={JSON.stringify(settings.story_milestones, null, 2)}
            onChange={(e) => {
              try {
                updateField("story_milestones", JSON.parse(e.target.value));
              } catch {
                // ignore invalid JSON while typing
              }
            }}
            className="font-mono text-xs"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Media</h2>
          <div>
            <label className="text-sm text-muted">Background Music (MP3)</label>
            <input type="file" accept="audio/mpeg,audio/mp3" onChange={handleMusicUpload} />
            {settings.music_path && (
              <p className="mt-1 text-xs text-muted">Current: {settings.music_path}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-muted">Gallery Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
            />
            <p className="mt-1 text-xs text-muted">
              {settings.gallery_images.length} images uploaded
            </p>
          </div>
        </section>

        {message && (
          <p className={message.includes("saved") ? "text-accent" : "text-red-400"}>
            {message}
          </p>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
