import { Montserrat, Playfair_Display } from "next/font/google";
import type { TemplateFonts } from "@/templates/types";

const playfair = Playfair_Display({
  variable: "--tmpl-display",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--tmpl-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const fonts: TemplateFonts = {
  className: `${playfair.variable} ${montserrat.variable}`,
  displayClass: "font-[family-name:var(--tmpl-display)]",
  bodyClass: "font-[family-name:var(--tmpl-body)]",
};
