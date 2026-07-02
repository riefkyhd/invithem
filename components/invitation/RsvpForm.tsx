"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useI18n } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";

const rsvpSchema = z.object({
  name: z.string().min(1),
  attending: z.enum(["yes", "no"]),
  guest_count: z.number().min(0).max(2),
  meal_preference: z.string().optional(),
  message: z.string().optional(),
});

type RsvpFormData = z.infer<typeof rsvpSchema>;

interface RsvpFormProps {
  guestId?: string | null;
  defaultName?: string;
}

export function RsvpForm({ guestId, defaultName = "" }: RsvpFormProps) {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: defaultName,
      attending: "yes",
      guest_count: 1,
      meal_preference: "",
      message: "",
    },
  });

  const attending = useWatch({ control, name: "attending" });

  async function onSubmit(data: RsvpFormData) {
    setError("");
    const supabase = createClient();
    const { error: insertError } = await supabase.from("rsvps").insert({
      guest_id: guestId || null,
      name: data.name,
      attending: data.attending === "yes",
      guest_count: data.attending === "yes" ? data.guest_count : 0,
      meal_preference: data.meal_preference || null,
      message: data.message || null,
    });

    if (insertError) {
      setError(t("rsvpError"));
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section id="rsvp" className="px-6 py-20 md:px-12 lg:px-24">
        <SectionReveal>
          <p className="text-center text-lg text-accent">{t("rsvpSuccess")}</p>
        </SectionReveal>
      </section>
    );
  }

  return (
    <section id="rsvp" className="px-6 py-20 md:px-12 lg:px-24">
      <SectionReveal>
        <h2 className="font-display mb-8 text-4xl md:text-5xl">{t("rsvp")}</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-lg space-y-6"
        >
          <Input
            label={t("rsvpName")}
            {...register("name")}
            error={errors.name?.message}
          />

          <fieldset className="space-y-3">
            <legend className="text-sm text-muted">{t("rsvpAttending")}</legend>
            <label className="flex items-center gap-3">
              <input type="radio" value="yes" {...register("attending")} />
              {t("rsvpYes")}
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" value="no" {...register("attending")} />
              {t("rsvpNo")}
            </label>
          </fieldset>

          {attending === "yes" && (
            <>
              <Input
                label={t("rsvpGuestCount")}
                type="number"
                min={1}
                max={2}
                {...register("guest_count", { valueAsNumber: true })}
                error={errors.guest_count?.message}
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted">{t("rsvpMeal")}</label>
                <select
                  className="rounded-xl border border-card-border bg-surface px-4 py-3 outline-none focus:border-accent"
                  {...register("meal_preference")}
                >
                  <option value="">{t("mealRegular")}</option>
                  <option value="vegetarian">{t("mealVegetarian")}</option>
                </select>
              </div>
            </>
          )}

          <Textarea label={t("rsvpMessage")} {...register("message")} />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {t("rsvpSubmit")}
          </Button>
        </form>
      </SectionReveal>
    </section>
  );
}
