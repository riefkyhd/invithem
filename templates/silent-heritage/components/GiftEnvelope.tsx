"use client";

import { CopyButton } from "@/components/ui/CopyButton";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GiftEnvelopeProps } from "@/lib/types/wedding-data";
import { SculpturalCurve, ShSectionTitle } from "../ui";
import { motion } from "../motion";

export function GiftEnvelope({ data }: GiftEnvelopeProps) {
  const { t } = useI18n();
  const accounts = data.gift.bankAccounts;
  if (accounts.length === 0 && !data.gift.shippingAddress?.trim()) return null;

  return (
    <section id="gift" className="relative bg-[var(--tmpl-surface)] pb-24 pt-0">
      <SculpturalCurve className="text-[var(--tmpl-bg)]" />
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-lg px-6 pt-16 md:px-8">
        <ShSectionTitle>
          {t("gift")}
        </ShSectionTitle>
        <p className="tmpl-body mt-6 text-base leading-relaxed text-[var(--tmpl-muted)]">
          {t("giftDesc")}
        </p>

        {data.gift.shippingAddress?.trim() && (
          <div className="mt-10 border border-[var(--tmpl-card-border)] bg-[var(--tmpl-card)]/80 p-6 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
              {t("giftShipping")}
            </p>
            <p className="tmpl-body mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--tmpl-fg)]">
              {data.gift.shippingAddress}
            </p>
          </div>
        )}

        <div className="mt-10 space-y-6">
          {accounts.map((account) => (
            <div
              key={`${account.bank}-${account.account_number}`}
              className="sh-card p-8"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                {account.label || account.bank}
              </p>
              <p className="tmpl-display mt-4 text-2xl text-[var(--tmpl-heading)]">
                {account.bank}
              </p>
              <p className="tmpl-body mt-2 text-sm text-[var(--tmpl-muted)]">
                {account.account_name}
              </p>
              <div className="mt-4 flex flex-col gap-3 border border-[var(--tmpl-card-border)] bg-[var(--tmpl-bg)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="tmpl-body break-all text-sm tracking-widest text-[var(--tmpl-fg)]">
                  {account.account_number}
                </p>
                <CopyButton
                  value={account.account_number}
                  className="shrink-0 self-start border-[var(--tmpl-card-border)] text-[var(--tmpl-fg)] hover:border-[var(--tmpl-accent)] hover:text-[var(--tmpl-accent)] sm:self-center"
                />
              </div>
            </div>
          ))}
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
