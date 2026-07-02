"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { CopyButton } from "@/components/ui/CopyButton";
import { useI18n } from "@/lib/i18n/context";
import type { BankAccount } from "@/lib/types/database";

interface GiftEnvelopeProps {
  accounts: BankAccount[];
}

export function GiftEnvelope({ accounts }: GiftEnvelopeProps) {
  const { t } = useI18n();

  return (
    <section id="gift" className="px-6 py-20 md:px-12 lg:px-24">
      <SectionReveal>
        <h2 className="font-display mb-4 text-4xl md:text-5xl">{t("gift")}</h2>
        <p className="mb-10 max-w-xl text-muted">{t("giftDesc")}</p>

        <div className="mx-auto grid max-w-3xl gap-6">
          {accounts.map((account) => (
            <div
              key={`${account.bank}-${account.account_number}`}
              className="rounded-2xl border border-card-border bg-card p-8"
            >
              <p className="text-xs uppercase tracking-wider text-muted">
                {account.label}
              </p>
              <p className="mt-2 font-medium">{account.bank}</p>
              <p className="font-display mt-4 text-2xl tracking-wider">
                {account.account_number}
              </p>
              <p className="mt-2 text-sm text-muted">{account.account_name}</p>
              <div className="mt-6">
                <CopyButton value={account.account_number} />
              </div>
            </div>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
