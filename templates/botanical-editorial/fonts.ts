import { DM_Sans, Playfair_Display } from "next/font/google";
import type { TemplateFonts } from "@/templates/types";

const playfair = Playfair_Display({
  variable: "--tmpl-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--tmpl-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const fonts: TemplateFonts = {
  className: `${playfair.variable} ${dmSans.variable}`,
  displayClass: "font-[family-name:var(--tmpl-display)]",
  bodyClass: "font-[family-name:var(--tmpl-body)]",
};
