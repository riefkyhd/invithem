"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteWish, getWishes, hideWish } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import type { Wish } from "@/lib/types/database";

export default function AdminWishesPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await getWishes(projectId);
    setWishes(data as Wish[]);
    setLoading(false);
  }

  useEffect(() => {
    void getWishes(projectId).then((data) => {
      setWishes(data as Wish[]);
      setLoading(false);
    });
  }, [projectId]);

  async function handleHide(id: string, hidden: boolean) {
    await hideWish(projectId, id, hidden);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this wish permanently?")) return;
    await deleteWish(projectId, id);
    load();
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted">Loading wishes…</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Wishes"
        description="Moderate guest book messages. Hidden wishes won't appear on the site."
      />

      <div className="space-y-4">
        {wishes.length === 0 ? (
          <div className="rounded-2xl border border-card-border bg-card px-6 py-16 text-center text-muted">
            No wishes yet.
          </div>
        ) : (
          wishes.map((wish) => (
            <div
              key={wish.id}
              className={`rounded-2xl border border-card-border bg-card p-6 transition-opacity ${
                wish.is_hidden ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{wish.name}</p>
                    {wish.is_hidden && (
                      <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-2 leading-relaxed text-muted">{wish.message}</p>
                  <p className="mt-3 text-xs text-muted">
                    {new Date(wish.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleHide(wish.id, !wish.is_hidden)}
                  >
                    {wish.is_hidden ? "Show" : "Hide"}
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(wish.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
