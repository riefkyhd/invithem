import type { ButtonHTMLAttributes, ReactNode } from "react";

export function MnEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="tmpl-body text-xs font-semibold uppercase tracking-[0.24em] text-[var(--tmpl-muted)]">
      {children}
    </p>
  );
}

export function MnPrimaryButton({
  children,
  className = "",
  variant = "solid",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "inverse-solid" | "inverse-outline";
}) {
  const styles = {
    solid: "bg-black text-white border border-black",
    outline: "border border-black bg-transparent text-black",
    "inverse-solid": "bg-white text-black border border-white",
    "inverse-outline": "border border-white/30 bg-transparent text-white",
  }[variant];

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center px-10 py-5 text-[10px] font-normal uppercase tracking-[0.3em] transition-opacity hover:opacity-85 disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export const mnFieldClass =
  "w-full border-0 border-b border-black/20 bg-transparent px-0 py-4 text-sm uppercase tracking-[0.12em] text-[var(--tmpl-fg)] outline-none placeholder:text-[var(--tmpl-muted)]/70 focus:border-black";
