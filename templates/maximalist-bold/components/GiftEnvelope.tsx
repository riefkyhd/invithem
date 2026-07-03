"use client";

import { CopyButton } from "@/components/ui/CopyButton";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GiftEnvelopeProps } from "@/lib/types/wedding-data";
import { motion } from "../motion";

const CARD_HEADERS = ["mb-color-coral", "mb-color-purple", "mb-color-chartreuse"] as const;

export function GiftEnvelope({ data }: GiftEnvelopeProps) {
  const { t } = useI18n();

  return (
    <section id="gift" className="px-6 py-20 md:px-12 md:py-28">
      <TemplateSectionReveal motion={motion}>
        <h2 className="tmpl-display mb-4 text-[clamp(2.5rem,7vw,4rem)] font-extrabold uppercase tracking-[-0.03em]">
          {t("gift")}
        </h2>
        <p className="tmpl-body mb-14 max-w-md leading-relaxed text-[var(--tmpl-muted)]">
          {t("giftDesc")}
        </p>

        <div className="max-w-lg space-y-8">
          {data.gift.bankAccounts.map((account, index) => (
            <div
              key={`${account.bank}-${account.account_number}`}
              className="overflow-hidden border-4 border-[var(--tmpl-fg)] bg-[var(--tmpl-card)] shadow-[8px_8px_0_var(--tmpl-purple)]"
            >
              <div className={`${CARD_HEADERS[index % CARD_HEADERS.length]} px-6 py-3`}>
                <p className="tmpl-body text-[10px] font-bold uppercase tracking-[0.3em]">
                  {account.label}
                </p>
              </div>
              <div className="px-6 py-6">
                <p className="tmpl-body text-sm font-semibold">{account.bank}</p>
                <p className="tmpl-display mt-4 text-2xl font-extrabold tracking-[-0.02em]">
                  {account.account_number}
                </p>
                <p className="tmpl-body mt-2 text-sm text-[var(--tmpl-muted)]">
                  {account.account_name}
                </p>
                <div className="mt-6">
                  <CopyButton value={account.account_number} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.gift.shippingAddress?.trim() && (
          <div className="mt-8 max-w-lg overflow-hidden border-4 border-[var(--tmpl-fg)] bg-[var(--tmpl-card)] shadow-[8px_8px_0_var(--tmpl-chartreuse)]">
            <div className="mb-color-chartreuse px-6 py-3">
              <p className="tmpl-body text-[10px] font-bold uppercase tracking-[0.3em]">
                {t("giftShipping")}
              </p>
            </div>
            <div className="px-6 py-6">
              <p className="tmpl-body whitespace-pre-line text-sm leading-relaxed">
                {data.gift.shippingAddress}
              </p>
            </div>
          </div>
        )}
      </TemplateSectionReveal>
    </section>
  );
}
