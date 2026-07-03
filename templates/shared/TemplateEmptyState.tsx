interface TemplateEmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function TemplateEmptyState({
  title,
  description,
  className = "",
}: TemplateEmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-dashed border-[var(--tmpl-muted)]/40 px-6 py-12 text-center ${className}`}
    >
      <p className="tmpl-display text-lg text-[var(--tmpl-fg)]">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-[var(--tmpl-muted)]">{description}</p>
      )}
    </div>
  );
}
