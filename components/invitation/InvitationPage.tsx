"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CoverScreen } from "@/components/invitation/CoverScreen";
import { Greeting } from "@/components/invitation/Greeting";
import { Story } from "@/components/invitation/Story";
import { EventDetails } from "@/components/invitation/EventDetails";
import { Countdown } from "@/components/invitation/Countdown";
import { Gallery } from "@/components/invitation/Gallery";
import { Livestream } from "@/components/invitation/Livestream";
import { RsvpForm } from "@/components/invitation/RsvpForm";
import { WishesWall } from "@/components/invitation/WishesWall";
import { GiftEnvelope } from "@/components/invitation/GiftEnvelope";
import { ShareWhatsApp } from "@/components/invitation/ShareWhatsApp";
import { MusicToggle } from "@/components/invitation/MusicToggle";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";
import { ThemeToggle } from "@/components/invitation/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { mergeSettings } from "@/lib/content/placeholders";
import { useI18n } from "@/lib/i18n/context";
import type { AdminSettings, Wish } from "@/lib/types/database";

interface InvitationPageProps {
  settings: AdminSettings | null;
  wishes: Wish[];
}

export function InvitationPage({ settings: rawSettings, wishes }: InvitationPageProps) {
  const settings = mergeSettings(rawSettings);
  const searchParams = useSearchParams();
  const { locale } = useI18n();
  const slug = searchParams.get("to");

  const [opened, setOpened] = useState(false);
  const [guestName, setGuestName] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    async function lookupGuest() {
      const supabase = createClient();
      const { data } = await supabase.rpc("get_guest_by_slug", {
        p_slug: slug,
      });
      if (data && data.length > 0) {
        setGuestName(data[0].name);
        setGuestId(data[0].id);
      }
    }
    lookupGuest();
  }, [slug]);

  const musicUrl = settings.music_path
    ? getStoragePublicUrl("music", settings.music_path)
    : undefined;

  const shareMessage =
    locale === "id"
      ? settings.share_message_id
      : settings.share_message_en;

  const invitationUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_SITE_URL}/?to=${slug || ""}`;

  return (
    <>
      <CoverScreen
        groomName={settings.groom_name}
        brideName={settings.bride_name}
        weddingDate={settings.wedding_date}
        opened={opened}
        onOpen={() => setOpened(true)}
      />

      {opened && (
        <main>
          <Greeting guestName={guestName} />
          <Story milestones={settings.story_milestones} />
          <Countdown targetDate={settings.wedding_date} />
          <EventDetails settings={settings} />
          <Gallery images={settings.gallery_images} />
          <Livestream url={settings.livestream_url} />
          <RsvpForm guestId={guestId} defaultName={guestName || ""} />
          <WishesWall initialWishes={wishes} defaultName={guestName || ""} />
          <GiftEnvelope accounts={settings.bank_accounts} />
          <ShareWhatsApp
            whatsappNumber={settings.whatsapp_number}
            shareMessage={shareMessage}
            invitationUrl={invitationUrl}
          />
        </main>
      )}

      <MusicToggle musicUrl={musicUrl} />
      <LanguageToggle />
      <ThemeToggle />
    </>
  );
}
