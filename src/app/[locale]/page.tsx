import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Car, Headphones, ShieldCheck } from "lucide-react";
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

const HIGHLIGHT_ICONS = {
  fleet: Car,
  drivers: ShieldCheck,
  support: Headphones,
} as const;

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
      {/* Asymmetric Split Hero + Floating Horizontal Quick Booking */}
      <section className="relative border-b border-[#E6EDF7] bg-white pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
        {/* Clipped background accents wrapper so popovers from HeroQuickBooking are never clipped */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(122deg,transparent_48%,#F2F6FD_48%)] opacity-85" />
          <div className="absolute -bottom-24 -left-24 h-[260px] w-[260px] rounded-full bg-[#FDE068]/90 sm:-bottom-20 sm:-left-16 sm:h-[310px] sm:w-[310px] lg:-bottom-16 lg:-left-12 lg:h-[330px] lg:w-[330px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left column: Display Title + Concise Subtitle + 3 Feature Trust Pills */}
            <div className="lg:col-span-6">
              <h1 className="font-display text-[30px] font-bold leading-[1.1] text-[#0D1E3B] sm:text-[40px] lg:text-[44px] xl:text-[48px]">
                {dict.hero.title}
              </h1>
              <p className="mt-5 max-w-[470px] text-[15px] leading-[1.6] text-[#475467] sm:text-[17px]">
                {dict.hero.subtitle}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {dict.hero.highlights.map((item) => {
                  const IconComponent = HIGHLIGHT_ICONS[item.id];
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-[20px] border border-[#E6EEF9] bg-[#F4F8FE] px-4 py-3"
                    >
                      <IconComponent
                        className="h-5 w-5 shrink-0 text-[#1E4A8F] sm:h-6 sm:w-6"
                        aria-hidden="true"
                      />
                      <span className="text-[13px] font-semibold leading-[1.25] text-[#0F1B2E]">
                        <span className="block">{item.line1}</span>
                        <span className="block">{item.line2}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column: Existing illustration framed with large curved left arch */}
            <div className="relative lg:col-span-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-3 -left-3 hidden h-28 w-28 rounded-full bg-[#DCE9FB]/80 sm:block"
              />
              <div className="relative overflow-hidden rounded-tl-[68px] rounded-bl-[68px] rounded-tr-[24px] rounded-br-[24px] bg-[#EEF4FC] shadow-[0_22px_54px_-24px_rgba(15,27,46,0.18)] sm:rounded-tl-[112px] sm:rounded-bl-[112px] sm:rounded-tr-[28px] sm:rounded-br-[28px]">
                <div className="relative aspect-[16/10] w-full lg:h-[360px] xl:h-[395px]">
                  <Image
                    src="/images/hero-voyage.webp"
                    alt={dict.hero.illustrationAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-[center_62%]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Horizontal Quick Booking Bar */}
          <div className="mt-8 lg:mt-10">
            <HeroQuickBooking locale={locale} dict={dict} />
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

