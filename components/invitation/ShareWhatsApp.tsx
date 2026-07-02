"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";
import { buildWhatsAppShareUrl } from "@/lib/utils/whatsapp";

interface ShareWhatsAppProps {
  whatsappNumber: string;
  shareMessage: string;
  invitationUrl: string;
}

export function ShareWhatsApp({
  whatsappNumber,
  shareMessage,
  invitationUrl,
}: ShareWhatsAppProps) {
  const { t } = useI18n();

  function handleShare() {
    const message = `${shareMessage}\n\n${invitationUrl}`;
    const url = buildWhatsAppShareUrl(whatsappNumber, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="px-6 py-16 md:px-12 lg:px-24">
      <SectionReveal className="text-center">
        <Button variant="secondary" onClick={handleShare}>
          {t("share")}
        </Button>
      </SectionReveal>
    </section>
  );
}
