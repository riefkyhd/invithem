import { cache } from "react";
import { isAuthDisabled } from "@/lib/auth/disabled";
import { mergeSettings } from "@/lib/content/placeholders";
import { buildWeddingData } from "@/lib/invitation/build-wedding-data";
import { resolveEventMapsUrls } from "@/lib/invitation/resolve-event-maps";
import { hasProjectAccessCookie } from "@/lib/projects/project-access";
import { fetchWeddingPageSources } from "@/lib/projects/resolve-project";
import { projectInvitationUrl } from "@/lib/projects/urls";
import type { TemplateId } from "@/lib/types/database";
import type { WeddingData } from "@/lib/types/wedding-data";
import { isValidTemplateId } from "@/templates/registry";
import { notFound } from "next/navigation";

export interface PasswordGatePreview {
  projectId: string;
  groomName: string;
  brideName: string;
}

export interface WeddingPageData {
  templateId: TemplateId;
  weddingData: WeddingData | null;
  requiresPassword: boolean;
  hasAccess: boolean;
  gatePreview: PasswordGatePreview | null;
}

export const loadWeddingPageData = cache(
  async (
    projectSlug: string,
    guestSlug?: string,
    options?: { bypassPasswordGate?: boolean }
  ): Promise<WeddingPageData> => {
    const sources = await fetchWeddingPageSources(projectSlug, guestSlug);
    if (!sources) notFound();

    const merged = mergeSettings(sources.settings);
    const requiresPassword = merged.is_password_protected;

    const bypassGate = options?.bypassPasswordGate || isAuthDisabled();

    if (
      requiresPassword &&
      !bypassGate &&
      !(await hasProjectAccessCookie(sources.project.id))
    ) {
      return {
        templateId: "silent-heritage",
        weddingData: null,
        requiresPassword: true,
        hasAccess: false,
        gatePreview: {
          projectId: sources.project.id,
          groomName: merged.groom_name,
          brideName: merged.bride_name,
        },
      };
    }

    const templateId: TemplateId = isValidTemplateId(merged.template_id)
      ? merged.template_id
      : "silent-heritage";

    const resolvedMapsUrls = await resolveEventMapsUrls(sources.events);

    const weddingData = buildWeddingData(merged, {
      projectId: sources.project.id,
      projectSlug: sources.project.slug,
      guest: sources.guest,
      wishes: sources.wishes,
      events: sources.events,
      resolvedMapsUrls,
      invitationUrl: guestSlug
        ? projectInvitationUrl(sources.project.slug, guestSlug)
        : projectInvitationUrl(sources.project.slug),
    });

    return {
      templateId,
      weddingData,
      requiresPassword,
      hasAccess: true,
      gatePreview: null,
    };
  }
);
