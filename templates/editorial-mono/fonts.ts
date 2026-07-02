import { Inter, Space_Grotesk } from "next/font/google";
import type { TemplateFonts } from "@/templates/types";

const spaceGrotesk = Space_Grotesk({
  variable: "--tmpl-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--tmpl-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const fonts: TemplateFonts = {
  className: `${spaceGrotesk.variable} ${inter.variable}`,
  displayClass: "font-[family-name:var(--tmpl-display)]",
  bodyClass: "font-[family-name:var(--tmpl-body)]",
};
