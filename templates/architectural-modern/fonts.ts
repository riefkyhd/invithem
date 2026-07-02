import { IBM_Plex_Sans } from "next/font/google";
import type { TemplateFonts } from "@/templates/types";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--tmpl-font",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const fonts: TemplateFonts = {
  className: ibmPlexSans.variable,
  displayClass: "font-[family-name:var(--tmpl-font)]",
  bodyClass: "font-[family-name:var(--tmpl-font)]",
};
