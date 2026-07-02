import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || props.name;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={textareaId} className="text-sm text-muted">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`min-h-28 w-full resize-y rounded-xl border border-card-border bg-surface px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
