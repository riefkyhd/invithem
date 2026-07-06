"use client";

import Image from "next/image";
import { uploadFile } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useProjectSettings } from "@/components/admin/project-settings/ProjectSettingsProvider";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { compressImage } from "@/lib/utils/image-compression";
import type { BankAccount, GalleryImage } from "@/lib/types/database";

const emptyBankAccount = (): BankAccount => ({
  label: "",
  bank: "",
  account_number: "",
  account_name: "",
});

export default function MediaSettingsPage() {
  const {
    projectId,
    settings,
    updateField,
    handleSave,
    setUploading,
    uploading,
  } = useProjectSettings();

  if (!settings) {
    return <p className="text-sm text-muted">Loading…</p>;
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

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <AdminPageHeader
        title="Gifts & media"
        description="Digital envelopes, background music, and gallery photos."
      />

      <FormSection title="Amplop Digital" description="Bank or e-wallet details.">
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
                  onClick={() =>
                    updateField(
                      "bank_accounts",
                      settings.bank_accounts.filter((_, i) => i !== index)
                    )
                  }
                >
                  Remove
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Label"
                  value={account.label}
                  onChange={(e) => updateBankAccount(index, "label", e.target.value)}
                />
                <Input
                  label="Bank / Provider"
                  value={account.bank}
                  onChange={(e) => updateBankAccount(index, "bank", e.target.value)}
                />
                <Input
                  label="Account number"
                  value={account.account_number}
                  onChange={(e) =>
                    updateBankAccount(index, "account_number", e.target.value)
                  }
                />
                <Input
                  label="Account name"
                  value={account.account_name}
                  onChange={(e) =>
                    updateBankAccount(index, "account_name", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            updateField("bank_accounts", [...settings.bank_accounts, emptyBankAccount()])
          }
        >
          + Add account
        </Button>
        <Textarea
          label="Gift shipping address"
          value={settings.gift_shipping_address}
          onChange={(e) => updateField("gift_shipping_address", e.target.value)}
          className="mt-4 min-h-24"
        />
      </FormSection>

      <FormSection title="Livestream & Sharing">
        <Input
          label="Livestream URL"
          value={settings.livestream_url}
          onChange={(e) => updateField("livestream_url", e.target.value)}
        />
        <Input
          label="WhatsApp number"
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
            hint="JPEG/PNG, auto-compressed"
            accept="image/*"
            multiple
            currentLabel={
              settings.gallery_images.length > 0
                ? `${settings.gallery_images.length} photo(s)`
                : undefined
            }
            onChange={handleGalleryUpload}
          />
        </div>
        {uploading && (
          <p className="mt-2 text-sm text-muted">Uploading… save to apply.</p>
        )}
        {settings.gallery_images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
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
                  onClick={() =>
                    updateField(
                      "gallery_images",
                      settings.gallery_images.filter((_, i) => i !== index)
                    )
                  }
                  className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </FormSection>
    </form>
  );
}
