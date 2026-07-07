"use client";

import { CopyButton } from "@/components/ui/CopyButton";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GiftEnvelopeProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

export function GiftEnvelope({ data }: GiftEnvelopeProps) {
  const { t } = useI18n();
  const accounts = data.gift.bankAccounts;
  if (accounts.length === 0 && !data.gift.shippingAddress?.trim()) return null;

  return (
    <section id="gift" className="px-6 py-20 md:px-8">
      <TemplateSectionReveal motion={motion} className="mx-auto max-w-md">
        <div className="mn-card p-10">
          <h2 className="tmpl-display text-5xl leading-none text-[var(--tmpl-fg)]">
            {t("gift")}
          </h2>
          <p className="tmpl-body mt-6 text-base leading-relaxed text-[var(--tmpl-muted)]">
            {t("giftDesc")}
          </p>

          <div className="mt-10 space-y-8">
            {accounts.map((account) => (
              <div
                key={`${account.bank}-${account.account_number}`}
                className="border-t border-black/10 pt-8 first:border-t-0 first:pt-0"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                  {account.label || account.bank}
                </p>
                <p className="tmpl-display mt-4 text-3xl tracking-wide text-[var(--tmpl-fg)]">
                  {account.account_number}
                </p>
                <p className="tmpl-body mt-2 text-sm uppercase tracking-[0.12em] text-[var(--tmpl-muted)]">
                  {account.account_name}
                </p>
                <div className="mt-4">
                  <CopyButton value={account.account_number} />
                </div>
              </div>
            ))}
          </div>

          {data.gift.shippingAddress?.trim() && (
            <div className="mt-8 border-t border-black/10 pt-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tmpl-muted)]">
                {t("giftShipping")}
              </p>
              <p className="tmpl-body mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--tmpl-fg)]">
                {data.gift.shippingAddress}
              </p>
            </div>
          )}
        </div>
      </TemplateSectionReveal>
    </section>
  );
}
