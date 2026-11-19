"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { POPULAR_CORRIDORS, type RouteCorridor } from "@/data/routes";
import { recommendVehicleClassForPassengers } from "@/data/fleet";
import { useBookingDraft } from "@/context/BookingDraftContext";

interface ServiceCorridorsListProps {
  locale: Locale;
  dict: Dictionary;
}

export function ServiceCorridorsList({
  locale,
  dict,
}: ServiceCorridorsListProps) {
  const router = useRouter();
  const { updateDraft } = useBookingDraft();

  function handleSelectCorridor(corridor: RouteCorridor) {
    const origin = locale === "uk" ? corridor.originUk : corridor.originEn;
    const destination =
      locale === "uk" ? corridor.destinationUk : corridor.destinationEn;
    const passengers = corridor.defaultTripType === "group" ? 12 : 2;
    updateDraft({
      tripType: corridor.defaultTripType,
      geography: corridor.geography,
      origin,
      destination,
      passengers,
      vehicleClass: recommendVehicleClassForPassengers(
        passengers,
        corridor.defaultTripType
      ),
    });
    router.push(`/${locale}/booking`);
  }

  return (
    <section className="border-t border-[#E4E6EC] bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-[#0F1B2E] sm:text-3xl">
            {dict.servicesPage.corridorsTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#475467]">
            {dict.servicesPage.corridorsLead}
          </p>
        </div>

        <div className="mt-8 divide-y divide-[#E4E6EC] border-y border-[#E4E6EC]">
          {POPULAR_CORRIDORS.map((corridor) => (
            <div
              key={corridor.id}
              className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-[#0F1B2E]">
                  {locale === "uk"
                    ? `${corridor.originUk} → ${corridor.destinationUk}`
                    : `${corridor.originEn} → ${corridor.destinationEn}`}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#EBF1FA] px-2.5 py-0.5 text-xs font-semibold text-[#24508F]">
                    {dict.quickBooking.geographies[corridor.geography]}
                  </span>
                  <span className="text-xs text-[#667085]">
                    {locale === "uk" ? corridor.noteUk : corridor.noteEn}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectCorridor(corridor)}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 self-start rounded-xl border border-[#CBD2DF] bg-[#FAF9F6] px-4 text-sm font-semibold text-[#0F1B2E] transition-colors hover:border-[#24508F] hover:bg-[#EBF1FA] hover:text-[#24508F] sm:self-center"
              >
                <span>{dict.servicesPage.corridorAction}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-[#667085]">
          {dict.servicesPage.customRouteNote}
        </p>
      </div>
    </section>
  );
}

