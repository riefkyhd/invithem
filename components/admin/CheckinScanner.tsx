"use client";

import { useEffect, useRef, useState } from "react";
import { checkInGuest, getCheckinStats } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

interface CheckinScannerProps {
  projectId: string;
}

type ScanStatus = "idle" | "success" | "already_checked_in" | "invalid";

type QrScanner = {
  render: (
    onSuccess: (decodedText: string) => void,
    onError: (error: string) => void
  ) => void;
  clear: () => Promise<void>;
};

export function CheckinScanner({ projectId }: CheckinScannerProps) {
  const scannerRef = useRef<QrScanner | null>(null);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ checkedIn: 0, totalConfirmed: 0 });
  const processing = useRef(false);

  async function refreshStats() {
    const data = await getCheckinStats(projectId);
    setStats(data);
  }

  useEffect(() => {
    void refreshStats();
    const interval = setInterval(refreshStats, 5000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { Html5QrcodeScanner } = await import("html5-qrcode");
      if (cancelled) return;

      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scannerRef.current = scanner;

      scanner.render(
        async (decodedText) => {
          if (processing.current) return;
          processing.current = true;
          const result = await checkInGuest(projectId, decodedText);
          setStatus(result.status as ScanStatus);
          if (result.status === "success") {
            setMessage(`${result.guestName} — ${result.eventLabel}`);
          } else if (result.status === "already_checked_in") {
            setMessage(`${result.guestName} (already checked in)`);
          } else {
            setMessage("Invalid or unrecognized QR code");
          }
          await refreshStats();
          setTimeout(() => {
            processing.current = false;
            setStatus("idle");
          }, 3000);
        },
        () => {
          // ignore scan errors
        }
      );
    })();

    return () => {
      cancelled = true;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) void scanner.clear().catch(() => undefined);
    };
  }, [projectId]);

  const statusColors: Record<ScanStatus, string> = {
    idle: "border-card-border bg-card",
    success: "border-green-500/50 bg-green-500/10 text-green-400",
    already_checked_in: "border-amber-500/50 bg-amber-500/10 text-amber-400",
    invalid: "border-red-500/50 bg-red-500/10 text-red-400",
  };

  return (
    <div>
      <AdminPageHeader
        title="Check-in"
        description="Scan guest QR codes at the venue entrance."
      />

      <div className="mb-8 rounded-2xl border border-card-border bg-card p-6 text-center">
        <p className="text-4xl font-display text-accent">{stats.checkedIn}</p>
        <p className="mt-1 text-sm text-muted">
          of {stats.totalConfirmed} confirmed guests checked in
        </p>
      </div>

      <div
        className={`mb-6 rounded-2xl border p-6 text-center transition-colors ${statusColors[status]}`}
      >
        {status === "idle" ? (
          <p className="text-muted">Point camera at guest QR code</p>
        ) : status === "success" ? (
          <>
            <p className="text-lg font-medium">Checked in!</p>
            <p className="mt-1 text-sm">{message}</p>
          </>
        ) : status === "already_checked_in" ? (
          <>
            <p className="text-lg font-medium">Already checked in</p>
            <p className="mt-1 text-sm">{message}</p>
          </>
        ) : (
          <p className="text-lg font-medium">{message}</p>
        )}
      </div>

      <div id="qr-reader" className="overflow-hidden rounded-2xl" />
    </div>
  );
}
