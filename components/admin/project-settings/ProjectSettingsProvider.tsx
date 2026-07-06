"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getEvents, getSettings, updateSettings } from "@/app/admin/actions";
import { saveEventsForProject } from "@/components/admin/SettingsExtendedSections";
import type { AdminSettings, WeddingEvent } from "@/lib/types/database";

export function toDatetimeLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDatetimeLocal(value: string): string {
  return value ? new Date(value).toISOString() : "";
}

interface ProjectSettingsContextValue {
  projectId: string;
  settings: AdminSettings | null;
  events: WeddingEvent[];
  pendingEvents: Omit<WeddingEvent, "created_at" | "project_id">[];
  saving: boolean;
  uploading: boolean;
  message: string;
  setUploading: (v: boolean) => void;
  updateField: <K extends keyof AdminSettings>(
    key: K,
    value: AdminSettings[K]
  ) => void;
  setPendingEvents: (
    events: Omit<WeddingEvent, "created_at" | "project_id">[]
  ) => void;
  handleSave: (e?: React.FormEvent) => Promise<void>;
}

const ProjectSettingsContext = createContext<ProjectSettingsContextValue | null>(
  null
);

export function ProjectSettingsProvider({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
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

  const updateField = useCallback(
    <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
      setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    []
  );

  const handleSave = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!settings) return;
      setSaving(true);
      const { access_password_hash: _aph, ...safeSettings } = settings;
      const [settingsResult] = await Promise.all([
        updateSettings(projectId, safeSettings),
        saveEventsForProject(projectId, pendingEvents),
      ]);
      setSaving(false);
      setMessage(
        settingsResult.error ? settingsResult.error : "Settings saved successfully."
      );
      setTimeout(() => setMessage(""), 4000);
    },
    [settings, pendingEvents, projectId]
  );

  const value = useMemo(
    () => ({
      projectId,
      settings,
      events,
      pendingEvents,
      saving,
      uploading,
      message,
      setUploading,
      updateField,
      setPendingEvents,
      handleSave,
    }),
    [
      projectId,
      settings,
      events,
      pendingEvents,
      saving,
      uploading,
      message,
      updateField,
      handleSave,
    ]
  );

  return (
    <ProjectSettingsContext.Provider value={value}>
      {children}
    </ProjectSettingsContext.Provider>
  );
}

export function useProjectSettings() {
  const ctx = useContext(ProjectSettingsContext);
  if (!ctx) {
    throw new Error("useProjectSettings must be used within ProjectSettingsProvider");
  }
  return ctx;
}
