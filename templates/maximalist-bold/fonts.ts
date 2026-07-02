import { Outfit, Syne } from "next/font/google";
import type { TemplateFonts } from "@/templates/types";

const syne = Syne({
  variable: "--tmpl-display",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--tmpl-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const fonts: TemplateFonts = {
  className: `${syne.variable} ${outfit.variable}`,
  displayClass: "font-[family-name:var(--tmpl-display)]",
  bodyClass: "font-[family-name:var(--tmpl-body)]",
};
