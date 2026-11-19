import React from "react";
import type { Metadata } from "next";
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
      <section className="border-b border-[#E4E6EC] bg-[#FAF9F6] py-12 sm:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <h1 className="font-display max-w-3xl text-3xl font-semibold text-[#0F1B2E] sm:text-5xl">
            {dict.aboutPage.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475467] sm:text-lg">
            {dict.aboutPage.lead}
          </p>
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

