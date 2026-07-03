"use client";

import { useEffect, useRef, useState } from "react";

export function useAudioVisualizer(audioRef: React.RefObject<HTMLAudioElement | null>, active: boolean) {
  const [levels, setLevels] = useState([0.2, 0.2, 0.2, 0.2]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active || !audioRef.current) return;

    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audioRef.current);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 32;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);

    function tick() {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(data);
      const slice = Math.floor(data.length / 4);
      setLevels([
        data[0] / 255,
        data[slice] / 255,
        data[slice * 2] / 255,
        data[slice * 3] / 255,
      ]);
      rafRef.current = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      void ctx.close();
    };
  }, [active, audioRef]);

  return levels;
}
