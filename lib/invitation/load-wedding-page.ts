import { buildWeddingData } from "@/lib/invitation/build-wedding-data";
import { mergeSettings } from "@/lib/content/placeholders";
import {
  getGuestWithEvents,
  getProjectBySlug,
  getProjectEventsBySlug,
  getProjectSettingsBySlug,
  getProjectWishesBySlug,
  hasProjectAccessCookie,
} from "@/lib/projects/resolve-project";
import { projectInvitationUrl } from "@/lib/projects/urls";
import type { TemplateId } from "@/lib/types/database";
import type { WeddingData, WeddingGuest } from "@/lib/types/wedding-data";
import { resolveMapsEmbedUrl } from "@/lib/utils/maps";
import { isValidTemplateId } from "@/templates/registry";
import { notFound } from "next/navigation";

export interface WeddingPageData {
  templateId: TemplateId;
  weddingData: WeddingData;
  requiresPassword: boolean;
  hasAccess: boolean;
}

export async function loadWeddingPageData(
  projectSlug: string,
  guestSlug?: string
): Promise<WeddingPageData> {
  const project = await getProjectBySlug(projectSlug);
  if (!project || project.status !== "published") notFound();

  const [settings, wishes, events] = await Promise.all([
    getProjectSettingsBySlug(projectSlug),
    getProjectWishesBySlug(projectSlug),
    getProjectEventsBySlug(projectSlug),
  ]);

  let guest: WeddingGuest | null = null;
  if (guestSlug) {
    guest = await getGuestWithEvents(projectSlug, guestSlug);
    if (!guest) notFound();
  }

  const merged = mergeSettings(settings);
  const templateId: TemplateId = isValidTemplateId(merged.template_id)
    ? merged.template_id
    : "reference";

  const resolvedMapsUrls: Record<string, string> = {};
  await Promise.all(
    events.map(async (event) => {
      resolvedMapsUrls[event.id] = await resolveMapsEmbedUrl(
        event.maps_embed_url
      );
    })
  );

  const weddingData = buildWeddingData(merged, {
    projectId: project.id,
    projectSlug: project.slug,
    guest,
    wishes,
    events,
    resolvedMapsUrls,
    invitationUrl: guestSlug
      ? projectInvitationUrl(project.slug, guestSlug)
      : projectInvitationUrl(project.slug),
  });

  const requiresPassword = merged.is_password_protected;
  const hasAccess =
    !requiresPassword || (await hasProjectAccessCookie(project.id));

  return { templateId, weddingData, requiresPassword, hasAccess };
}
