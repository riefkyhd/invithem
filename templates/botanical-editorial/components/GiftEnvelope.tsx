"use client";

import { CopyButton } from "@/components/ui/CopyButton";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GiftEnvelopeProps } from "@/lib/types/wedding-data";
import { BotanicalDivider } from "../assets/BotanicalDivider";
import { motion } from "../motion";

export function GiftEnvelope({ data }: GiftEnvelopeProps) {
  const { t } = useI18n();

  return (
    <section id="gift" className="botanical-section px-6 py-20 md:px-12 lg:px-24">
      <TemplateSectionReveal motion={motion}>
        <div className="text-center">
          <BotanicalDivider variant="branch" drift className="mx-auto mb-6 opacity-60" />
          <h2 className="tmpl-display text-4xl text-[var(--tmpl-fg)] md:text-5xl">
            {t("gift")}
          </h2>
          <p className="tmpl-body mx-auto mt-4 max-w-xl leading-relaxed text-[var(--tmpl-muted)]">
            {t("giftDesc")}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6">
          {data.gift.bankAccounts.map((account) => (
            <div
              key={`${account.bank}-${account.account_number}`}
              className="rounded-2xl border-2 border-[var(--tmpl-card-border)] bg-[var(--tmpl-bg)] p-8 shadow-sm"
            >
              <p className="text-xs uppercase tracking-wider text-[var(--tmpl-accent)]">
                {account.label}
              </p>
              <p className="tmpl-body mt-2 font-medium text-[var(--tmpl-fg)]">
                {account.bank}
              </p>
              <p className="tmpl-display mt-4 text-2xl tracking-wider text-[var(--tmpl-accent-secondary)]">
                {account.account_number}
              </p>
              <p className="tmpl-body mt-2 text-sm text-[var(--tmpl-muted)]">
                {account.account_name}
              </p>
              <div className="mt-6">
                <CopyButton value={account.account_number} />
              </div>
            </div>
          ))}
        </div>

        {data.gift.shippingAddress?.trim() && (
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border-2 border-[var(--tmpl-card-border)] bg-[var(--tmpl-bg)] p-8 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-[var(--tmpl-accent)]">
              {t("giftShipping")}
            </p>
            <p className="tmpl-body mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--tmpl-fg)]">
              {data.gift.shippingAddress}
            </p>
          </div>
        )}
      </TemplateSectionReveal>
    </section>
  );
}
