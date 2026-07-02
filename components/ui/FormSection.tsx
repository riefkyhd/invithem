import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <section
      className={`rounded-2xl border border-card-border bg-card p-6 md:p-8 ${className}`}
    >
      <div className="mb-6 border-b border-card-border pb-4">
        <h2 className="font-display text-xl md:text-2xl">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
