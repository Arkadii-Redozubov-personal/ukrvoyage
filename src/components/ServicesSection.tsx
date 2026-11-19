"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { GeographyType, TripType } from "@/data/routes";
import { recommendVehicleClassForPassengers } from "@/data/fleet";
import { useBookingDraft } from "@/context/BookingDraftContext";

interface ServicesSectionProps {
  locale: Locale;
  dict: Dictionary;
  showViewAllLink?: boolean;
}

export function ServicesSection({
  locale,
  dict,
  showViewAllLink = true,
}: ServicesSectionProps) {
  const router = useRouter();
  const { updateDraft } = useBookingDraft();

  function startBookingWith(tripType: TripType, geography?: GeographyType) {
    const passengers = tripType === "group" ? 12 : 2;
    updateDraft({
      tripType,
      ...(geography ? { geography } : {}),
      passengers,
      vehicleClass: recommendVehicleClassForPassengers(passengers, tripType),
    });
    router.push(`/${locale}/booking`);
  }

  const geoKeys: GeographyType[] = ["city", "ukraine", "international"];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-[#0F1B2E] sm:text-4xl">
              {dict.servicesSection.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#475467]">
              {dict.servicesSection.lead}
            </p>
          </div>
          {showViewAllLink ? (
            <Link
              href={`/${locale}/services`}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#24508F] transition-colors hover:text-[#1B3E73]"
            >
              <span>{dict.servicesSection.viewAllCta}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>

        {/* Asymmetric 2-surface comparison: crisp white individual vs deep slate-blue group */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <article className="flex flex-col justify-between rounded-2xl border border-[#E4E6EC] bg-white p-7 sm:p-9 lg:col-span-7">
            <div>
              <h3 className="font-display text-2xl font-semibold text-[#0F1B2E]">
                {dict.servicesSection.individual.title}
              </h3>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-[#475467]">
                {dict.servicesSection.individual.description}
              </p>

              <ul className="mt-6 space-y-3 border-t border-[#E4E6EC] pt-6">
                {dict.servicesSection.individual.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-[#101828]"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#24508F]"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => startBookingWith("individual")}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#24508F] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1B3E73]"
              >
                <span>{dict.servicesSection.individual.cta}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="text-xs font-medium text-[#667085]">
                {dict.servicesSection.individual.badge}
              </span>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-2xl bg-[#162640] p-7 text-[#F8FAFC] sm:p-9 lg:col-span-5">
            <div>
              <h3 className="font-display text-2xl font-semibold text-white">
                {dict.servicesSection.group.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[#C7D4E7]">
                {dict.servicesSection.group.description}
              </p>

              <ul className="mt-6 space-y-3 border-t border-[#253652] pt-6">
                {dict.servicesSection.group.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-[#E2E8F0]"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#F2CE24]"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => startBookingWith("group", "international")}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#F2CE24] px-5 text-sm font-semibold text-[#0F1B2E] transition-colors hover:bg-[#F7DA4C]"
              >
                <span>{dict.servicesSection.group.cta}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="text-xs font-medium text-[#A8B7CE]">
                {dict.servicesSection.group.badge}
              </span>
            </div>
          </article>
        </div>

        {/* Hairline 3-column geography directory (Lenox editorial clarity) */}
        <div className="mt-14 border-t border-[#E4E6EC] pt-10">
          <h3 className="font-display text-lg font-semibold text-[#0F1B2E] sm:text-xl">
            {dict.servicesSection.geographiesTitle}
          </h3>
          <div className="mt-6 grid grid-cols-1 divide-y divide-[#E4E6EC] border-y border-[#E4E6EC] md:grid-cols-3 md:divide-x md:divide-y-0">
            {geoKeys.map((geo) => {
              const g = dict.servicesSection.geographies[geo];
              return (
                <div
                  key={geo}
                  className="flex flex-col justify-between py-6 md:px-6 md:first:pl-0 md:last:pr-0"
                >
                  <div>
                    <h4 className="text-lg font-semibold text-[#0F1B2E]">
                      {g.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-[#475467]">
                      {g.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#24508F]">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{g.examples}</span>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => startBookingWith("individual", geo)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F1B2E] transition-colors hover:text-[#24508F]"
                    >
                      <span>{g.cta}</span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

