import { Cormorant, Lora } from "next/font/google";
import type { TemplateFonts } from "@/templates/types";

const lora = Lora({
  variable: "--tmpl-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant({
  variable: "--tmpl-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const fonts: TemplateFonts = {
  className: `${lora.variable} ${cormorant.variable}`,
  displayClass: "font-[family-name:var(--tmpl-display)]",
  bodyClass: "font-[family-name:var(--tmpl-body)]",
};
