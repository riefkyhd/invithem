"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Wish } from "@/lib/types/database";

interface LiveWishesProps {
  projectSlug: string;
  projectId: string;
  templateId: string;
}

export function LiveWishesWall({
  projectSlug,
  templateId,
}: Omit<LiveWishesProps, "projectId">) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.rpc("get_project_wishes", {
        p_project_slug: projectSlug,
      });
      if (data) setWishes(data as Wish[]);
    }
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [projectSlug]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || wishes.length === 0) return;
    let pos = 0;
    const tick = () => {
      pos += 0.5;
      if (pos >= el.scrollHeight - el.clientHeight) pos = 0;
      el.scrollTop = pos;
    };
    const interval = setInterval(tick, 30);
    return () => clearInterval(interval);
  }, [wishes.length]);

  return (
    <div
      data-template={templateId}
      className="flex min-h-screen flex-col bg-[var(--tmpl-bg,#0b0b0a)] text-[var(--tmpl-fg,#f5f1ea)]"
    >
      <header className="border-b border-[var(--tmpl-card-border,#333)] px-8 py-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] opacity-60">Live Wishes</p>
      </header>
      <div
        ref={scrollRef}
        className="flex-1 overflow-hidden px-8 py-6"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {wishes.length === 0 ? (
            <p className="text-center opacity-50">Waiting for wishes...</p>
          ) : (
            [...wishes, ...wishes].map((wish, i) => (
              <div
                key={`${wish.id}-${i}`}
                className="rounded-2xl border border-[var(--tmpl-card-border,#333)] bg-[var(--tmpl-card,#141413)] p-8"
              >
                <p className="tmpl-display text-xl font-medium">{wish.name}</p>
                <p className="mt-3 text-lg leading-relaxed opacity-80">
                  {wish.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
