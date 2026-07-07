import type { ButtonHTMLAttributes, ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="tmpl-display text-center text-[2rem] leading-tight text-[var(--tmpl-heading)]">
      {children}
    </h2>
  );
}

export function WpPrimaryButton({
  children,
  className = "",
  variant = "sage",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "sage" | "rose";
}) {
  const colors =
    variant === "rose"
      ? "bg-[var(--tmpl-accent-secondary)] hover:opacity-90"
      : "bg-[var(--tmpl-accent)] hover:opacity-90";
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base text-white shadow-[0_10px_15px_-3px_rgba(79,100,78,0.2)] transition-opacity disabled:opacity-50 ${colors} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export const wpFieldClass =
  "w-full rounded-2xl border border-[rgba(79,100,78,0.12)] bg-[var(--tmpl-surface)] px-4 py-3.5 text-sm text-[var(--tmpl-fg)] outline-none transition-colors placeholder:text-[var(--tmpl-muted)]/60 focus:border-[var(--tmpl-sage)]";
