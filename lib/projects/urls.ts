export function projectStoragePath(projectId: string, filename: string): string {
  return `${projectId}/${filename}`;
}

export function projectInvitationUrl(
  projectSlug: string,
  guestSlug?: string,
  eventLabel?: string
): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  let url = guestSlug
    ? `${base}/w/${projectSlug}/${guestSlug}`
    : `${base}/w/${projectSlug}`;
  if (eventLabel) {
    url += `?event=${encodeURIComponent(eventLabel)}`;
  }
  return url;
}

export function eventSlugFromLabel(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
