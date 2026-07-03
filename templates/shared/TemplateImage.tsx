import Image, { type ImageProps } from "next/image";
import type { TemplateId } from "@/lib/types/database";
import { getImageTreatmentClass } from "./image-treatments";

interface TemplateImageProps extends Omit<ImageProps, "alt"> {
  templateId: TemplateId;
  alt: string;
  parallax?: boolean;
}

export function TemplateImage({
  templateId,
  className = "",
  parallax = false,
  ...props
}: TemplateImageProps) {
  const treatment = getImageTreatmentClass(templateId);
  const wrapperClass = parallax ? "tmpl-parallax-wrap" : "";

  return (
    <div className={`relative overflow-hidden ${wrapperClass} ${className}`}>
      <Image
        {...props}
        alt={props.alt}
        className={`object-cover ${treatment}`}
      />
    </div>
  );
}
