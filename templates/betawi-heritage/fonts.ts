import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import type { TemplateFonts } from "@/templates/types";

const playfair = Playfair_Display({
  variable: "--tmpl-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--tmpl-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const fonts: TemplateFonts = {
  className: `${playfair.variable} ${sourceSans.variable}`,
  displayClass: "font-[family-name:var(--tmpl-display)]",
  bodyClass: "font-[family-name:var(--tmpl-body)]",
};
