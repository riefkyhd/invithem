import { Fraunces, Inter } from "next/font/google";
import type { TemplateFonts } from "@/templates/types";

const fraunces = Fraunces({
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
  className: `${fraunces.variable} ${inter.variable}`,
  displayClass: "font-[family-name:var(--tmpl-display)]",
  bodyClass: "font-[family-name:var(--tmpl-body)]",
};
