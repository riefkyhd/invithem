import { ImageResponse } from "next/og";
import { mergeSettings } from "@/lib/content/placeholders";
import { getProjectSettingsBySlug } from "@/lib/projects/resolve-project";

export const runtime = "edge";

export default async function Image({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}) {
  const { projectSlug } = await params;
  const settings = await getProjectSettingsBySlug(projectSlug);
  const merged = mergeSettings(settings);

  const date = new Date(merged.wedding_date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0a",
          color: "#f5f1ea",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7, letterSpacing: 4 }}>
          WEDDING INVITATION
        </div>
        <div style={{ fontSize: 64, marginTop: 24, textAlign: "center" }}>
          {merged.groom_name} & {merged.bride_name}
        </div>
        <div style={{ fontSize: 24, marginTop: 16, color: "#6b7a5e" }}>
          {date}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
