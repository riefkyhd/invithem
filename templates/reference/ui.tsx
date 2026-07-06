"use client";

import type { ReactNode } from "react";

export function SectionHeading({
  title,
  subtitle,
  variant = "light",
  className = "",
}: {
  title: string;
  subtitle?: string;
  variant?: "light" | "dark";
  className?: string;
}) {
  const titleColor =
    variant === "dark" ? "text-[var(--tmpl-cream)]" : "text-[var(--tmpl-heading)]";
  const dividerColor =
    variant === "dark" ? "bg-[var(--tmpl-cream)]" : "bg-[var(--tmpl-gold)]";
  const subtitleColor =
    variant === "dark" ? "text-[var(--tmpl-cream)]/80" : "text-[var(--tmpl-body-muted)]";

  return (
    <div className={`flex flex-col items-center gap-2 text-center ${className}`}>
      <h2 className={`tmpl-display text-[30px] italic leading-9 ${titleColor}`}>
        {title}
      </h2>
      <div className={`h-px w-16 ${dividerColor}`} />
      {subtitle && (
        <p className={`max-w-sm text-sm leading-5 ${subtitleColor}`}>{subtitle}</p>
      )}
    </div>
  );
}

const lightFieldClass =
  "w-full rounded-lg border border-[var(--tmpl-card-border)] bg-[var(--tmpl-surface)] px-4 py-3 text-sm text-[var(--tmpl-heading)] outline-none transition-colors placeholder:text-[var(--tmpl-muted)] focus:border-[var(--tmpl-gold)]";

const darkFieldClass =
  "w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-base text-[var(--tmpl-cream)] outline-none transition-colors placeholder:text-[var(--tmpl-cream)]/50 focus:border-[var(--tmpl-cream)]/40";

export function ReferenceTextField({
  variant = "light",
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { variant?: "light" | "dark" }) {
  return (
    <input
      className={`${variant === "dark" ? darkFieldClass : lightFieldClass} ${className}`}
      {...props}
    />
  );
}

export function ReferenceTextArea({
  variant = "light",
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: "light" | "dark";
}) {
  return (
    <textarea
      className={`${variant === "dark" ? darkFieldClass : lightFieldClass} min-h-[122px] resize-y ${className}`}
      {...props}
    />
  );
}

export function ReferencePrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`rounded-full bg-[var(--tmpl-heading)] px-8 py-2 text-sm font-medium tracking-wide text-[var(--tmpl-cream)] shadow-md transition-opacity hover:opacity-90 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ReferenceAccentButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`rounded-full bg-[var(--tmpl-cream)] px-8 py-2 text-sm font-semibold tracking-wider text-[var(--tmpl-heading)] transition-opacity hover:opacity-90 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ReferenceOutlineButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`rounded border border-[var(--tmpl-gold)] px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--tmpl-gold)] transition-colors hover:bg-[var(--tmpl-gold)]/10 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
