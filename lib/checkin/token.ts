import { createHmac, timingSafeEqual } from "crypto";

export function generateCheckinToken(rsvpId: string): string {
  const secret = process.env.CHECKIN_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CHECKIN_SECRET is required in production");
    }
  }
  const hmac = createHmac("sha256", secret ?? "dev-checkin-secret-change-me")
    .update(rsvpId)
    .digest("hex");
  return `${rsvpId}.${hmac.slice(0, 16)}`;
}

export function verifyCheckinToken(token: string): string | null {
  const dot = token.indexOf(".");
  if (dot === -1) return null;
  const rsvpId = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = generateCheckinToken(rsvpId).slice(dot + 1);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return rsvpId;
  } catch {
    return null;
  }
}
