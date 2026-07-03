"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

interface RsvpConfirmationProps {
  guestName: string;
  eventLabel: string;
  checkinToken: string | null;
  className?: string;
}

export function RsvpConfirmation({
  guestName,
  eventLabel,
  checkinToken,
  className = "",
}: RsvpConfirmationProps) {
  const { t } = useI18n();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!checkinToken) return;
    void QRCode.toDataURL(checkinToken, { width: 256, margin: 2 }).then(
      setQrDataUrl
    );
  }, [checkinToken]);

  async function downloadQr() {
    if (!qrDataUrl) return;
    const anchor = document.createElement("a");
    anchor.href = qrDataUrl;
    anchor.download = `checkin-${eventLabel.toLowerCase().replace(/\s+/g, "-")}.png`;
    anchor.click();
  }

  return (
    <div className={`text-center ${className}`}>
      <p className="text-lg text-[var(--tmpl-accent)]">{t("rsvpSuccess")}</p>
      {checkinToken && (
        <div className="mx-auto mt-8 max-w-sm">
          <p className="text-sm text-[var(--tmpl-muted)]">{t("checkinQrHint")}</p>
          <p className="mt-2 font-medium">
            {guestName} — {eventLabel}
          </p>
          {qrDataUrl && (
            <div className="mt-6 flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Check-in QR code"
                className="h-48 w-48 rounded-lg border border-[var(--tmpl-card-border)] bg-white p-2"
              />
              <button
                type="button"
                onClick={downloadQr}
                className="rounded-full border border-[var(--tmpl-card-border)] px-5 py-2 text-sm transition-colors hover:border-[var(--tmpl-accent)]"
              >
                {t("downloadQr")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
