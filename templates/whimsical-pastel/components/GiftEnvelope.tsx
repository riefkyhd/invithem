"use client";

import { CopyButton } from "@/components/ui/CopyButton";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GiftEnvelopeProps } from "@/lib/types/wedding-data";
import { SectionDivider } from "../assets/SectionDivider";
import { SectionTitle } from "../ui";
import { motion } from "../motion";

export function GiftEnvelope({ data }: GiftEnvelopeProps) {
  const { t } = useI18n();
  const accounts = data.gift.bankAccounts;
  if (accounts.length === 0 && !data.gift.shippingAddress?.trim()) return null;

  return (
    <section id="gift" className="px-5 py-16 md:px-8">
      <TemplateSectionReveal motion={motion}>
        <div className="wp-card mx-auto max-w-md border border-[rgba(79,100,78,0.08)] p-8">
          <SectionTitle>{t("gift")}</SectionTitle>
          <p className="tmpl-body mx-auto mt-4 max-w-sm text-center text-base leading-relaxed text-[var(--tmpl-muted)]">
            {t("giftDesc")}
          </p>

          <div className="mt-8 space-y-5">
            {accounts.map((account) => (
              <div
                key={`${account.bank}-${account.account_number}`}
                className="rounded-[1.5rem] border border-[rgba(79,100,78,0.08)] bg-white p-6 text-center shadow-sm"
              >
                <p className="text-sm text-[var(--tmpl-muted)]">{account.label || account.bank}</p>
                <p className="tmpl-display mt-3 text-2xl tracking-wide text-[var(--tmpl-fg)]">
                  {account.account_number}
                </p>
                <p className="tmpl-body mt-2 text-sm text-[var(--tmpl-muted)]">
                  {account.account_name}
                </p>
                <div className="mt-4 flex justify-center">
                  <CopyButton value={account.account_number} />
                </div>
              </div>
            ))}
          </div>

          {data.gift.shippingAddress?.trim() && (
            <div className="mt-5 rounded-[1.5rem] border border-[rgba(79,100,78,0.08)] bg-white p-6 text-center">
              <p className="text-sm font-medium text-[var(--tmpl-heading)]">{t("giftShipping")}</p>
              <p className="tmpl-body mt-2 whitespace-pre-line text-sm text-[var(--tmpl-muted)]">
                {data.gift.shippingAddress}
              </p>
            </div>
          )}
        </div>
      </TemplateSectionReveal>

      <TemplateSectionReveal motion={motion} delay={0.1} className="mt-10">
        <SectionDivider />
      </TemplateSectionReveal>
    </section>
  );
}
