import type { ButtonHTMLAttributes, ReactNode } from "react";

export function ShEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="tmpl-body text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
      {children}
    </p>
  );
}

export function ShSectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`tmpl-display text-[clamp(2.25rem,8vw,3.25rem)] font-light leading-[1.05] tracking-wide text-[var(--tmpl-heading)] ${className}`}
    >
      {children}
    </h2>
  );
}

export function ShPrimaryButton({
  children,
  className = "",
  variant = "solid",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "inverse";
}) {
  const styles = {
    solid: "border border-[var(--tmpl-accent)] bg-[var(--tmpl-accent)] text-[var(--tmpl-accent-fg)]",
    outline:
      "border border-[var(--tmpl-accent)] bg-transparent text-[var(--tmpl-fg)]",
    inverse:
      "border border-white/50 bg-transparent text-white hover:bg-white/10",
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-[10px] font-medium uppercase tracking-[0.3em] transition-[opacity,background-color] hover:opacity-90 disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export const shFieldClass =
  "w-full border-0 border-b border-[var(--tmpl-muted)]/25 bg-transparent px-0 py-3 text-sm text-[var(--tmpl-fg)] outline-none placeholder:text-[var(--tmpl-muted)] focus:border-[var(--tmpl-accent)]";

export function SculpturalCurve({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 390 80"
      preserveAspectRatio="none"
      className={`block w-full text-[var(--tmpl-bg)] ${className}`}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 80V32C65 80 130 0 195 32C260 64 325 0 390 32V80H0Z"
      />
    </svg>
  );
}
