"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MusicToggle } from "@/components/invitation/MusicToggle";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";
import { createClient } from "@/lib/supabase/client";
import type { TemplateId } from "@/lib/types/database";
import type { WeddingData } from "@/lib/types/wedding-data";
import {
  DEFAULT_SECTION_ORDER,
  type TemplateModule,
  type TemplateSectionKey,
} from "@/templates/types";
import { loadTemplate } from "@/templates/registry";

interface TemplateRendererProps {
  templateId: TemplateId;
  data: WeddingData;
  previewMode?: boolean;
  previewLabel?: string;
}

export function TemplateRenderer({
  templateId,
  data,
  previewMode = false,
  previewLabel,
}: TemplateRendererProps) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("to");

  const [opened, setOpened] = useState(false);
  const [guestLookup, setGuestLookup] = useState<WeddingData["guest"]>(null);
  const [template, setTemplate] = useState<TemplateModule | null>(null);
  const [loadedTemplateId, setLoadedTemplateId] = useState<TemplateId | null>(
    null
  );

  const loading = loadedTemplateId !== templateId;

  useEffect(() => {
    let cancelled = false;
    loadTemplate(templateId).then((mod) => {
      if (!cancelled) {
        setTemplate(mod);
        setLoadedTemplateId(templateId);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [templateId]);

  useEffect(() => {
    if (!slug) return;
    const guestSlug = slug;
    async function lookupGuest() {
      const supabase = createClient();
      const { data: guestRows } = await supabase.rpc("get_guest_by_slug", {
        p_slug: guestSlug,
      });
      if (guestRows && guestRows.length > 0) {
        const row = guestRows[0];
        setGuestLookup({ id: row.id, name: row.name, slug: guestSlug });
      }
    }
    lookupGuest();
  }, [slug]);

  const guest = slug ? guestLookup : data.guest;

  const resolvedData = useMemo((): WeddingData => {
    const invitationUrl =
      typeof window !== "undefined"
        ? window.location.href
        : data.share.invitationUrl;
    return {
      ...data,
      guest,
      share: { ...data.share, invitationUrl },
    };
  }, [data, guest]);

  if (loading || !template) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-400">
        Loading...
      </div>
    );
  }

  const { components, fonts, sectionOrder } = template;
  const order = sectionOrder ?? DEFAULT_SECTION_ORDER;

  function shouldRenderSection(key: TemplateSectionKey): boolean {
    if (key === "Livestream" && !resolvedData.livestreamUrl) return false;
    if (key === "Greeting" && !resolvedData.guest?.name) return false;
    return true;
  }

  function renderSection(key: TemplateSectionKey) {
    if (!shouldRenderSection(key)) return null;
    switch (key) {
      case "Greeting":
        return <components.Greeting key={key} data={resolvedData} />;
      case "OurStory":
        return <components.OurStory key={key} data={resolvedData} />;
      case "Countdown":
        return <components.Countdown key={key} data={resolvedData} />;
      case "EventDetails":
        return <components.EventDetails key={key} data={resolvedData} />;
      case "Gallery":
        return <components.Gallery key={key} data={resolvedData} />;
      case "Livestream":
        return <components.Livestream key={key} data={resolvedData} />;
      case "RsvpForm":
        return <components.RsvpForm key={key} data={resolvedData} />;
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
      className={`min-h-screen tmpl-body ${fonts.className}`}
    >
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
