"use client";

import { useWatch } from "react-hook-form";
import { useWishes } from "@/lib/invitation/hooks/use-wishes";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import { GuestBookSkeleton } from "@/templates/shared/GuestBookSkeleton";
import type { GuestBookProps } from "@/lib/types/wedding-data";
import {
  ReferenceAccentButton,
  ReferenceTextArea,
  ReferenceTextField,
  SectionHeading,
} from "../ui";
import { motion } from "../motion";

const WISH_MAX = 300;

function wishInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function GuestBook({ data }: GuestBookProps) {
  const {
    wishes,
    wishesLoading,
    error,
    submitted,
    onSubmit,
    isSubmitting,
    errors,
    register,
    form,
    t,
  } = useWishes(data.projectId, data.projectSlug, data.wishes, data.guest?.name ?? "");

  const message = useWatch({ control: form.control, name: "message" }) ?? "";
  const charsLeft = WISH_MAX - message.length;

  return (
    <section id="wishes" className="bg-[var(--tmpl-dark)] px-6 py-16 text-[var(--tmpl-cream)]">
      <TemplateSectionReveal motion={motion}>
        <SectionHeading title={t("wishes")} variant="dark" className="mb-10" />
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.1}>
        <form onSubmit={onSubmit} className="mx-auto mb-10 max-w-md space-y-4">
          <div>
            <ReferenceTextField
              variant="dark"
              {...register("name")}
              placeholder={t("wishName")}
              aria-label={t("wishName")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-300">{errors.name.message}</p>
            )}
          </div>
          <div>
            <ReferenceTextArea
              variant="dark"
              {...register("message")}
              maxLength={WISH_MAX}
              placeholder={t("wishPlaceholder")}
              aria-label={t("wishMessage")}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-300">{errors.message.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
          {submitted && (
            <p className="text-sm text-[var(--tmpl-cream)]/90">{t("wishSuccess")}</p>
          )}
          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] italic text-[var(--tmpl-cream)]/60">
              {t("wishCharsRemaining")} {Math.max(0, charsLeft)}
            </p>
            <ReferenceAccentButton type="submit" disabled={isSubmitting}>
              {t("wishSubmit")}
            </ReferenceAccentButton>
          </div>
        </form>
      </TemplateSectionReveal>

      {wishesLoading ? (
        <GuestBookSkeleton />
      ) : (
        <div className="mx-auto max-w-md space-y-4">
          {wishes.map((wish, index) => (
            <TemplateSectionReveal
              key={wish.id}
              motion={motion}
              delay={(index % 5) * 0.05}
            >
              <article className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--tmpl-cream)] text-xs font-bold text-[var(--tmpl-dark)]">
                    {wishInitial(wish.name)}
                  </div>
                  <p className="text-sm font-semibold">{wish.name}</p>
                </div>
                <p className="tmpl-display mt-3 text-sm italic leading-5 text-[var(--tmpl-cream)]/80">
                  &ldquo;{wish.message}&rdquo;
                </p>
              </article>
            </TemplateSectionReveal>
          ))}
        </div>
      )}
    </section>
  );
}
