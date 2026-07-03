"use client";

import { useI18n } from "@/lib/i18n/context";
import { useAudioVisualizer } from "@/lib/invitation/hooks/use-audio-visualizer";
import { useTheme } from "@/lib/theme/context";

interface MusicToggleProps {
  musicUrl?: string;
}

export function MusicToggle({ musicUrl }: MusicToggleProps) {
  const { t } = useI18n();
  const { musicStarted, musicMuted, toggleMusic, audioRef } = useTheme();
  const levels = useAudioVisualizer(audioRef, musicStarted && !musicMuted);

  if (!musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      {musicStarted && (
        <button
          type="button"
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-card-border bg-card/80 backdrop-blur-sm transition-colors hover:border-accent"
          aria-label={musicMuted ? t("musicOn") : t("musicOff")}
        >
          {musicMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <div className="flex h-4 items-end gap-0.5" aria-hidden>
              {levels.map((level, index) => (
                <span
                  key={index}
                  className="w-0.5 rounded-full bg-current transition-[height] duration-75"
                  style={{ height: `${Math.max(4, level * 16)}px` }}
                />
              ))}
            </div>
          )}
        </button>
      )}
    </>
  );
}
