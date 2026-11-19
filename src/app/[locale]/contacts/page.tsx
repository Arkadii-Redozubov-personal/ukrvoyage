import React from "react";
import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildLocalePageMetadata } from "@/lib/seo";
import { ContactsPanel } from "@/components/ContactsPanel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);
  return buildLocalePageMetadata(locale, "/contacts", dict.meta.contacts);
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h1 className="font-display text-[26px] font-bold leading-[1.12] text-[#0D1E3B] sm:text-[36px] lg:text-[40px]">
            {dict.contactsPage.title}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#475467] sm:text-base">
            {dict.contactsPage.lead}
          </p>
        </div>

        <ContactsPanel locale={locale} dict={dict} />
      </div>
    </section>
  );
}

