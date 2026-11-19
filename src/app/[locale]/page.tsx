import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Check, Info } from "lucide-react";
import { resolveLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildLocalePageMetadata } from "@/lib/seo";
import { HeroQuickBooking } from "@/components/HeroQuickBooking";
import { ServicesSection } from "@/components/ServicesSection";
import { FleetShowcase } from "@/components/FleetShowcase";
import { ProcessSection } from "@/components/ProcessSection";
import { AboutOverview } from "@/components/AboutOverview";
import { FaqAccordion } from "@/components/FaqAccordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);
  return buildLocalePageMetadata(locale, "", dict.meta.home);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);

  return (
    <>
      {/* Editorial Asymmetric Hero + Live Quick Booking */}
      <section className="border-b border-[#E4E6EC] bg-[#FAF9F6] pb-14 pt-8 sm:pb-20 sm:pt-12 lg:pt-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left column: Headline + Quick Booking */}
            <div className="lg:col-span-6">
              <h1 className="font-display text-3xl font-semibold leading-[1.12] text-[#0F1B2E] sm:text-[42px] lg:text-[44px]">
                {dict.hero.title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#475467]">
                {dict.hero.subtitle}
              </p>

              <div className="mt-7">
                <HeroQuickBooking locale={locale} dict={dict} />
              </div>
            </div>

            {/* Right column: Bespoke Cartoon Travel Scene + Operator Clarity */}
            <div className="lg:col-span-6 lg:pt-2">
              <div className="overflow-hidden rounded-[24px] border border-[#E4E6EC] bg-white shadow-[0_18px_46px_-24px_rgba(15,27,46,0.18)]">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FAF9F6]">
                  <Image
                    src="/images/hero-voyage.webp"
                    alt={dict.hero.illustrationAlt}
                    width={1440}
                    height={804}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E4E6EC] bg-white px-5 py-3.5 text-xs text-[#475467]">
                  <span className="font-semibold text-[#0F1B2E]">
                    {dict.hero.illustrationCaption}
                  </span>
                  <span className="rounded-full bg-[#FDF6D3] px-2.5 py-0.5 font-semibold text-[#0F1B2E]">
                    {dict.brand.slogan}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2.5 rounded-2xl border border-[#E4E6EC] bg-white p-4 text-xs leading-relaxed text-[#344054]">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#24508F]"
                    aria-hidden="true"
                  />
                  <span>{dict.hero.operatorQuoteNote}</span>
                </div>
                <div className="flex items-start gap-2.5 rounded-2xl border border-[#E4E6EC] bg-white p-4 text-xs leading-relaxed text-[#344054]">
                  <Info
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#24508F]"
                    aria-hidden="true"
                  />
                  <span>{dict.hero.fleetDisclaimerNote}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection locale={locale} dict={dict} />
      <FleetShowcase locale={locale} dict={dict} />
      <ProcessSection dict={dict} />
      <AboutOverview locale={locale} dict={dict} />
      <FaqAccordion dict={dict} />
    </>
  );
}

