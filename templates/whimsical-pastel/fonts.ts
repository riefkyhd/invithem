import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import type { TemplateFonts } from "@/templates/types";

const playfair = Playfair_Display({
  variable: "--tmpl-display",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--tmpl-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const fonts: TemplateFonts = {
  className: `${playfair.variable} ${plusJakarta.variable}`,
  displayClass: "font-[family-name:var(--tmpl-display)]",
  bodyClass: "font-[family-name:var(--tmpl-body)]",
};
