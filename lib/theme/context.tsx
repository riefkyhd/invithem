"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  musicStarted: boolean;
  setMusicStarted: (started: boolean) => void;
  musicMuted: boolean;
  toggleMusic: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("invithem-theme");
  return stored === "light" ? "light" : "dark";
}

function getInitialMusicMuted(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("invithem-music-muted") === "true";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [musicStarted, setMusicStarted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(getInitialMusicMuted);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("invithem-theme", theme);
  }, [theme]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !musicStarted) return;
    audio.muted = musicMuted;
    if (!musicMuted) {
      audio.play().catch(() => {});
    }
    sessionStorage.setItem("invithem-music-muted", String(musicMuted));
  }, [musicStarted, musicMuted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const toggleMusic = useCallback(() => {
    setMusicMuted((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      musicStarted,
      setMusicStarted,
      musicMuted,
      toggleMusic,
      audioRef,
    }),
    [theme, toggleTheme, musicStarted, musicMuted, toggleMusic]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
