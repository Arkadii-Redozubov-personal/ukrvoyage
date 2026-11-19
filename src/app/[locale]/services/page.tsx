import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { resolveLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildLocalePageMetadata } from "@/lib/seo";
import type { GeographyType } from "@/data/routes";
import { ServicesSection } from "@/components/ServicesSection";
import { ServiceCorridorsList } from "@/components/ServiceCorridorsList";
import { ProcessSection } from "@/components/ProcessSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);
  return buildLocalePageMetadata(locale, "/services", dict.meta.services);
}

const GEO_KEYS: GeographyType[] = ["city", "ukraine", "international"];

export default async function ServicesPage({
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
                {dict.servicesPage.title}
              </h1>
              <p className="mt-3 max-w-[520px] text-[15px] leading-[1.55] text-[#475467] sm:text-base">
                {dict.servicesPage.lead}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {GEO_KEYS.map((geo) => (
                  <Link
                    key={geo}
                    href={`/${locale}/booking?geo=${geo}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD7E8] bg-white px-4 py-2 text-xs font-semibold text-[#1D3557] transition-colors hover:border-[#24508F] hover:bg-[#F4F8FE] hover:text-[#1E4A8F] sm:text-[13px]"
                  >
                    <MapPin
                      className="h-3.5 w-3.5 shrink-0 text-[#1E4A8F]"
                      aria-hidden="true"
                    />
                    <span>{dict.quickBooking.geographies[geo]}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Frameless transparent illustration integrated directly on the white canvas */}
            <div className="relative flex items-center justify-center lg:col-span-6 lg:justify-end">
              <Image
                src="/images/services-frameless-v2.webp"
                alt={dict.servicesPage.title}
                width={1240}
                height={740}
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-auto max-h-[220px] w-full max-w-[460px] object-contain sm:max-h-[250px] lg:max-h-[270px]"
              />
            </div>
          </div>
        </div>
      </section>

      <ServicesSection locale={locale} dict={dict} showViewAllLink={false} />
      <ServiceCorridorsList locale={locale} dict={dict} />
      <ProcessSection dict={dict} />
    </>
  );
}

