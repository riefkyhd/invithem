export function BatikBorder({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 16"
      preserveAspectRatio="none"
      className={`block h-4 w-full text-[var(--tmpl-accent)] ${className}`}
      aria-hidden
    >
      <pattern id="bw-batik" x="0" y="0" width="20" height="16" patternUnits="userSpaceOnUse">
        <rect width="20" height="16" fill="currentColor" opacity="0.08" />
        <path
          d="M0 8h6l2-4 2 4h6M10 8v8"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.55"
        />
      </pattern>
      <rect width="340" height="16" fill="url(#bw-batik)" />
    </svg>
  );
}
