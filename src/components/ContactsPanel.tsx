"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy, Mail, MessageSquare, Phone, Send } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { BRAND_CHANNELS, BRAND_PHONES } from "@/data/contacts";

interface ContactsPanelProps {
  locale: Locale;
  dict: Dictionary;
}

export function ContactsPanel({ locale, dict }: ContactsPanelProps) {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  function handleCopy(value: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
      setCopiedPhone(value);
      setTimeout(() => setCopiedPhone(null), 2000);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Phones Column */}
      <div className="rounded-2xl border border-[#E4E6EC] bg-white p-6 sm:p-8 lg:col-span-6">
        <h2 className="font-display text-lg font-semibold text-[#0F1B2E] sm:text-xl">
          {dict.contactsPage.phonesHeading}
        </h2>

        <div className="mt-5 divide-y divide-[#E4E6EC] border-y border-[#E4E6EC]">
          {BRAND_PHONES.map((phone) => {
            const isCopied = copiedPhone === phone.display;
            return (
              <div
                key={phone.href}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <a
                  href={phone.href}
                  className="inline-flex items-center gap-3 text-base font-semibold text-[#101828] transition-colors hover:text-[#24508F] sm:text-lg"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF1FA] text-[#24508F]">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block tabular-nums">{phone.display}</span>
                    <span className="block text-xs font-medium text-[#667085]">
                      {phone.operatorLabel}
                    </span>
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(phone.display)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E4E6EC] bg-[#FAF9F6] px-3 text-xs font-semibold text-[#475467] transition-colors hover:border-[#24508F] hover:text-[#24508F]"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#127A4D]" aria-hidden="true" />
                      <span className="text-[#127A4D]">
                        {dict.contactsPage.copiedPhone}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{dict.contactsPage.copyPhone}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Demo email */}
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#F1F3F7] p-4 text-sm">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#24508F]" aria-hidden="true" />
          <div>
            <p className="text-xs font-medium text-[#667085]">
              {dict.contactsPage.emailLabel}
            </p>
            <a
              href={`mailto:${BRAND_CHANNELS.demoEmail}`}
              className="mt-0.5 block font-semibold text-[#101828] hover:text-[#24508F]"
            >
              {BRAND_CHANNELS.demoEmail}
            </a>
            <p className="mt-1 text-xs text-[#667085]">
              {dict.contactsPage.emailDemoNote}
            </p>
          </div>
        </div>
      </div>

      {/* Messengers + Dispatch Note Column */}
      <div className="flex flex-col justify-between gap-6 lg:col-span-6">
        <div className="rounded-2xl border border-[#E4E6EC] bg-white p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-[#0F1B2E] sm:text-xl">
            {dict.contactsPage.messengersHeading}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <a
              href={BRAND_CHANNELS.telegramBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[54px] items-center justify-between rounded-xl border border-[#C9D7ED] bg-[#EBF1FA] px-4 py-3 text-sm font-semibold text-[#24508F] transition-colors hover:bg-[#DCE7F7]"
            >
              <span className="inline-flex items-center gap-2">
                <Send className="h-4 w-4" aria-hidden="true" />
                Telegram
              </span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={BRAND_CHANNELS.viberUrl}
              className="flex min-h-[54px] items-center justify-between rounded-xl border border-[#E4E6EC] bg-[#FAF9F6] px-4 py-3 text-sm font-semibold text-[#101828] transition-colors hover:border-[#24508F]"
            >
              <span className="inline-flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#24508F]" aria-hidden="true" />
                Viber
              </span>
              <ArrowUpRight className="h-4 w-4 text-[#667085]" aria-hidden="true" />
            </a>
            <a
              href={BRAND_CHANNELS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[54px] items-center justify-between rounded-xl border border-[#E4E6EC] bg-[#FAF9F6] px-4 py-3 text-sm font-semibold text-[#101828] transition-colors hover:border-[#24508F]"
            >
              <span className="inline-flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#24508F]" aria-hidden="true" />
                WhatsApp
              </span>
              <ArrowUpRight className="h-4 w-4 text-[#667085]" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="rounded-2xl bg-[#0F1B2E] p-6 text-[#F8FAFC] sm:p-8">
          <h2 className="font-display text-lg font-semibold text-white sm:text-xl">
            {dict.contactsPage.dispatchHeading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#A8B7CE]">
            {dict.contactsPage.dispatchBody}
          </p>
          <div className="mt-6">
            <Link
              href={`/${locale}/booking`}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#F2CE24] px-5 text-sm font-semibold text-[#0F1B2E] transition-colors hover:bg-[#F7DA4C]"
            >
              <span>{dict.contactsPage.goToBookingCta}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

