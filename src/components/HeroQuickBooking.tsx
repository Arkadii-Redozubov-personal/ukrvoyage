"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, ArrowRight, Calendar, Minus, Plus, Users } from "lucide-react";
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

export function HeroQuickBooking({ locale, dict }: HeroQuickBookingProps) {
  const router = useRouter();
  const { draft, minDate, updateDraft, swapRoutePoints } = useBookingDraft();
  const [errorMsg, setErrorMsg] = useState<string>("");

  const quickPresets = useMemo(() => {
    return POPULAR_CORRIDORS.filter((c) => c.id !== "odesa-city").slice(0, 3);
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

  function handlePassengersChange(delta: number) {
    const next = Math.max(1, Math.min(50, draft.passengers + delta));
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
    updateDraft({ wizardStep: 2 });
    router.push(`/${locale}/booking`);
  }

  const geographies: GeographyType[] = ["city", "ukraine", "international"];

  return (
    <form
      onSubmit={handleContinue}
      noValidate
      className="rounded-2xl border border-[#E4E6EC] bg-white p-4 shadow-[0_12px_36px_-18px_rgba(15,27,46,0.16)] sm:p-5"
    >
      {/* Trip type segmented toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          role="group"
          aria-label={dict.bookingWizard.summaryCard.tripFormat}
          className="inline-flex rounded-xl bg-[#F1F3F7] p-1"
        >
          <button
            type="button"
            onClick={() => handleTripTypeChange("individual")}
            className={`min-h-[38px] rounded-lg px-3.5 text-xs font-semibold transition-colors sm:text-sm ${
              draft.tripType === "individual"
                ? "bg-[#0F1B2E] text-white"
                : "text-[#475467] hover:text-[#101828]"
            }`}
          >
            {dict.quickBooking.individualTab}
          </button>
          <button
            type="button"
            onClick={() => handleTripTypeChange("group")}
            className={`min-h-[38px] rounded-lg px-3.5 text-xs font-semibold transition-colors sm:text-sm ${
              draft.tripType === "group"
                ? "bg-[#0F1B2E] text-white"
                : "text-[#475467] hover:text-[#101828]"
            }`}
          >
            {dict.quickBooking.groupTab}
          </button>
        </div>

        {/* Geography quick pills */}
        <div
          role="group"
          aria-label={dict.quickBooking.geographyLabel}
          className="flex flex-wrap items-center gap-1"
        >
          {geographies.map((geo) => (
            <button
              key={geo}
              type="button"
              onClick={() => updateDraft({ geography: geo })}
              className={`min-h-[34px] rounded-full border px-2.5 text-xs font-medium transition-colors ${
                draft.geography === geo
                  ? "border-[#24508F] bg-[#EBF1FA] text-[#24508F]"
                  : "border-[#E4E6EC] bg-white text-[#475467] hover:border-[#CBD2DF]"
              }`}
            >
              {dict.quickBooking.geographies[geo]}
            </button>
          ))}
        </div>
      </div>

      {/* Connected Uber-inspired Origin -> Destination block */}
      <div className="relative mt-4 rounded-xl border border-[#E4E6EC] bg-[#FAF9F6] p-1.5">
        <div className="relative flex items-center">
          <span
            className="pointer-events-none ml-3.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-[2.5px] border-[#24508F] bg-white"
            aria-hidden="true"
          />
          <input
            id="hero-origin"
            name="origin"
            type="text"
            value={draft.origin}
            onChange={(e) => {
              updateDraft({ origin: e.target.value });
              if (errorMsg) setErrorMsg("");
            }}
            placeholder={dict.quickBooking.originPlaceholder}
            aria-label={dict.quickBooking.originPlaceholder}
            className="h-11 w-full bg-transparent pl-3 pr-12 text-sm font-medium text-[#101828] placeholder:text-[#667085] focus:outline-none"
          />
        </div>

        {/* Vertical route connector line */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[24px] top-[34px] h-[30px] w-[1.5px] bg-[#CBD2DF]"
        />

        <div className="mx-3 border-t border-[#E4E6EC]" />

        <div className="relative flex items-center">
          <span
            className="pointer-events-none ml-3.5 h-3 w-3 shrink-0 rounded-[2px] bg-[#0F1B2E]"
            aria-hidden="true"
          />
          <input
            id="hero-destination"
            name="destination"
            type="text"
            value={draft.destination}
            onChange={(e) => {
              updateDraft({ destination: e.target.value });
              if (errorMsg) setErrorMsg("");
            }}
            placeholder={dict.quickBooking.destinationPlaceholder}
            aria-label={dict.quickBooking.destinationPlaceholder}
            className="h-11 w-full bg-transparent pl-3 pr-12 text-sm font-medium text-[#101828] placeholder:text-[#667085] focus:outline-none"
          />
        </div>

        {/* Swap origin/destination button */}
        <button
          type="button"
          onClick={swapRoutePoints}
          aria-label={dict.quickBooking.swapAria}
          title={dict.quickBooking.swapAria}
          className="absolute right-2.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-[#E4E6EC] bg-white text-[#475467] transition-colors hover:border-[#24508F] hover:text-[#24508F]"
        >
          <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Date & Passengers Row */}
      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <label className="flex h-12 items-center gap-2.5 rounded-xl border border-[#E4E6EC] bg-[#FAF9F6] px-3.5 focus-within:border-[#24508F]">
          <Calendar className="h-4 w-4 shrink-0 text-[#24508F]" aria-hidden="true" />
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
            className="w-full bg-transparent tabular-nums text-sm font-medium text-[#101828] focus:outline-none"
          />
        </label>

        <div className="flex h-12 items-center justify-between rounded-xl border border-[#E4E6EC] bg-[#FAF9F6] px-3.5">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-[#475467]">
            <Users className="h-4 w-4 text-[#24508F]" aria-hidden="true" />
            <span>{dict.quickBooking.passengersLabel}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handlePassengersChange(-1)}
              disabled={draft.passengers <= 1}
              aria-label="Decrease passengers"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E6EC] bg-white text-[#101828] disabled:opacity-40 hover:border-[#24508F]"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="min-w-[3.2rem] text-center tabular-nums text-sm font-semibold text-[#101828]">
              {draft.passengers} {dict.quickBooking.passengersUnit}
            </span>
            <button
              type="button"
              onClick={() => handlePassengersChange(1)}
              disabled={draft.passengers >= 50}
              aria-label="Increase passengers"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E6EC] bg-white text-[#101828] disabled:opacity-40 hover:border-[#24508F]"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Inline error if user tries continuing with empty route or past date */}
      {errorMsg ? (
        <p
          role="alert"
          className="mt-2.5 rounded-lg bg-[#FEF2F2] px-3 py-2 text-xs font-medium text-[#C42B1C]"
        >
          {errorMsg}
        </p>
      ) : null}

      {/* Primary CTA */}
      <button
        type="submit"
        className="mt-3.5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#24508F] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1B3E73]"
      >
        <span>{dict.quickBooking.submitCta}</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Quick sample route pills */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-[#E4E6EC] pt-3">
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
              className="rounded-md bg-[#F1F3F7] px-2 py-1 text-[11px] font-medium text-[#101828] transition-colors hover:bg-[#EBF1FA] hover:text-[#24508F]"
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[11px] text-[#667085]">
        {dict.quickBooking.operatorNote}
      </p>
    </form>
  );
}
