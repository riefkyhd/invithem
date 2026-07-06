"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsExtendedSections } from "@/components/admin/SettingsExtendedSections";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { StoryMilestone } from "@/lib/types/database";
import {
  fromDatetimeLocal,
  toDatetimeLocal,
  useProjectSettings,
} from "@/components/admin/project-settings/ProjectSettingsProvider";

const emptyMilestone = (): StoryMilestone => ({
  year: "",
  title: "",
  description: "",
});

export default function ContentSettingsPage() {
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

  function updateMilestone(
    index: number,
    field: keyof StoryMilestone,
    value: string
  ) {
    const milestones = [...settings!.story_milestones];
    milestones[index] = { ...milestones[index], [field]: value };
    updateField("story_milestones", milestones);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <AdminPageHeader
        title="Invitation content"
        description="Couple details, events, and story shown on the guest site."
      />

      <FormSection title="The Couple" description="Names and wedding date on the cover.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Groom name"
            value={settings.groom_name}
            onChange={(e) => updateField("groom_name", e.target.value)}
          />
          <Input
            label="Bride name"
            value={settings.bride_name}
            onChange={(e) => updateField("bride_name", e.target.value)}
          />
        </div>
        <Input
          label="Wedding date & time"
          type="datetime-local"
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
        sections="content"
      />

      <FormSection title="Our Story" description="Timeline milestones on the invitation.">
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
                  onClick={() =>
                    updateField(
                      "story_milestones",
                      settings.story_milestones.filter((_, i) => i !== index)
                    )
                  }
                >
                  Remove
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Year"
                  value={milestone.year}
                  onChange={(e) => updateMilestone(index, "year", e.target.value)}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Title"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(index, "title", e.target.value)}
                  />
                </div>
              </div>
              <Textarea
                label="Description"
                value={milestone.description}
                onChange={(e) =>
                  updateMilestone(index, "description", e.target.value)
                }
                className="mt-4 min-h-20"
              />
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={() =>
            updateField("story_milestones", [
              ...settings.story_milestones,
              emptyMilestone(),
            ])
          }
        >
          + Add milestone
        </Button>
      </FormSection>
    </form>
  );
}
