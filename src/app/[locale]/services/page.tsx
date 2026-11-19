import React from "react";
import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildLocalePageMetadata } from "@/lib/seo";
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
      <section className="border-b border-[#E4E6EC] bg-[#FAF9F6] py-12 sm:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <h1 className="font-display max-w-3xl text-3xl font-semibold text-[#0F1B2E] sm:text-5xl">
            {dict.servicesPage.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475467] sm:text-lg">
            {dict.servicesPage.lead}
          </p>
        </div>
      </section>

      <ServicesSection locale={locale} dict={dict} showViewAllLink={false} />
      <ServiceCorridorsList locale={locale} dict={dict} />
      <ProcessSection dict={dict} />
    </>
  );
}

