"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MusicToggle } from "@/components/invitation/MusicToggle";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";
import { GrainOverlay } from "@/templates/shared/GrainOverlay";
import { eventSlugFromLabel } from "@/lib/projects/urls";
import { createClient } from "@/lib/supabase/client";
import type { TemplateId } from "@/lib/types/database";
import type { WeddingData } from "@/lib/types/wedding-data";
import {
  DEFAULT_SECTION_ORDER,
  type TemplateModule,
  type TemplateSectionKey,
} from "@/templates/types";

interface TemplateRendererProps {
  templateId: TemplateId;
  templatePromise: Promise<TemplateModule>;
  projectSlug: string;
  guestSlug?: string;
  data: WeddingData;
  previewMode?: boolean;
  previewLabel?: string;
}

export function TemplateRenderer({
  templateId,
  templatePromise,
  projectSlug,
  guestSlug,
  data,
  previewMode = false,
  previewLabel,
}: TemplateRendererProps) {
  const searchParams = useSearchParams();
  const highlightEvent = searchParams.get("event") ?? undefined;
  const template = use(templatePromise);

  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!guestSlug || !data.guest) return;
    const supabase = createClient();
    void supabase.rpc("log_invitation_view", { p_guest_id: data.guest.id });
  }, [guestSlug, data.guest]);

  useEffect(() => {
    if (!opened || !highlightEvent) return;
    const slug = eventSlugFromLabel(highlightEvent);
    const el = document.getElementById(`event-${slug}`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  }, [opened, highlightEvent]);

  const resolvedData = useMemo((): WeddingData => {
    const invitationUrl =
      typeof window !== "undefined"
        ? window.location.href
        : data.share.invitationUrl;
    return {
      ...data,
      share: { ...data.share, invitationUrl },
    };
  }, [data]);

  const { components, fonts, sectionOrder } = template;
  const order = sectionOrder ?? DEFAULT_SECTION_ORDER;
  const grainIntensity = template.grainIntensity ?? "medium";

  function shouldRenderSection(key: TemplateSectionKey): boolean {
    if (key === "Livestream" && !resolvedData.livestreamUrl) return false;
    if (key === "Greeting" && !resolvedData.guest?.name) return false;
    if (key === "OpeningBlock") {
      const o = resolvedData.opening;
      return !!(o.quote?.trim() || o.greetingId?.trim() || o.greetingEn?.trim());
    }
    if (key === "ParentsBlock") {
      const p = resolvedData.parents;
      return !!(
        p.groom.father.trim() ||
        p.groom.mother.trim() ||
        p.bride.father.trim() ||
        p.bride.mother.trim()
      );
    }
    if (key === "EventDetails" && resolvedData.events.length === 0) return false;
    if (key === "RsvpForm" && resolvedData.events.length === 0) return false;
    return true;
  }

  function renderSection(key: TemplateSectionKey) {
    if (!shouldRenderSection(key)) return null;
    switch (key) {
      case "OpeningBlock":
        return <components.OpeningBlock key={key} data={resolvedData} />;
      case "Greeting":
        return <components.Greeting key={key} data={resolvedData} />;
      case "ParentsBlock":
        return <components.ParentsBlock key={key} data={resolvedData} />;
      case "OurStory":
        return <components.OurStory key={key} data={resolvedData} />;
      case "Countdown":
        return <components.Countdown key={key} data={resolvedData} />;
      case "EventDetails":
        return (
          <components.EventDetails
            key={key}
            data={resolvedData}
            highlightEventLabel={highlightEvent ?? undefined}
          />
        );
      case "Gallery":
        return <components.Gallery key={key} data={resolvedData} />;
      case "Livestream":
        return <components.Livestream key={key} data={resolvedData} />;
      case "RsvpForm":
        return (
          <components.RsvpForm
            key={key}
            data={resolvedData}
            highlightEventLabel={highlightEvent ?? undefined}
          />
        );
      case "GuestBook":
        return <components.GuestBook key={key} data={resolvedData} />;
      case "GiftEnvelope":
        return <components.GiftEnvelope key={key} data={resolvedData} />;
      case "Footer":
        return <components.Footer key={key} data={resolvedData} />;
      default:
        return null;
    }
  }

  return (
    <div
      data-template={templateId}
      className={`relative min-h-screen tmpl-body ${fonts.className}`}
    >
      <GrainOverlay intensity={grainIntensity} />
      {previewMode && (
        <div className="sticky top-0 z-[60] bg-amber-500 px-4 py-2 text-center text-sm font-medium text-black">
          Preview mode — {previewLabel ?? templateId}
        </div>
      )}

      <components.Cover
        data={resolvedData}
        opened={opened}
        onOpen={() => setOpened(true)}
      />

      {opened && <main>{order.map(renderSection)}</main>}

      <MusicToggle musicUrl={resolvedData.musicUrl ?? undefined} />
      <LanguageToggle />
    </div>
  );
}
