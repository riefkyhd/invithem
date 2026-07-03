export function projectStoragePath(projectId: string, filename: string): string {
  return `${projectId}/${filename}`;
}

export function projectInvitationUrl(
  projectSlug: string,
  guestSlug?: string
): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  const url = `${base}/w/${projectSlug}`;
  return guestSlug ? `${url}?to=${guestSlug}` : url;
}
