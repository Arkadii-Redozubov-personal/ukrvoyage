import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resolveLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildLocalePageMetadata } from "@/lib/seo";
import { FLEET_CATEGORIES } from "@/data/fleet";
import { FleetShowcase } from "@/components/FleetShowcase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);
  return buildLocalePageMetadata(locale, "/fleet", dict.meta.fleet);
}

export default async function FleetPage({
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
                {dict.fleetPage.title}
              </h1>
              <p className="mt-3 max-w-[520px] text-[15px] leading-[1.55] text-[#475467] sm:text-base">
                {dict.fleetPage.lead}
              </p>
            </div>

            <div className="relative flex items-center justify-center lg:col-span-6 lg:justify-end">
              <Image
                src="/images/header-fleet-spot.webp"
                alt={dict.fleetPage.title}
                width={1039}
                height={692}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto max-h-[260px] w-full max-w-[540px] object-contain sm:max-h-[300px] lg:max-h-[325px] lg:max-w-[570px]"
              />
            </div>
          </div>
        </div>
      </section>

      <FleetShowcase locale={locale} dict={dict} showFullPageLink={false} />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-[#0F1B2E] sm:text-3xl">
            {dict.fleetPage.tableTitle}
          </h2>

          {/* Mobile stacked comparison cards (prevents clipped horizontal scroll at 360-390px) */}
          <div className="mt-6 space-y-3 md:hidden">
            {FLEET_CATEGORIES.map((item) => {
              const copy = dict.fleetSection.classes[item.id];
              const isGroup = item.id === "minibus" || item.id === "coach";
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#E4E6EC] bg-[#FAF9F6] p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-[#0F1B2E]">
                      {copy.name}
                    </h3>
                    <span className="rounded-full bg-[#EBF1FA] px-2.5 py-0.5 text-[11px] font-semibold text-[#24508F]">
                      {copy.tripScopeLabel}
                    </span>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-[#E4E6EC] pt-3 text-xs">
                    <div>
                      <dt className="text-[#667085]">
                        {dict.fleetPage.tableHeaders.passengers}
                      </dt>
                      <dd className="mt-0.5 tabular-nums font-semibold text-[#101828]">
                        {copy.passengerLabel}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#667085]">
                        {dict.fleetPage.tableHeaders.luggage}
                      </dt>
                      <dd className="mt-0.5 tabular-nums font-semibold text-[#101828]">
                        {copy.luggageLabel}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-3">
                    <Link
                      href={`/${locale}/booking?class=${item.id}&type=${
                        isGroup ? "group" : "individual"
                      }`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#24508F]"
                    >
                      <span>{dict.fleetSection.bookThisClassCta}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-[#E4E6EC] md:block">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#E4E6EC] bg-[#F1F3F7] text-xs font-semibold uppercase tracking-wider text-[#475467]">
                  <th className="px-5 py-4">{dict.fleetPage.tableHeaders.category}</th>
                  <th className="px-5 py-4">{dict.fleetPage.tableHeaders.passengers}</th>
                  <th className="px-5 py-4">{dict.fleetPage.tableHeaders.luggage}</th>
                  <th className="px-5 py-4">{dict.fleetPage.tableHeaders.format}</th>
                  <th className="px-5 py-4 text-right">{dict.fleetPage.tableHeaders.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E6EC]">
                {FLEET_CATEGORIES.map((item) => {
                  const copy = dict.fleetSection.classes[item.id];
                  const isGroup = item.id === "minibus" || item.id === "coach";
                  return (
                    <tr key={item.id} className="hover:bg-[#FAF9F6]">
                      <td className="px-5 py-4 font-semibold text-[#0F1B2E]">
                        {copy.name}
                      </td>
                      <td className="px-5 py-4 tabular-nums text-[#344054]">
                        {copy.passengerLabel}
                      </td>
                      <td className="px-5 py-4 tabular-nums text-[#344054]">
                        {copy.luggageLabel}
                      </td>
                      <td className="px-5 py-4 text-[#475467]">
                        {copy.tripScopeLabel}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/${locale}/booking?class=${item.id}&type=${
                            isGroup ? "group" : "individual"
                          }`}
                          className="inline-flex items-center gap-1 font-semibold text-[#24508F] hover:text-[#1B3E73]"
                        >
                          <span>{dict.fleetSection.bookThisClassCta}</span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

