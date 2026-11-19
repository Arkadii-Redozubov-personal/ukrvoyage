"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Briefcase, Check, Info, Users } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  FLEET_CATEGORIES,
  type TripCategoryFilter,
  type VehicleClassId,
} from "@/data/fleet";
import { useBookingDraft } from "@/context/BookingDraftContext";
import { VehicleSilhouetteSvg } from "./VehicleSilhouetteSvg";

interface FleetShowcaseProps {
  locale: Locale;
  dict: Dictionary;
  showFullPageLink?: boolean;
}

type FilterOption = "all" | TripCategoryFilter;

export function FleetShowcase({
  locale,
  dict,
  showFullPageLink = true,
}: FleetShowcaseProps) {
  const router = useRouter();
  const { updateDraft } = useBookingDraft();
  const [filter, setFilter] = useState<FilterOption>("all");
  const [activeId, setActiveId] = useState<VehicleClassId>("comfort-sedan");

  const visibleCategories = useMemo(() => {
    if (filter === "all") return FLEET_CATEGORIES;
    return FLEET_CATEGORIES.filter(
      (cat) => cat.tripCategory === filter || cat.tripCategory === "both"
    );
  }, [filter]);

  function handleSelectAndBook(id: VehicleClassId) {
    const category = FLEET_CATEGORIES.find((c) => c.id === id);
    if (!category) return;
    const isGroup = id === "minibus" || id === "coach";
    const passengers = isGroup ? Math.max(8, category.minPassengers) : 2;
    updateDraft({
      vehicleClass: id,
      tripType: isGroup ? "group" : "individual",
      passengers,
      luggage: Math.min(passengers, category.maxLuggage),
    });
    router.push(`/${locale}/booking`);
  }

  return (
    <section
      id="fleet"
      className="bg-[#0F1B2E] py-16 text-[#F8FAFC] sm:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-white sm:text-4xl">
              {dict.fleetSection.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#A8B7CE]">
              {dict.fleetSection.lead}
            </p>
          </div>

          <div
            role="group"
            aria-label={dict.fleetSection.title}
            className="inline-flex self-start rounded-xl border border-[#253652] bg-[#162640] p-1"
          >
            {(["all", "individual", "group"] as FilterOption[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`min-h-[40px] rounded-lg px-4 text-xs font-semibold transition-colors sm:text-sm ${
                  filter === key
                    ? "bg-[#F2CE24] text-[#0F1B2E]"
                    : "text-[#A8B7CE] hover:text-white"
                }`}
              >
                {dict.fleetSection.filters[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Honest dynamic-fleet disclaimer */}
        <div className="mt-7 flex items-start gap-3 rounded-xl border border-[#253652] bg-[#162640]/80 px-4 py-3 text-xs text-[#C7D4E7] sm:text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#F2CE24]" aria-hidden="true" />
          <p>{dict.fleetSection.disclaimer}</p>
        </div>

        {/* Cabvia-inspired editorial stacked horizontal rows with active/hover ivory inversion */}
        <div className="mt-8 divide-y divide-[#253652] border-y border-[#253652]">
          {visibleCategories.map((item) => {
            const copy = dict.fleetSection.classes[item.id];
            const isActive = activeId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveId(item.id)}
                className={`group transition-colors duration-200 ${
                  isActive
                    ? "bg-[#F7F3E3] text-[#0F1B2E]"
                    : "bg-[#0F1B2E] text-[#F8FAFC] hover:bg-[#162640]"
                }`}
              >
                <div className="grid grid-cols-1 items-center gap-6 px-4 py-7 sm:px-7 lg:grid-cols-12 lg:gap-8 lg:py-9">
                  {/* Left column: class title & copy */}
                  <div className="lg:col-span-6">
                    <button
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      aria-expanded={isActive}
                      className="text-left focus-visible:outline-2"
                    >
                      <h3 className="font-display text-xl font-semibold sm:text-2xl">
                        {copy.name}
                      </h3>
                    </button>

                    <p
                      className={`mt-2 text-sm leading-relaxed sm:text-[15px] ${
                        isActive ? "text-[#344054]" : "text-[#A8B7CE]"
                      }`}
                    >
                      {copy.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium sm:text-sm">
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <Users
                          className={`h-4 w-4 ${
                            isActive ? "text-[#24508F]" : "text-[#F2CE24]"
                          }`}
                          aria-hidden="true"
                        />
                        {copy.passengerLabel}
                      </span>
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <Briefcase
                          className={`h-4 w-4 ${
                            isActive ? "text-[#24508F]" : "text-[#F2CE24]"
                          }`}
                          aria-hidden="true"
                        />
                        {copy.luggageLabel}
                      </span>
                    </div>

                    {isActive ? (
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        {copy.features.map((feat) => (
                          <span
                            key={feat}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8D0B4] bg-white/80 px-2.5 py-1 text-xs font-medium text-[#101828]"
                          >
                            <Check className="h-3.5 w-3.5 text-[#24508F]" aria-hidden="true" />
                            {feat}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {isActive ? (
                        <button
                          type="button"
                          onClick={() => handleSelectAndBook(item.id)}
                          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#24508F] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1B3E73]"
                        >
                          <span>{dict.fleetSection.bookThisClassCta}</span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveId(item.id)}
                          className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-[#F2CE24] hover:underline"
                        >
                          <span>{dict.fleetSection.selectCta}</span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right column: crisp vector profile at rest -> bespoke cartoon illustration on hover/selection */}
                  <div className="flex items-center justify-center lg:col-span-6 lg:justify-end">
                    {isActive ? (
                      <div className="relative w-full max-w-[440px]">
                        <Image
                          src={item.imagePath}
                          alt={copy.name}
                          width={1200}
                          height={670}
                          className="h-auto w-full object-contain mix-blend-multiply"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveId(item.id)}
                        aria-label={`${dict.fleetSection.selectCta}: ${copy.name}`}
                        className="flex w-full max-w-[340px] items-center justify-center py-4 text-[#A8B7CE] transition-colors hover:text-[#F2CE24]"
                      >
                        <VehicleSilhouetteSvg
                          classId={item.id}
                          className="h-24 w-full sm:h-28"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showFullPageLink ? (
          <div className="mt-8 flex justify-end">
            <Link
              href={`/${locale}/fleet`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#F2CE24] transition-colors hover:text-white"
            >
              <span>{dict.fleetSection.fullCatalogCta}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

