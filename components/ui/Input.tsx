import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm text-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border border-card-border bg-surface px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
