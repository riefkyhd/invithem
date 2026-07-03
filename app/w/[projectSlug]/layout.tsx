import type { Metadata } from "next";
import { mergeSettings } from "@/lib/content/placeholders";
import {
  getProjectSettingsBySlug,
} from "@/lib/projects/resolve-project";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}): Promise<Metadata> {
  const { projectSlug } = await params;
  const settings = await getProjectSettingsBySlug(projectSlug);
  const merged = mergeSettings(settings);

  return {
    title: `${merged.groom_name} & ${merged.bride_name} — Wedding Invitation`,
    description: merged.share_message_en,
    openGraph: {
      title: `${merged.groom_name} & ${merged.bride_name}`,
      description: merged.share_message_en,
      images: [`/w/${projectSlug}/opengraph-image`],
    },
  };
}

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
