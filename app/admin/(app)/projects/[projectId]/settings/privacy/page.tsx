"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsExtendedSections } from "@/components/admin/SettingsExtendedSections";
import { useProjectSettings } from "@/components/admin/project-settings/ProjectSettingsProvider";

export default function PrivacySettingsPage() {
  const {
    projectId,
    settings,
    events,
    updateField,
    setPendingEvents,
    handleSave,
  } = useProjectSettings();

  if (!settings) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <AdminPageHeader
        title="Privacy"
        description="Control who can view this invitation."
      />

      <SettingsExtendedSections
        projectId={projectId}
        settings={settings}
        events={events}
        onSettingsChange={updateField}
        onEventsChange={setPendingEvents}
        sections="privacy"
      />
    </form>
  );
}
