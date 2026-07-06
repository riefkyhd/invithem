"use client";

import { Button } from "@/components/ui/Button";
import { useProjectSettings } from "./ProjectSettingsProvider";

export function SettingsSaveBar() {
  const { saving, uploading, message, handleSave } = useProjectSettings();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-card-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <p
          className={`text-sm ${
            message.includes("success")
              ? "text-accent"
              : message
                ? "text-red-400"
                : "text-muted"
          }`}
        >
          {message ||
            (uploading ? "Uploading…" : "Unsaved changes are not live until you save.")}
        </p>
        <Button
          type="button"
          disabled={saving || uploading}
          size="lg"
          onClick={() => void handleSave()}
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
