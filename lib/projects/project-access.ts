import "server-only";
import { cookies } from "next/headers";
import {
  cookieName,
  verifyProjectAccessCookieValue,
} from "@/lib/auth/project-access-cookie";

export async function hasProjectAccessCookie(
  projectId: string
): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(cookieName(projectId))?.value;
  return verifyProjectAccessCookieValue(projectId, value);
}
