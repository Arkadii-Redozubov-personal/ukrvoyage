import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { resolveLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildLocalePageMetadata } from "@/lib/seo";
import { BRAND_CHANNELS } from "@/data/contacts";
import { AboutOverview } from "@/components/AboutOverview";
import { ProcessSection } from "@/components/ProcessSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);
  return buildLocalePageMetadata(locale, "/about", dict.meta.about);
}

export default async function AboutPage({
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
                {dict.aboutPage.title}
              </h1>
              <p className="mt-3 max-w-[520px] text-[15px] leading-[1.55] text-[#475467] sm:text-base">
                {dict.aboutPage.lead}
              </p>
            </div>

            <div className="relative flex items-center justify-center lg:col-span-6 lg:justify-end">
              <Image
                src="/images/header-about-spot.webp"
                alt={dict.aboutPage.title}
                width={1030}
                height={613}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto max-h-[260px] w-full max-w-[540px] object-contain sm:max-h-[300px] lg:max-h-[325px] lg:max-w-[570px]"
              />
            </div>
          </div>
        </div>
      </section>

      <AboutOverview locale={locale} dict={dict} showReadMoreLink={false} />

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-[#C9D7ED] bg-[#EBF1FA] p-6 sm:p-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="font-display text-xl font-semibold text-[#0F1B2E] sm:text-2xl">
                {dict.aboutPage.botNoticeTitle}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#344054] sm:text-base">
                {dict.aboutPage.botNoticeBody}
              </p>
            </div>
            <a
              href={BRAND_CHANNELS.telegramBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-xl bg-[#24508F] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1B3E73] lg:self-center"
            >
              <span>{dict.aboutPage.botLinkLabel}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <ProcessSection dict={dict} />
    </>
  );
}

