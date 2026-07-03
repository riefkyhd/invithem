"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitRsvp } from "@/app/invitation/actions";
import { useI18n } from "@/lib/i18n/context";

const rsvpSchema = z.object({
  name: z.string().min(1),
  attending: z.enum(["yes", "no"]),
  guest_count: z.number().min(0).max(2),
  meal_preference: z.string().optional(),
  message: z.string().optional(),
});

export type RsvpFormData = z.infer<typeof rsvpSchema>;

export function useRsvp(
  projectId: string,
  eventId: string,
  eventLabel: string,
  guestId?: string | null,
  defaultName = ""
) {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [checkinToken, setCheckinToken] = useState<string | null>(null);

  const form = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: defaultName,
      attending: "yes",
      guest_count: 1,
      meal_preference: "",
      message: "",
    },
  });

  const attending = useWatch({ control: form.control, name: "attending" });

  async function onSubmit(data: RsvpFormData) {
    setError("");
    const result = await submitRsvp({
      projectId,
      eventId,
      guestId,
      name: data.name,
      attending: data.attending === "yes",
      guestCount: data.attending === "yes" ? data.guest_count : 0,
      mealPreference: data.meal_preference || null,
      message: data.message || null,
    });

    if (result.error) {
      setError(
        result.error === "already_submitted"
          ? t("rsvpAlreadySubmitted")
          : t("rsvpError")
      );
      return;
    }
    setCheckinToken(result.checkinToken ?? null);
    setSubmitted(true);
  }

  return {
    form,
    attending,
    submitted,
    error,
    checkinToken,
    eventLabel,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
    register: form.register,
    t,
  };
}
