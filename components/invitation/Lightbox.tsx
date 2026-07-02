"use client";

import Image from "next/image";
import { useEffect } from "react";

interface LightboxProps {
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: LightboxProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft")
        onNavigate((index - 1 + images.length) % images.length);
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [index, images.length, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute right-4 top-4 text-2xl text-white"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <button
        type="button"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-white"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + images.length) % images.length);
        }}
        aria-label="Previous"
      >
        ‹
      </button>
      <div
        className="relative h-[70vh] w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index].src}
          alt={images[index].alt}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>
      <button
        type="button"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-white"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % images.length);
        }}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}
