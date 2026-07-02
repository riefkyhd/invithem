"use client";

import { useEffect, useState } from "react";
import { deleteWish, getWishes, hideWish } from "@/app/admin/actions";
import type { Wish } from "@/lib/types/database";

export default function AdminWishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await getWishes();
    setWishes(data as Wish[]);
    setLoading(false);
  }

  useEffect(() => {
    void getWishes().then((data) => {
      setWishes(data as Wish[]);
      setLoading(false);
    });
  }, []);

  async function handleHide(id: string, hidden: boolean) {
    await hideWish(id, hidden);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this wish permanently?")) return;
    await deleteWish(id);
    load();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="font-display mb-8 text-4xl">Wishes</h1>
      <div className="space-y-4">
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className={`rounded-2xl border border-card-border p-6 ${
              wish.is_hidden ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{wish.name}</p>
                <p className="mt-2 text-muted">{wish.message}</p>
                <p className="mt-2 text-xs text-muted">
                  {new Date(wish.created_at).toLocaleString()}
                  {wish.is_hidden && " · Hidden"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => handleHide(wish.id, !wish.is_hidden)}
                  className="text-sm text-accent hover:underline"
                >
                  {wish.is_hidden ? "Show" : "Hide"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(wish.id)}
                  className="text-sm text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
