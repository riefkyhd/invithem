export function LeafIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <path
        d="M20 4C12 12 8 20 8 28c0 4 2 8 6 8 4-6 6-12 6-18 0-6-2-10-6-14-2 2-4 4-6 6z"
        className="text-[var(--tmpl-sage)]"
      />
      <path d="M20 12v20" className="text-[var(--tmpl-sage)]/60" />
    </svg>
  );
}
