export function RotiBuayaDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 52"
      className={`mx-auto h-12 w-14 text-[var(--tmpl-accent-secondary)] ${className}`}
      aria-hidden
    >
      <path
        fill="currentColor"
        opacity="0.85"
        d="M4 30c8-14 20-22 24-22s16 8 24 22c-6 10-16 16-24 16S10 40 4 30z"
      />
      <ellipse cx="18" cy="28" rx="2.5" ry="3" fill="var(--tmpl-bg)" />
      <path
        d="M38 18c6 2 10 8 10 14"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
