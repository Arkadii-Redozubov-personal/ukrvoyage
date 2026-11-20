"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const rowRefs = useRef<Partial<Record<VehicleClassId, HTMLDivElement | null>>>(
    {}
  );
  const manualTapPausedRef = useRef<boolean>(false);
  const manualTapTimerRef = useRef<number | null>(null);

  const visibleCategories = useMemo(() => {
    if (filter === "all") return FLEET_CATEGORIES;
    return FLEET_CATEGORIES.filter(
      (cat) => cat.tripCategory === filter || cat.tripCategory === "both"
    );
  }, [filter]);

  // Keep activeId valid when filter changes
  const effectiveActiveId: VehicleClassId = useMemo(() => {
    if (visibleCategories.some((c) => c.id === activeId)) {
      return activeId;
    }
    return visibleCategories[0]?.id ?? "comfort-sedan";
  }, [activeId, visibleCategories]);

  // Mobile / touch scroll-driven auto-hover: activates the vehicle row closest to the viewport center as the user scrolls
  useEffect(() => {
    let rafId: number | null = null;

    function updateActiveRowFromScroll() {
      rafId = null;
      if (typeof window === "undefined") return;

      const isMobileOrTouch = window.matchMedia(
        "(max-width: 1023px), (hover: none)"
      ).matches;
      if (!isMobileOrTouch) return;

      if (manualTapPausedRef.current) return;

      const viewportFocusY = window.innerHeight * 0.45;
      let closestId: VehicleClassId | null = null;
      let smallestDistance = Number.POSITIVE_INFINITY;

      for (const item of visibleCategories) {
        const el = rowRefs.current[item.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Only consider rows that are at least partially within the viewport
        if (rect.bottom < 80 || rect.top > window.innerHeight - 60) {
          continue;
        }
        const rowCenterY = (rect.top + rect.bottom) / 2;
        const dist = Math.abs(rowCenterY - viewportFocusY);
        if (dist < smallestDistance) {
          smallestDistance = dist;
          closestId = item.id;
        }
      }

      if (closestId) {
        setActiveId((prev) => (prev === closestId ? prev : closestId));
      }
    }

    function onScrollOrResize() {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateActiveRowFromScroll);
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    onScrollOrResize();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [visibleCategories]);

  function handleManualSelect(id: VehicleClassId) {
    manualTapPausedRef.current = true;
    if (manualTapTimerRef.current !== null && typeof window !== "undefined") {
      window.clearTimeout(manualTapTimerRef.current);
    }
    if (typeof window !== "undefined") {
      manualTapTimerRef.current = window.setTimeout(() => {
        manualTapPausedRef.current = false;
      }, 750);
    }
    setActiveId(id);
  }

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
          <Info
            className="mt-0.5 h-4 w-4 shrink-0 text-[#F2CE24]"
            aria-hidden="true"
          />
          <p>{dict.fleetSection.disclaimer}</p>
        </div>

        {/* Cabvia-inspired editorial stacked horizontal rows with desktop hover & mobile scroll auto-hover */}
        <div className="mt-8 divide-y divide-[#253652] border-y border-[#253652]">
          {visibleCategories.map((item) => {
            const copy = dict.fleetSection.classes[item.id];
            const isActive = effectiveActiveId === item.id;

            return (
              <div
                key={item.id}
                ref={(el) => {
                  rowRefs.current[item.id] = el;
                }}
                onMouseEnter={() => setActiveId(item.id)}
                className={`group transition-colors duration-300 ${
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
                      onClick={() => handleManualSelect(item.id)}
                      aria-expanded={isActive}
                      className="text-left focus-visible:outline-2"
                    >
                      <h3 className="font-display text-xl font-semibold sm:text-2xl">
                        {copy.name}
                      </h3>
                    </button>

                    <p
                      className={`mt-2 text-sm leading-relaxed transition-colors duration-300 sm:text-[15px] ${
                        isActive ? "text-[#344054]" : "text-[#A8B7CE]"
                      }`}
                    >
                      {copy.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium sm:text-sm">
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <Users
                          className={`h-4 w-4 transition-colors duration-300 ${
                            isActive ? "text-[#24508F]" : "text-[#F2CE24]"
                          }`}
                          aria-hidden="true"
                        />
                        {copy.passengerLabel}
                      </span>
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <Briefcase
                          className={`h-4 w-4 transition-colors duration-300 ${
                            isActive ? "text-[#24508F]" : "text-[#F2CE24]"
                          }`}
                          aria-hidden="true"
                        />
                        {copy.luggageLabel}
                      </span>
                    </div>

                    {/* Features stay mounted so row height never jumps during mobile scroll auto-hover */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {copy.features.map((feat) => (
                        <span
                          key={feat}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors duration-300 ${
                            isActive
                              ? "border-[#D8D0B4] bg-white/85 text-[#101828]"
                              : "border-[#253652] bg-[#162640]/75 text-[#C7D4E7]"
                          }`}
                        >
                          <Check
                            className={`h-3.5 w-3.5 transition-colors duration-300 ${
                              isActive ? "text-[#24508F]" : "text-[#F2CE24]"
                            }`}
                            aria-hidden="true"
                          />
                          {feat}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex min-h-[44px] flex-wrap items-center gap-3">
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
                          onClick={() => handleManualSelect(item.id)}
                          className="inline-flex h-11 items-center gap-1.5 text-sm font-semibold text-[#F2CE24] hover:underline"
                        >
                          <span>{dict.fleetSection.selectCta}</span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right column: constant-height visual stage that smoothly crossfades silhouette -> full cartoon vehicle */}
                  <div className="flex items-center justify-center lg:col-span-6 lg:justify-end">
                    <div
                      onClick={() => {
                        if (!isActive) handleManualSelect(item.id);
                      }}
                      className="relative flex h-[185px] w-full max-w-[440px] cursor-pointer items-center justify-center sm:h-[220px]"
                    >
                      {/* Full cartoon illustration (visible when active) */}
                      <div
                        className={` absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "scale-100 opacity-100"
                            : "pointer-events-none scale-95 opacity-0"
                        }`}
                      >
                        <Image
                          src={item.imagePath}
                          alt={copy.name}
                          width={640}
                          height={360}
                          loading="eager"
                          sizes="(max-width: 640px) 320px, 440px"
                          className="h-full max-h-[180px] w-full object-contain mix-blend-multiply sm:max-h-[215px]"
                        />
                      </div>

                      {/* Vector contour silhouette (visible when inactive) */}
                      <div
                        className={`flex w-full max-w-[340px] items-center justify-center text-[#A8B7CE] transition-all duration-300 hover:text-[#F2CE24] ${
                          isActive
                            ? "pointer-events-none scale-105 opacity-0"
                            : "scale-100 opacity-100"
                        }`}
                      >
                        <VehicleSilhouetteSvg
                          classId={item.id}
                          className="h-24 w-full sm:h-28"
                        />
                      </div>
                    </div>
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
