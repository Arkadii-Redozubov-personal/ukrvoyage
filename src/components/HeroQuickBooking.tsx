"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  ArrowRight,
  Calendar,
  ChevronDown,
  MapPin,
  Minus,
  Plus,
  Users,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  POPULAR_CORRIDORS,
  type GeographyType,
  type TripType,
} from "@/data/routes";
import { recommendVehicleClassForPassengers } from "@/data/fleet";
import { isTodayOrFutureDate } from "@/lib/booking/schema";
import { useBookingDraft } from "@/context/BookingDraftContext";

interface HeroQuickBookingProps {
  locale: Locale;
  dict: Dictionary;
}

const PASSENGER_PRESETS = [2, 6, 12, 24] as const;

export function HeroQuickBooking({ locale, dict }: HeroQuickBookingProps) {
  const router = useRouter();
  const { draft, minDate, updateDraft, swapRoutePoints } = useBookingDraft();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [passengersOpen, setPassengersOpen] = useState<boolean>(false);
  const passengersRef = useRef<HTMLDivElement>(null);

  const quickPresets = useMemo(() => {
    return POPULAR_CORRIDORS.filter((c) => c.id !== "odesa-city").slice(0, 3);
  }, []);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        passengersRef.current &&
        !passengersRef.current.contains(e.target as Node)
      ) {
        setPassengersOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPassengersOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  function handleTripTypeChange(tripType: TripType) {
    const nextPassengers =
      tripType === "group" && draft.passengers < 6 ? 8 : draft.passengers;
    updateDraft({
      tripType,
      passengers: nextPassengers,
      vehicleClass: recommendVehicleClassForPassengers(nextPassengers, tripType),
    });
  }

  function applyPassengersCount(targetCount: number) {
    const next = Math.max(1, Math.min(50, targetCount));
    const nextType: TripType = next >= 8 ? "group" : draft.tripType;
    updateDraft({
      passengers: next,
      tripType: nextType,
      vehicleClass: recommendVehicleClassForPassengers(next, nextType),
    });
  }

  function handlePresetClick(corridorId: string) {
    const found = POPULAR_CORRIDORS.find((c) => c.id === corridorId);
    if (!found) return;
    const origin = locale === "uk" ? found.originUk : found.originEn;
    const destination =
      locale === "uk" ? found.destinationUk : found.destinationEn;
    const nextPax = found.defaultTripType === "group" ? 12 : 2;
    updateDraft({
      tripType: found.defaultTripType,
      geography: found.geography,
      origin,
      destination,
      passengers: nextPax,
      vehicleClass: recommendVehicleClassForPassengers(
        nextPax,
        found.defaultTripType
      ),
    });
    setErrorMsg("");
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.origin.trim() || !draft.destination.trim()) {
      setErrorMsg(dict.quickBooking.routeRequiredError);
      return;
    }
    if (!isTodayOrFutureDate(draft.pickupDate)) {
      setErrorMsg(dict.quickBooking.pastDateError);
      return;
    }
    setErrorMsg("");
    setPassengersOpen(false);
    updateDraft({ wizardStep: 2 });
    router.push(`/${locale}/booking`);
  }

  const geographies: GeographyType[] = ["city", "ukraine", "international"];

  return (
    <div className="relative z-20 mx-auto w-full max-w-[1140px]">
      <form
        onSubmit={handleContinue}
        noValidate
        className="rounded-[28px] border border-[#E6EEF8] bg-white p-4 shadow-[0_24px_60px_-20px_rgba(15,27,46,0.14),0_4px_14px_-4px_rgba(15,27,46,0.06)] sm:p-6 lg:px-7 lg:py-6"
      >
        {/* Row 1: Unified centered pills (Trip type + Geography) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          <div
            role="group"
            aria-label={dict.bookingWizard.summaryCard.tripFormat}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => handleTripTypeChange("individual")}
              className={`min-h-[40px] rounded-full px-5 text-sm font-semibold transition-colors ${
                draft.tripType === "individual"
                  ? "bg-[#0D2347] text-white shadow-[0_2px_8px_rgba(13,35,71,0.18)]"
                  : "bg-[#EAF1FA] text-[#1D3557] hover:bg-[#DCE8F8]"
              }`}
            >
              {dict.quickBooking.individualTab}
            </button>
            <button
              type="button"
              onClick={() => handleTripTypeChange("group")}
              className={`min-h-[40px] rounded-full px-5 text-sm font-semibold transition-colors ${
                draft.tripType === "group"
                  ? "bg-[#0D2347] text-white shadow-[0_2px_8px_rgba(13,35,71,0.18)]"
                  : "bg-[#EAF1FA] text-[#1D3557] hover:bg-[#DCE8F8]"
              }`}
            >
              {dict.quickBooking.groupTab}
            </button>
          </div>

          <div
            role="group"
            aria-label={dict.quickBooking.geographyLabel}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {geographies.map((geo) => (
              <button
                key={geo}
                type="button"
                onClick={() => updateDraft({ geography: geo })}
                className={`min-h-[40px] rounded-full border px-5 text-sm transition-colors ${
                  draft.geography === geo
                    ? "border-[#1E4B94] bg-[#EEF4FD] font-semibold text-[#1E4B94]"
                    : "border-[#E4ECF6] bg-white font-medium text-[#283B5B] hover:border-[#BFD1EA] hover:bg-[#F7FAFE]"
                }`}
              >
                {dict.quickBooking.geographies[geo]}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Horizontal Inline Search Bar */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:flex lg:items-stretch lg:gap-3">
          {/* Origin + Destination Pair with Swap Control */}
          <div className="relative grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-2 md:col-span-2 lg:min-w-0 lg:flex-1">
            {/* Origin */}
            <div className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-[#E4ECF6] bg-white px-4 py-2 transition-colors focus-within:border-[#24508F] focus-within:ring-2 focus-within:ring-[#24508F]/10 sm:pr-5">
              <MapPin
                className="h-[18px] w-[18px] shrink-0 text-[#1F498E]"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="hero-origin"
                  className="block text-[13px] font-semibold leading-tight text-[#0F1B2E]"
                >
                  {dict.quickBooking.originLabel}
                </label>
                <input
                  id="hero-origin"
                  name="origin"
                  type="text"
                  value={draft.origin}
                  onChange={(e) => {
                    updateDraft({ origin: e.target.value });
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder={dict.quickBooking.originShortPlaceholder}
                  aria-label={dict.quickBooking.originPlaceholder}
                  className="mt-0.5 w-full bg-transparent text-[13px] font-medium text-[#101828] placeholder:text-[#667085] focus:outline-none"
                />
              </div>
            </div>

            {/* Swap button centered on the seam (vertical on mobile, horizontal on sm+) */}
            <button
              type="button"
              onClick={swapRoutePoints}
              aria-label={dict.quickBooking.swapAria}
              title={dict.quickBooking.swapAria}
              className="absolute right-4 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 rotate-90 items-center justify-center rounded-full border border-[#DDE6F2] bg-white text-[#475467] shadow-[0_2px_6px_rgba(15,27,46,0.06)] transition-colors hover:border-[#24508F] hover:text-[#24508F] sm:left-1/2 sm:right-auto sm:h-7 sm:w-7 sm:-translate-x-1/2 sm:rotate-0"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            {/* Destination */}
            <div className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-[#E4ECF6] bg-white px-4 py-2 transition-colors focus-within:border-[#24508F] focus-within:ring-2 focus-within:ring-[#24508F]/10 sm:pl-5">
              <MapPin
                className="h-[18px] w-[18px] shrink-0 text-[#1F498E]"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="hero-destination"
                  className="block text-[13px] font-semibold leading-tight text-[#0F1B2E]"
                >
                  {dict.quickBooking.destinationLabel}
                </label>
                <input
                  id="hero-destination"
                  name="destination"
                  type="text"
                  value={draft.destination}
                  onChange={(e) => {
                    updateDraft({ destination: e.target.value });
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder={dict.quickBooking.destinationShortPlaceholder}
                  aria-label={dict.quickBooking.destinationPlaceholder}
                  className="mt-0.5 w-full bg-transparent text-[13px] font-medium text-[#101828] placeholder:text-[#667085] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Date Picker Field */}
          <label
            htmlFor="hero-date"
            onClick={() => {
              const el = document.getElementById("hero-date") as
                | (HTMLInputElement & { showPicker?: () => void })
                | null;
              try {
                el?.showPicker?.();
              } catch {
                // Fallback to native focus when showPicker isn't supported
              }
            }}
            className="relative flex min-h-[64px] cursor-pointer items-center gap-2.5 rounded-2xl border border-[#E4ECF6] bg-white px-4 py-2 transition-colors hover:border-[#BFD1EA] focus-within:border-[#24508F] focus-within:ring-2 focus-within:ring-[#24508F]/10 lg:w-[178px] lg:shrink-0 xl:w-[192px]"
          >
            <Calendar
              className="h-[18px] w-[18px] shrink-0 text-[#1F498E]"
              aria-hidden="true"
            />
            <span className="sr-only">{dict.quickBooking.dateLabel}</span>
            <input
              id="hero-date"
              name="pickupDate"
              type="date"
              min={minDate}
              value={draft.pickupDate}
              onChange={(e) => {
                updateDraft({ pickupDate: e.target.value });
                if (errorMsg) setErrorMsg("");
              }}
              aria-label={dict.quickBooking.dateLabel}
              className="w-full cursor-pointer bg-transparent tabular-nums text-[14px] font-semibold text-[#0F1B2E] focus:outline-none [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:w-0 [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
          </label>

          {/* Passengers Popover Selector */}
          <div
            ref={passengersRef}
            className="relative lg:w-[168px] lg:shrink-0 xl:w-[186px]"
          >
            <button
              type="button"
              onClick={() => setPassengersOpen((prev) => !prev)}
              aria-expanded={passengersOpen}
              aria-haspopup="dialog"
              aria-label={`${dict.quickBooking.passengersLabel}: ${draft.passengers} ${dict.quickBooking.passengersUnit}`}
              className="flex min-h-[64px] w-full items-center justify-between gap-2 rounded-2xl border border-[#E4ECF6] bg-white px-4 py-2 text-left transition-colors hover:border-[#BFD1EA]"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <Users
                  className="h-[18px] w-[18px] shrink-0 text-[#1F498E]"
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block truncate text-[11px] font-medium leading-tight text-[#667085]">
                    {dict.quickBooking.passengersLabel}
                  </span>
                  <span className="mt-0.5 block tabular-nums text-[15px] font-bold leading-tight text-[#0F1B2E]">
                    {draft.passengers} {dict.quickBooking.passengersUnit}
                  </span>
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#475467] transition-transform duration-150 ${
                  passengersOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {passengersOpen ? (
              <div
                role="dialog"
                aria-label={dict.quickBooking.passengersLabel}
                className="absolute right-0 top-[calc(100%+8px)] z-30 w-full min-w-[248px] rounded-2xl border border-[#E4ECF6] bg-white p-4 shadow-[0_20px_44px_-16px_rgba(15,27,46,0.22)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#0F1B2E]">
                    {dict.quickBooking.passengersLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyPassengersCount(draft.passengers - 1)}
                      disabled={draft.passengers <= 1}
                      aria-label="Decrease passengers"
                      className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-[#E4ECF6] bg-white text-[#101828] transition-colors hover:border-[#24508F] disabled:opacity-40"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="min-w-[3.4rem] text-center tabular-nums text-sm font-bold text-[#0F1B2E]">
                      {draft.passengers} {dict.quickBooking.passengersUnit}
                    </span>
                    <button
                      type="button"
                      onClick={() => applyPassengersCount(draft.passengers + 1)}
                      disabled={draft.passengers >= 50}
                      aria-label="Increase passengers"
                      className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-[#E4ECF6] bg-white text-[#101828] transition-colors hover:border-[#24508F] disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-3.5 border-t border-[#E6EEF8] pt-3">
                  <span className="block text-[11px] font-medium text-[#667085]">
                    {dict.quickBooking.passengersPresetsLabel}
                  </span>
                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    {PASSENGER_PRESETS.map((count) => {
                      const active = draft.passengers === count;
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => {
                            applyPassengersCount(count);
                            setPassengersOpen(false);
                          }}
                          className={`min-h-[38px] rounded-xl border tabular-nums text-xs font-semibold transition-colors ${
                            active
                              ? "border-[#1E4B94] bg-[#EEF4FD] text-[#1E4B94]"
                              : "border-[#E4ECF6] bg-white text-[#101828] hover:border-[#BFD1EA] hover:bg-[#F7FAFE]"
                          }`}
                        >
                          {count}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Primary Submit Arrow CTA Button */}
          <button
            type="submit"
            aria-label={dict.quickBooking.submitCta}
            className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1E4A8F] px-5 text-white shadow-[0_10px_24px_-8px_rgba(30,74,143,0.5)] transition-colors hover:bg-[#163A74] md:col-span-2 lg:col-span-1 lg:min-h-[64px] lg:w-[70px] lg:shrink-0 lg:px-0 xl:w-[76px]"
          >
            <span className="text-sm font-semibold lg:sr-only">
              {dict.quickBooking.submitCta}
            </span>
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Inline error feedback */}
        {errorMsg ? (
          <p
            role="alert"
            className="mt-3 rounded-xl bg-[#FEF2F2] px-3.5 py-2.5 text-xs font-medium text-[#C42B1C]"
          >
            {errorMsg}
          </p>
        ) : null}
      </form>

      {/* Subtle external quick corridor pills + pricing note directly beneath the card */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-xs text-[#667085]">
        <span className="text-[11px] font-medium text-[#667085]">
          {dict.quickBooking.quickRoutesLabel}
        </span>
        {quickPresets.map((c) => {
          const label =
            c.id === "kyiv-city"
              ? locale === "uk"
                ? "По Києву"
                : "Kyiv (city)"
              : locale === "uk"
              ? `${c.originUk.split(" ")[0]} → ${c.destinationUk.split(" ")[0]}`
              : `${c.originEn.split(" ")[0]} → ${c.destinationEn.split(" ")[0]}`;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handlePresetClick(c.id)}
              className="rounded-full border border-[#E4ECF6] bg-white/85 px-3 py-1 text-[11px] font-medium text-[#344054] transition-colors hover:border-[#24508F]/40 hover:text-[#24508F]"
            >
              {label}
            </button>
          );
        })}
        <span aria-hidden="true" className="hidden text-[#CBD2DF] sm:inline">
          ·
        </span>
        <span className="text-[11px] text-[#667085]">
          {dict.quickBooking.operatorNote}
        </span>
      </div>
    </div>
  );
}
