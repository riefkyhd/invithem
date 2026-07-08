import { Cormorant_Garamond, Jost } from "next/font/google";
import type { TemplateFonts } from "@/templates/types";

const cormorant = Cormorant_Garamond({
  variable: "--tmpl-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--tmpl-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const fonts: TemplateFonts = {
  className: `${cormorant.variable} ${jost.variable}`,
  displayClass: "font-[family-name:var(--tmpl-display)]",
  bodyClass: "font-[family-name:var(--tmpl-body)]",
};
