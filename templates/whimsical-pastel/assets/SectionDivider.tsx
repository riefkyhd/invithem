export function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden>
      <div className="h-px w-36 bg-gradient-to-r from-transparent via-[var(--tmpl-accent)]/30 to-transparent" />
      <svg viewBox="0 0 20 20" className="h-5 w-5 text-[var(--tmpl-sage)]" fill="currentColor">
        <path d="M10 2c-2 3-4 5-6 6 2 1 4 3 6 6 2-3 4-5 6-6-2-1-4-3-6-6z" />
      </svg>
      <div className="h-px w-36 bg-gradient-to-r from-transparent via-[var(--tmpl-accent)]/30 to-transparent" />
    </div>
  );
}
