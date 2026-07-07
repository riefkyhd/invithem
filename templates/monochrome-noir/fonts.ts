import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import type { TemplateFonts } from "@/templates/types";

const bodoni = Bodoni_Moda({
  variable: "--tmpl-display",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const hanken = Hanken_Grotesk({
  variable: "--tmpl-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const fonts: TemplateFonts = {
  className: `${bodoni.variable} ${hanken.variable}`,
  displayClass: "font-[family-name:var(--tmpl-display)]",
  bodyClass: "font-[family-name:var(--tmpl-body)]",
};
