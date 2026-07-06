"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TemplateSectionReveal } from "@/lib/invitation/template-section-reveal";
import type { GiftEnvelopeProps } from "@/lib/types/wedding-data";
import { ReferenceOutlineButton, SectionHeading } from "../ui";
import { motion } from "../motion";

export function GiftEnvelope({ data }: GiftEnvelopeProps) {
  const { t } = useI18n();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function copyNumber(accountNumber: string, key: string) {
    await navigator.clipboard.writeText(accountNumber.replace(/\s/g, ""));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  return (
    <section id="gift" className="px-6 py-16">
      <TemplateSectionReveal motion={motion}>
        <SectionHeading title={t("gift")} subtitle={t("giftDesc")} className="mb-10" />
      </TemplateSectionReveal>

      <div className="mx-auto flex max-w-md flex-col gap-6">
        {data.gift.bankAccounts.map((account) => {
          const key = `${account.bank}-${account.account_number}`;
          return (
            <TemplateSectionReveal key={key} motion={motion}>
              <div className="rounded-xl border border-[var(--tmpl-card-border)] bg-white p-6 text-center shadow-sm">
                <p className="text-sm font-medium text-[var(--tmpl-muted)]">
                  {account.bank}
                </p>
                <p className="mt-2 text-sm text-[var(--tmpl-muted)]">
                  {t("accountNumber")}
                </p>
                <p className="mt-1 text-xl font-semibold tracking-widest text-[var(--tmpl-heading)]">
                  {account.account_number}
                </p>
                <p className="mt-2 text-sm text-[var(--tmpl-heading)]">
                  a.n {account.account_name}
                </p>
                <div className="mt-4 flex justify-center">
                  <ReferenceOutlineButton
                    type="button"
                    onClick={() => copyNumber(account.account_number, key)}
                  >
                    {copiedKey === key ? t("copied") : t("copyAccountNumber")}
                  </ReferenceOutlineButton>
                </div>
              </div>
            </TemplateSectionReveal>
          );
        })}
      </div>

      {data.gift.shippingAddress?.trim() && (
        <TemplateSectionReveal motion={motion} className="mt-8" delay={0.2}>
          <div className="mx-auto max-w-md rounded-xl border border-[var(--tmpl-card-border)] bg-white p-6 text-center">
            <p className="text-sm text-[var(--tmpl-muted)]">{t("giftShipping")}</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--tmpl-heading)]">
              {data.gift.shippingAddress}
            </p>
          </div>
        </TemplateSectionReveal>
      )}
    </section>
  );
}
