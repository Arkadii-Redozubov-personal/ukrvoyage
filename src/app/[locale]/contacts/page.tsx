import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
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
    <>
      <section className="relative border-b border-[#E6EDF7] bg-white py-5 sm:py-7 lg:py-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -bottom-32 -left-24 h-[210px] w-[210px] rounded-full bg-[#FDE068]/85 sm:h-[240px] sm:w-[240px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <h1 className="font-display text-[26px] font-bold leading-[1.12] text-[#0D1E3B] sm:text-[34px] lg:text-[38px]">
                {dict.contactsPage.title}
              </h1>
              <p className="mt-3 max-w-[520px] text-[15px] leading-[1.55] text-[#475467] sm:text-base">
                {dict.contactsPage.lead}
              </p>
            </div>

            <div className="relative flex items-center justify-center lg:col-span-6 lg:justify-end">
              <Image
                src="/images/header-contacts-spot.webp"
                alt={dict.contactsPage.title}
                width={1120}
                height={700}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto max-h-[260px] w-full max-w-[540px] object-contain sm:max-h-[300px] lg:max-h-[325px] lg:max-w-[570px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <ContactsPanel locale={locale} dict={dict} />
        </div>
      </section>
    </>
  );
}

