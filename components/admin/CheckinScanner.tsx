"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { checkInGuest, getCheckinStats } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
  const [manualToken, setManualToken] = useState("");
  const [stats, setStats] = useState({ checkedIn: 0, totalConfirmed: 0 });
  const processing = useRef(false);

  async function refreshStats() {
    const data = await getCheckinStats(projectId);
    setStats(data);
  }

  const processToken = useCallback(
    async (token: string) => {
      if (processing.current || !token.trim()) return;
      processing.current = true;
      const result = await checkInGuest(projectId, token.trim());
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
        setMessage("");
      }, 3000);
    },
    [projectId]
  );

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
          await processToken(decodedText);
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
  }, [projectId, processToken]);

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = manualToken;
    setManualToken("");
    await processToken(token);
  }

  const statusColors: Record<ScanStatus, string> = {
    idle: "border-card-border bg-card",
    success: "border-green-500/50 bg-green-500/10 text-green-400",
    already_checked_in: "border-amber-500/50 bg-amber-500/10 text-amber-400",
    invalid: "border-red-500/50 bg-red-400/10 text-red-400",
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
        data-testid="checkin-status"
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

      <form
        onSubmit={handleManualSubmit}
        className="mb-6 flex flex-col gap-3 rounded-2xl border border-card-border bg-card p-5 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <Input
            label="Manual code entry"
            hint="Paste a check-in token if the camera is unavailable"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Paste check-in token"
            data-testid="checkin-manual-input"
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          disabled={!manualToken.trim()}
          data-testid="checkin-manual-submit"
        >
          Check in
        </Button>
      </form>

      <div id="qr-reader" className="overflow-hidden rounded-2xl" />
    </div>
  );
}
