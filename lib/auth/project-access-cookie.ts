import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function cookieSecret(): string {
  const secret = process.env.CHECKIN_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("CHECKIN_SECRET is required in production");
  }
  return secret ?? "dev-checkin-secret-change-me";
}

function sign(projectId: string, expires: number): string {
  const payload = `${projectId}.${expires}`;
  return createHmac("sha256", cookieSecret()).update(payload).digest("hex").slice(0, 24);
}

export function cookieName(projectId: string): string {
  return `invithem_access_${projectId}`;
}

export function createProjectAccessCookieValue(projectId: string): string {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  return `${expires}.${sign(projectId, expires)}`;
}

export function verifyProjectAccessCookieValue(
  projectId: string,
  value: string | undefined
): boolean {
  if (!value) return false;
  const dot = value.indexOf(".");
  if (dot === -1) return false;
  const expires = Number(value.slice(0, dot));
  const sig = value.slice(dot + 1);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) {
    return false;
  }
  const expected = sign(projectId, expires);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const projectAccessCookieMaxAge = MAX_AGE_SEC;
