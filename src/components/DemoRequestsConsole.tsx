"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, RotateCcw, Search, ShieldAlert } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { TripType } from "@/data/routes";
import type { BookingRecord, VehicleChoiceId } from "@/lib/booking/schema";
import {
  ALLOWED_TRANSITIONS,
  STATUS_BADGE_CLASSES,
  type BookingStatus,
} from "@/lib/booking/status";
import {
  clearClientBookings,
  mergeBookingLists,
  readClientBookings,
  saveClientBooking,
  updateClientBookingStatus,
} from "@/lib/booking/client-storage";

interface DemoRequestsConsoleProps {
  locale: Locale;
  dict: Dictionary;
  initialSamples: BookingRecord[];
}

export function DemoRequestsConsole({
  locale,
  dict,
  initialSamples,
}: DemoRequestsConsoleProps) {
  const [records, setRecords] = useState<BookingRecord[]>(initialSamples);
  const [selectedNumber, setSelectedNumber] = useState<string>(
    initialSamples[0]?.publicNumber ?? ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TripType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const localItems = readClientBookings();
      try {
        const res = await fetch("/api/v1/bookings", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { bookings: BookingRecord[] };
          if (!active) return;
          const merged = mergeBookingLists(data.bookings ?? [], localItems);
          setRecords(merged);
          if (merged.length > 0) {
            setSelectedNumber((prev) =>
              merged.some((item) => item.publicNumber === prev)
                ? prev
                : merged[0].publicNumber
            );
          }
          return;
        }
      } catch {
        // Fallback smoothly to initialSamples + localStorage
      }
      if (!active) return;
      const merged = mergeBookingLists(initialSamples, localItems);
      setRecords(merged);
      if (merged.length > 0) {
        setSelectedNumber((prev) =>
          merged.some((item) => item.publicNumber === prev)
            ? prev
            : merged[0].publicNumber
        );
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [initialSamples]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((item) => {
      if (typeFilter !== "all" && item.tripType !== typeFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.publicNumber.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        item.destination.toLowerCase().includes(q) ||
        item.contactName.toLowerCase().includes(q)
      );
    });
  }, [records, searchQuery, typeFilter, statusFilter]);

  const selectedRecord = useMemo(() => {
    return (
      filtered.find((item) => item.publicNumber === selectedNumber) ??
      filtered[0] ??
      null
    );
  }, [filtered, selectedNumber]);

  function getVehicleLabel(choice: VehicleChoiceId): string {
    if (choice === "operator-choice") {
      return dict.bookingWizard.operatorChoiceTitle;
    }
    return dict.fleetSection.classes[choice].name;
  }

  async function handleStatusTransition(
    targetRecord: BookingRecord,
    nextStatus: BookingStatus
  ) {
    if (updatingStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(
        `/api/v1/bookings/${encodeURIComponent(targetRecord.publicNumber)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      let updated: BookingRecord | null = null;
      if (res.ok) {
        const json = (await res.json()) as { booking: BookingRecord };
        updated = json.booking;
        saveClientBooking(updated);
      } else {
        updated = updateClientBookingStatus(targetRecord.publicNumber, nextStatus);
        if (!updated) {
          const nowIso = new Date().toISOString();
          updated = {
            ...targetRecord,
            status: nextStatus,
            updatedAt: nowIso,
            history: [
              ...targetRecord.history,
              {
                status: nextStatus,
                changedAt: nowIso,
                actor: "operator-demo",
              },
            ],
          };
          saveClientBooking(updated);
        }
      }

      if (updated) {
        const finalUpdated = updated;
        setRecords((prev) =>
          prev.map((item) =>
            item.publicNumber === finalUpdated.publicNumber ? finalUpdated : item
          )
        );
      }
    } finally {
      setUpdatingStatus(false);
    }
  }

  function handleResetLocalDemo() {
    clearClientBookings();
    setRecords(initialSamples);
    setSelectedNumber(initialSamples[0]?.publicNumber ?? "");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EBD884] bg-[#FDF6D3] p-4 text-sm text-[#4A3803]">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#785C05]" aria-hidden="true" />
          <p>{dict.demoRequestsPage.syncNote}</p>
        </div>
        <button
          type="button"
          onClick={handleResetLocalDemo}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D4BF63] bg-white px-3 text-xs font-semibold text-[#0F1B2E] hover:bg-[#FAF9F6]"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{dict.demoRequestsPage.resetDemoBtn}</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#E4E6EC] bg-white p-4 sm:grid-cols-12">
        <div className="relative sm:col-span-6">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.demoRequestsPage.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-[#E4E6EC] bg-[#FAF9F6] pl-10 pr-4 text-sm text-[#101828]"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            aria-label={dict.demoRequestsPage.filterAllTypes}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | TripType)}
            className="h-11 w-full rounded-xl border border-[#E4E6EC] bg-[#FAF9F6] px-3 text-sm font-medium text-[#101828]"
          >
            <option value="all">{dict.demoRequestsPage.filterAllTypes}</option>
            <option value="individual">
              {dict.quickBooking.individualTab}
            </option>
            <option value="group">{dict.quickBooking.groupTab}</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            aria-label={dict.demoRequestsPage.filterAllStatuses}
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | BookingStatus)
            }
            className="h-11 w-full rounded-xl border border-[#E4E6EC] bg-[#FAF9F6] px-3 text-sm font-medium text-[#101828]"
          >
            <option value="all">
              {dict.demoRequestsPage.filterAllStatuses}
            </option>
            {(Object.keys(dict.demoRequestsPage.statuses) as BookingStatus[]).map(
              (st) => (
                <option key={st} value={st}>
                  {dict.demoRequestsPage.statuses[st]}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E4E6EC] bg-white p-10 text-center">
          <h2 className="font-display text-lg font-semibold text-[#0F1B2E]">
            {dict.demoRequestsPage.emptyTitle}
          </h2>
          <p className="mt-2 text-sm text-[#475467]">
            {dict.demoRequestsPage.emptyBody}
          </p>
          <Link
            href={`/${locale}/booking`}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#24508F] px-5 text-sm font-semibold text-white"
          >
            <span>{dict.demoRequestsPage.createFirstCta}</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Request List */}
          <div className="space-y-3 lg:col-span-7">
            {filtered.map((item) => {
              const isSelected =
                selectedRecord?.publicNumber === item.publicNumber;
              return (
                <button
                  key={item.publicNumber}
                  type="button"
                  onClick={() => setSelectedNumber(item.publicNumber)}
                  className={`w-full rounded-2xl border p-4 text-left transition-colors sm:p-5 ${
                    isSelected
                      ? "border-[#24508F] bg-[#EBF1FA]/55"
                      : "border-[#E4E6EC] bg-white hover:border-[#CBD2DF]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display tabular-nums text-sm font-semibold text-[#0F1B2E]">
                        {item.publicNumber}
                      </span>
                      <span className="rounded-md bg-[#F1F3F7] px-2 py-0.5 text-[11px] font-medium text-[#475467]">
                        {item.isDemoSample
                          ? dict.demoRequestsPage.sampleTag
                          : dict.demoRequestsPage.submittedTag}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        STATUS_BADGE_CLASSES[item.status]
                      }`}
                    >
                      {dict.demoRequestsPage.statuses[item.status]}
                    </span>
                  </div>

                  <p className="mt-2.5 text-base font-semibold text-[#101828]">
                    {item.origin} → {item.destination}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#475467]">
                    <span>
                      {dict.bookingWizard.tripTypes[item.tripType].title} ·{" "}
                      {getVehicleLabel(item.vehicleClass)}
                    </span>
                    <span className="tabular-nums">
                      {item.pickupDate} · {item.pickupTime}
                    </span>
                    <span className="tabular-nums">
                      {item.passengers} {dict.quickBooking.passengersUnit}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Request Details & Status Transitions */}
          {selectedRecord ? (
            <aside className="lg:col-span-5">
              <div className="sticky top-24 rounded-2xl border border-[#E4E6EC] bg-white p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3 border-b border-[#E4E6EC] pb-4">
                  <h2 className="font-display tabular-nums text-xl font-semibold text-[#0F1B2E]">
                    {selectedRecord.publicNumber}
                  </h2>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                      STATUS_BADGE_CLASSES[selectedRecord.status]
                    }`}
                  >
                    {dict.demoRequestsPage.statuses[selectedRecord.status]}
                  </span>
                </div>

                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-[#667085]">
                      {dict.demoRequestsPage.columns.route}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-[#101828]">
                      {selectedRecord.origin} → {selectedRecord.destination}
                    </dd>
                    {selectedRecord.extraStops ? (
                      <dd className="mt-0.5 text-xs text-[#475467]">
                        {selectedRecord.extraStops}
                      </dd>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <dt className="text-xs text-[#667085]">
                        {dict.demoRequestsPage.columns.typeAndClass}
                      </dt>
                      <dd className="mt-0.5 font-medium text-[#101828]">
                        {dict.bookingWizard.tripTypes[selectedRecord.tripType].title}
                        <span className="block text-xs text-[#475467]">
                          {getVehicleLabel(selectedRecord.vehicleClass)}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#667085]">
                        {dict.demoRequestsPage.columns.schedule}
                      </dt>
                      <dd className="mt-0.5 tabular-nums font-medium text-[#101828]">
                        {selectedRecord.pickupDate} · {selectedRecord.pickupTime}
                        <span className="block text-xs text-[#475467]">
                          {selectedRecord.timezone}
                        </span>
                      </dd>
                    </div>
                  </div>
                  <div>
                    <dt className="text-xs text-[#667085]">
                      {dict.bookingWizard.summaryCard.passengersLuggage}
                    </dt>
                    <dd className="mt-0.5 tabular-nums font-medium text-[#101828]">
                      {selectedRecord.passengers} / {selectedRecord.luggage}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#667085]">
                      {dict.demoRequestsPage.columns.contact}
                    </dt>
                    <dd className="mt-0.5 font-medium text-[#101828]">
                      {selectedRecord.contactName} ·{" "}
                      <span className="tabular-nums">{selectedRecord.fullPhone}</span>
                    </dd>
                    <dd className="text-xs text-[#475467]">
                      {dict.bookingWizard.channels[selectedRecord.preferredChannel]}
                    </dd>
                  </div>
                  {selectedRecord.comment ? (
                    <div>
                      <dt className="text-xs text-[#667085]">
                        {dict.bookingWizard.commentLabel}
                      </dt>
                      <dd className="mt-1 rounded-xl bg-[#FAF9F6] p-3 text-xs text-[#344054]">
                        {selectedRecord.comment}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                {/* Status Transition Controls */}
                {ALLOWED_TRANSITIONS[selectedRecord.status].length > 0 ? (
                  <div className="mt-5 border-t border-[#E4E6EC] pt-4">
                    <p className="text-xs font-semibold text-[#475467]">
                      {dict.demoRequestsPage.statusActionLabel}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {ALLOWED_TRANSITIONS[selectedRecord.status].map((nextSt) => (
                        <button
                          key={nextSt}
                          type="button"
                          disabled={updatingStatus}
                          onClick={() =>
                            handleStatusTransition(selectedRecord, nextSt)
                          }
                          className="min-h-[36px] rounded-lg border border-[#CBD2DF] bg-[#FAF9F6] px-3 text-xs font-semibold text-[#0F1B2E] transition-colors hover:border-[#24508F] hover:bg-[#EBF1FA] disabled:opacity-50"
                        >
                          → {dict.demoRequestsPage.statuses[nextSt]}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Status History */}
                <div className="mt-5 border-t border-[#E4E6EC] pt-4">
                  <p className="text-xs font-semibold text-[#475467]">
                    {dict.demoRequestsPage.historyTitle}
                  </p>
                  <ol className="mt-2.5 space-y-2 text-xs">
                    {selectedRecord.history.map((entry, idx) => (
                      <li
                        key={`${entry.status}-${entry.changedAt}-${idx}`}
                        className="flex items-center justify-between gap-2 text-[#475467]"
                      >
                        <span className="font-semibold text-[#101828]">
                          {dict.demoRequestsPage.statuses[entry.status]}
                        </span>
                        <span className="tabular-nums text-[11px] text-[#667085]">
                          {new Date(entry.changedAt).toLocaleString(
                            locale === "uk" ? "uk-UA" : "en-US"
                          )}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      )}
    </div>
  );
}

