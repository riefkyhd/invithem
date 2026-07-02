"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type CSSProperties } from "react";

interface BotanicalDividerProps {
  className?: string;
  variant?: "branch" | "leaves" | "sprig";
  color?: string;
  drift?: boolean;
  style?: CSSProperties;
}

function BranchSvg({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 280 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <path
        d="M8 24C40 24 60 12 90 24C120 36 140 12 170 24C200 36 220 18 272 24"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M90 24C88 18 84 10 78 6"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M90 24C94 16 100 10 108 8"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <ellipse cx="78" cy="5" rx="5" ry="3" stroke={color} strokeWidth="0.8" transform="rotate(-30 78 5)" />
      <ellipse cx="108" cy="7" rx="5" ry="3" stroke={color} strokeWidth="0.8" transform="rotate(25 108 7)" />
      <path
        d="M170 24C168 30 162 38 154 42"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <ellipse cx="154" cy="43" rx="5" ry="3" stroke={color} strokeWidth="0.8" transform="rotate(40 154 43)" />
    </svg>
  );
}

function LeavesSvg({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <path
        d="M60 72V20"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M60 40C48 32 30 28 18 34C30 38 44 44 60 48"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M60 52C72 44 90 40 102 46C90 50 76 56 60 60"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M60 28C52 18 44 10 36 6C46 14 54 22 60 32"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M60 28C68 18 76 10 84 6C74 14 66 22 60 32"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SprigSvg({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <path
        d="M4 16H196"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="100" cy="16" r="3" stroke={color} strokeWidth="1" />
      <path
        d="M100 16C92 10 82 8 74 12"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M100 16C108 10 118 8 126 12"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <ellipse cx="74" cy="11" rx="4" ry="2.5" stroke={color} strokeWidth="0.8" transform="rotate(-20 74 11)" />
      <ellipse cx="126" cy="11" rx="4" ry="2.5" stroke={color} strokeWidth="0.8" transform="rotate(20 126 11)" />
    </svg>
  );
}

export function BotanicalDivider({
  className = "",
  variant = "branch",
  color = "var(--tmpl-accent)",
  drift = false,
  style,
}: BotanicalDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], drift ? [12, -12] : [0, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], drift ? [-2, 2] : [0, 0]);

  const heights = { branch: "h-12", leaves: "h-20", sprig: "h-8" };
  const widths = { branch: "w-64 md:w-80", leaves: "w-24", sprig: "w-48" };

  const content = (
    <div
      className={`${heights[variant]} ${widths[variant]} ${className}`}
      style={style}
    >
      {variant === "branch" && <BranchSvg color={color} />}
      {variant === "leaves" && <LeavesSvg color={color} />}
      {variant === "sprig" && <SprigSvg color={color} />}
    </div>
  );

  if (!drift) return content;

  return (
    <motion.div ref={ref} style={{ y, rotate }} className="inline-flex">
      {content}
    </motion.div>
  );
}
