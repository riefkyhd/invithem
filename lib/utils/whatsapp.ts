export function buildWhatsAppShareUrl(
  phoneNumber: string,
  message: string
): string {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  if (cleaned) {
    return `https://wa.me/${cleaned}?text=${text}`;
  }
  return `https://wa.me/?text=${text}`;
}

export function buildInvitationLink(projectSlug: string, guestSlug: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/w/${projectSlug}?to=${guestSlug}`;
}
