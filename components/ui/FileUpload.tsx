"use client";

import { useRef } from "react";

interface FileUploadProps {
  label: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  currentLabel?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUpload({
  label,
  hint,
  accept,
  multiple,
  currentLabel,
  onChange,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </span>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-card-border bg-surface/50 px-6 py-8 text-center transition-all hover:border-accent hover:bg-surface"
      >
        <span className="mb-2 text-2xl text-muted transition-colors group-hover:text-accent">
          ↑
        </span>
        <span className="text-sm font-medium text-foreground">
          Click to upload
        </span>
        {hint && <span className="mt-1 text-xs text-muted">{hint}</span>}
        {currentLabel && (
          <span className="mt-3 rounded-full bg-card px-3 py-1 text-xs text-accent">
            {currentLabel}
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={onChange}
        />
      </div>
    </div>
  );
}
