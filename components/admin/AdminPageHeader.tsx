interface AdminPageHeaderProps {
  title: string;
  description?: string;
}

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <header className="mb-8 md:mb-10">
      <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
