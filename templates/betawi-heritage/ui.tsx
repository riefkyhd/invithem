import type { ButtonHTMLAttributes, ReactNode } from "react";

export function BwEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="tmpl-body text-xs font-semibold uppercase tracking-[0.28em] text-[var(--tmpl-accent)]">
      {children}
    </p>
  );
}

export function BwSectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`tmpl-display text-[clamp(1.75rem,7vw,2.5rem)] font-semibold leading-tight text-[var(--tmpl-heading)] ${className}`}
    >
      {children}
    </h2>
  );
}

export function BwPrimaryButton({
  children,
  className = "",
  variant = "solid",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "inverse";
}) {
  const styles = {
    solid:
      "border border-[var(--tmpl-accent)] bg-[var(--tmpl-accent)] text-[var(--tmpl-accent-fg)]",
    outline:
      "border border-[var(--tmpl-accent)] bg-transparent text-[var(--tmpl-accent)]",
    inverse:
      "border border-white/50 bg-transparent text-white hover:bg-white/10",
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-[opacity,background-color] hover:opacity-90 disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export const bwFieldClass =
  "w-full rounded-sm border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)] px-4 py-3 text-sm text-[var(--tmpl-fg)] outline-none placeholder:text-[var(--tmpl-muted)] focus:border-[var(--tmpl-accent)]";
