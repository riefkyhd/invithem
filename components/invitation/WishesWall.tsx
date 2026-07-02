"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useI18n } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { containsProfanity } from "@/lib/utils/profanity";
import type { Wish } from "@/lib/types/database";

const wishSchema = z.object({
  name: z.string().min(1),
  message: z.string().min(1).max(500),
});

type WishFormData = z.infer<typeof wishSchema>;

interface WishesWallProps {
  initialWishes?: Wish[];
  defaultName?: string;
}

export function WishesWall({
  initialWishes = [],
  defaultName = "",
}: WishesWallProps) {
  const { t } = useI18n();
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WishFormData>({
    resolver: zodResolver(wishSchema),
    defaultValues: { name: defaultName, message: "" },
  });

  useEffect(() => {
    async function fetchWishes() {
      const supabase = createClient();
      const { data } = await supabase
        .from("wishes")
        .select("*")
        .eq("is_hidden", false)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setWishes(data);
    }
    if (initialWishes.length === 0) fetchWishes();
  }, [initialWishes.length]);

  async function onSubmit(data: WishFormData) {
    setError("");
    if (containsProfanity(data.message) || containsProfanity(data.name)) {
      setError(t("wishProfanity"));
      return;
    }

    const supabase = createClient();
    const { data: inserted, error: insertError } = await supabase
      .from("wishes")
      .insert({ name: data.name, message: data.message })
      .select()
      .single();

    if (insertError) {
      setError(t("wishError"));
      return;
    }

    if (inserted) setWishes((prev) => [inserted, ...prev]);
    reset({ name: defaultName, message: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <section id="wishes" className="px-6 py-20 md:px-12 lg:px-24">
      <SectionReveal>
        <h2 className="font-display mb-8 text-4xl md:text-5xl">{t("wishes")}</h2>
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-12 max-w-lg space-y-6"
        >
          <Input
            label={t("wishName")}
            {...register("name")}
            error={errors.name?.message}
          />
          <Textarea
            label={t("wishMessage")}
            {...register("message")}
            error={errors.message?.message}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          {submitted && (
            <p className="text-sm text-accent">{t("wishSuccess")}</p>
          )}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {t("wishSubmit")}
          </Button>
        </form>
      </SectionReveal>

      <div className="mx-auto max-w-3xl space-y-4">
        {wishes.length === 0 ? (
          <p className="text-center text-muted">{t("noWishes")}</p>
        ) : (
          wishes.map((wish, index) => (
            <SectionReveal key={wish.id} delay={(index % 5) * 0.05}>
              <div className="rounded-2xl border border-card-border bg-card p-6">
                <p className="font-medium">{wish.name}</p>
                <p className="mt-2 text-muted leading-relaxed">{wish.message}</p>
              </div>
            </SectionReveal>
          ))
        )}
      </div>
    </section>
  );
}
