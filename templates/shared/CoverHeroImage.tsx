"use client";

import Image from "next/image";
import type { ReactNode } from "react";

interface CoverHeroImageProps {
  src: string;
  alt: string;
  children?: ReactNode;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** When false, keeps a dark scrim instead of fading into the template background. */
  blendToTemplate?: boolean;
}

/** Full-bleed hero image with scrims so overlay text stays readable on any photo. */
export function CoverHeroImage({
  src,
  alt,
  children,
  imageClassName = "",
  priority = true,
  sizes = "100vw",
  blendToTemplate = true,
}: CoverHeroImageProps) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${imageClassName}`}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/15"
        aria-hidden
      />
      {blendToTemplate ? (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--tmpl-bg)] from-0% via-[var(--tmpl-bg)]/70 via-40% to-transparent"
          aria-hidden
        />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35"
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}

interface CoverHeroTitleProps {
  eyebrow: ReactNode;
  title: ReactNode;
  className?: string;
}

/** High-contrast title block for hero photos (light text + frosted panel). */
export function CoverHeroTitle({
  eyebrow,
  title,
  className = "",
}: CoverHeroTitleProps) {
  return (
    <div className={`absolute inset-x-0 top-10 z-10 px-6 text-center ${className}`}>
      <div className="mx-auto inline-block max-w-[min(100%,26rem)] rounded-2xl bg-black/35 px-5 py-4 shadow-lg ring-1 ring-white/20 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.3em] text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
          {eyebrow}
        </p>
        <h1 className="tmpl-display mt-2 text-3xl uppercase leading-tight tracking-[0.15em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)] sm:text-4xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
