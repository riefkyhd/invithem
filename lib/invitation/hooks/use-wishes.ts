"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useI18n } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { containsProfanity } from "@/lib/utils/profanity";
import type { Wish } from "@/lib/types/database";

const wishSchema = z.object({
  name: z.string().min(1),
  message: z.string().min(1).max(500),
});

export type WishFormData = z.infer<typeof wishSchema>;

export function useWishes(
  projectId: string,
  projectSlug: string,
  initialWishes: Wish[] = [],
  defaultName = ""
) {
  const { t } = useI18n();
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [wishesLoading, setWishesLoading] = useState(initialWishes.length === 0);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<WishFormData>({
    resolver: zodResolver(wishSchema),
    defaultValues: { name: defaultName, message: "" },
  });

  useEffect(() => {
    async function fetchWishes() {
      setWishesLoading(true);
      const supabase = createClient();
      const { data } = await supabase.rpc("get_project_wishes", {
        p_project_slug: projectSlug,
      });
      if (data) setWishes(data);
      setWishesLoading(false);
    }
    if (initialWishes.length === 0) fetchWishes();
  }, [initialWishes.length, projectSlug]);

  async function onSubmit(data: WishFormData) {
    setError("");
    if (containsProfanity(data.message) || containsProfanity(data.name)) {
      setError(t("wishProfanity"));
      return;
    }

    const supabase = createClient();
    const { data: inserted, error: insertError } = await supabase
      .from("wishes")
      .insert({
        project_id: projectId,
        name: data.name,
        message: data.message,
      })
      .select()
      .single();

    if (insertError) {
      setError(t("wishError"));
      return;
    }

    if (inserted) setWishes((prev) => [inserted, ...prev]);
    form.reset({ name: defaultName, message: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return {
    wishes,
    wishesLoading,
    form,
    error,
    submitted,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
    register: form.register,
    t,
  };
}
