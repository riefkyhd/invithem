"use client";

interface GuestBookSkeletonProps {
  count?: number;
  cardClassName?: string;
}

export function GuestBookSkeleton({
  count = 3,
  cardClassName = "rounded-2xl border border-[var(--tmpl-card-border)] bg-[var(--tmpl-card)] p-6",
}: GuestBookSkeletonProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-4" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`animate-pulse ${cardClassName}`}>
          <div className="h-4 w-32 rounded bg-[var(--tmpl-muted)]/20" />
          <div className="mt-3 h-3 w-full rounded bg-[var(--tmpl-muted)]/10" />
          <div className="mt-2 h-3 w-4/5 rounded bg-[var(--tmpl-muted)]/10" />
        </div>
      ))}
    </div>
  );
}
