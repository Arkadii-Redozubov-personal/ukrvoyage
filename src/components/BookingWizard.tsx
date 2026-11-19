"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Info,
  Minus,
  Phone,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  FLEET_CATEGORIES,
  recommendVehicleClassForPassengers,
  type VehicleClassId,
} from "@/data/fleet";
import {
  DEMO_TIMEZONES,
  DIAL_CODES,
  POPULAR_CORRIDORS,
  type GeographyType,
  type TripType,
} from "@/data/routes";
import { BRAND_CHANNELS, BRAND_PHONES } from "@/data/contacts";
import {
  bookingSubmissionSchema,
  cleanPhoneDigits,
  isFutureDateTime,
  parseLocalDateTime,
  TRIP_OPTION_KEYS,
  type BookingErrorCode,
  type BookingRecord,
  type ContactChannelId,
  type TripOptionKey,
  type VehicleChoiceId,
} from "@/lib/booking/schema";
import { STATUS_BADGE_CLASSES } from "@/lib/booking/status";
import { saveClientBooking } from "@/lib/booking/client-storage";
import { useBookingDraft } from "@/context/BookingDraftContext";

interface BookingWizardProps {
  locale: Locale;
  dict: Dictionary;
}

type FieldErrors = Partial<Record<string, BookingErrorCode>>;

function createUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `demo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function BookingWizard({ locale, dict }: BookingWizardProps) {
  const searchParams = useSearchParams();
  const {
    draft,
    minDate,
    updateDraft,
    resetDraft,
    swapRoutePoints,
    toggleOption,
  } = useBookingDraft();

  const step = draft.wizardStep;
  const setStep = useCallback(
    (next: 1 | 2 | 3 | 4 | ((prev: 1 | 2 | 3 | 4) => 1 | 2 | 3 | 4)) => {
      const target = typeof next === "function" ? next(draft.wizardStep) : next;
      updateDraft({ wizardStep: target });
    },
    [draft.wizardStep, updateDraft]
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [bannerError, setBannerError] = useState<string>("");
  const [honeypot, setHoneypot] = useState<string>("");
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => createUuid());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submittedRecord, setSubmittedRecord] = useState<BookingRecord | null>(
    null
  );
  const [copiedRef, setCopiedRef] = useState(false);

  // Optional URL prefill when navigated from deep links (only runs when params exist)
  useEffect(() => {
    const qType = searchParams.get("type");
    const qGeo = searchParams.get("geo");
    const qClass = searchParams.get("class");
    const qFrom = searchParams.get("from");
    const qTo = searchParams.get("to");

    const patch: Record<string, unknown> = {};
    if (qType === "individual" || qType === "group") {
      patch.tripType = qType;
    }
    if (qGeo === "city" || qGeo === "ukraine" || qGeo === "international") {
      patch.geography = qGeo;
    }
    if (
      qClass &&
      [
        "comfort-sedan",
        "business-sedan",
        "minivan",
        "minibus",
        "coach",
        "operator-choice",
      ].includes(qClass)
    ) {
      patch.vehicleClass = qClass as VehicleChoiceId;
    }
    if (qFrom) patch.origin = qFrom;
    if (qTo) patch.destination = qTo;

    if (Object.keys(patch).length > 0) {
      updateDraft(patch);
    }
  }, [searchParams, updateDraft]);

  const selectedCategoryObj = useMemo(() => {
    if (draft.vehicleClass === "operator-choice") return null;
    return FLEET_CATEGORIES.find((c) => c.id === draft.vehicleClass) ?? null;
  }, [draft.vehicleClass]);

  const recommendedClass = useMemo<VehicleClassId>(() => {
    return recommendVehicleClassForPassengers(draft.passengers, draft.tripType);
  }, [draft.passengers, draft.tripType]);

  const showCapacityWarning = Boolean(
    selectedCategoryObj && draft.passengers > selectedCategoryObj.maxPassengers
  );

  function resolveErrorText(code: BookingErrorCode | undefined): string | null {
    if (!code) return null;
    return dict.bookingWizard.errors[code] ?? dict.bookingWizard.errors.fixFieldsBanner;
  }

  function validateStep(targetStep: 1 | 2 | 3): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (targetStep === 2) {
      if (draft.origin.trim().length < 2) {
        nextErrors.origin = "originRequired";
      }
      if (draft.destination.trim().length < 2) {
        nextErrors.destination = "destinationRequired";
      }
      if (!draft.pickupDate) {
        nextErrors.pickupDate = "pickupDateRequired";
      }
      if (!draft.pickupTime) {
        nextErrors.pickupTime = "pickupTimeRequired";
      }
      if (
        draft.pickupDate &&
        draft.pickupTime &&
        !isFutureDateTime(draft.pickupDate, draft.pickupTime)
      ) {
        nextErrors.pickupDate = "pastDatetime";
      }
      if (draft.isRoundTrip) {
        if (!draft.returnDate || !draft.returnTime) {
          nextErrors.returnDate = "returnRequired";
        } else {
          const pDt = parseLocalDateTime(draft.pickupDate, draft.pickupTime);
          const rDt = parseLocalDateTime(draft.returnDate, draft.returnTime);
          if (!pDt || !rDt || rDt.getTime() <= pDt.getTime()) {
            nextErrors.returnDate = "returnBeforePickup";
          }
        }
      }
      if (
        !Number.isInteger(draft.passengers) ||
        draft.passengers < 1 ||
        draft.passengers > 50
      ) {
        nextErrors.passengers = "passengersRange";
      }
    }

    if (targetStep === 3) {
      if (draft.contactName.trim().length < 2) {
        nextErrors.contactName = "nameRequired";
      }
      const digits = cleanPhoneDigits(draft.phoneNumber);
      if (digits.length < 7 || digits.length > 14) {
        nextErrors.phoneNumber = "phoneInvalid";
      }
      if (
        draft.contactEmail.trim().length > 0 &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contactEmail.trim())
      ) {
        nextErrors.contactEmail = "emailInvalid";
      }
      if (!draft.consentAccepted) {
        nextErrors.consentAccepted = "consentRequired";
      }
    }

    return nextErrors;
  }

  function handleNext() {
    if (step === 1) {
      setErrors({});
      setBannerError("");
      setStep(2);
      return;
    }

    if (step === 2 || step === 3) {
      const stepErrs = validateStep(step);
      if (Object.keys(stepErrs).length > 0) {
        setErrors(stepErrs);
        setBannerError(dict.bookingWizard.errors.fixFieldsBanner);
        return;
      }
      setErrors({});
      setBannerError("");
      setStep((prev) => (prev === 2 ? 3 : 4));
    }
  }

  function handleStepJump(target: 1 | 2 | 3 | 4) {
    if (target <= step) {
      setErrors({});
      setBannerError("");
      setStep(target);
      return;
    }
    if (step === 2 && target > 2) {
      const e2 = validateStep(2);
      if (Object.keys(e2).length > 0) {
        setErrors(e2);
        setBannerError(dict.bookingWizard.errors.fixFieldsBanner);
        return;
      }
    }
    if (step <= 3 && target === 4) {
      const e2 = validateStep(2);
      const e3 = validateStep(3);
      const merged = { ...e2, ...e3 };
      if (Object.keys(merged).length > 0) {
        setErrors(merged);
        setBannerError(dict.bookingWizard.errors.fixFieldsBanner);
        if (Object.keys(e2).length > 0) setStep(2);
        else setStep(3);
        return;
      }
    }
    setErrors({});
    setBannerError("");
    setStep(target);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || step !== 4) return;

    const e2 = validateStep(2);
    const e3 = validateStep(3);
    const combined = { ...e2, ...e3 };
    if (Object.keys(combined).length > 0) {
      setErrors(combined);
      setBannerError(dict.bookingWizard.errors.fixFieldsBanner);
      setStep(Object.keys(e2).length > 0 ? 2 : 3);
      return;
    }

    const payload = {
      locale,
      tripType: draft.tripType,
      geography: draft.geography,
      vehicleClass: draft.vehicleClass,
      origin: draft.origin.trim(),
      destination: draft.destination.trim(),
      isRoundTrip: draft.isRoundTrip,
      pickupDate: draft.pickupDate,
      pickupTime: draft.pickupTime,
      returnDate: draft.isRoundTrip ? draft.returnDate : "",
      returnTime: draft.isRoundTrip ? draft.returnTime : "",
      timezone: draft.timezone,
      passengers: draft.passengers,
      luggage: draft.luggage,
      extraStops: draft.extraStops.trim(),
      options: draft.options,
      contactName: draft.contactName.trim(),
      phoneCountryCode: draft.phoneCountryCode,
      phoneNumber: draft.phoneNumber.trim(),
      preferredChannel: draft.preferredChannel,
      contactEmail: draft.contactEmail.trim(),
      comment: draft.comment.trim(),
      consentAccepted: draft.consentAccepted,
      consentVersion: "v1.0-demo",
      idempotencyKey,
      honeypot,
    };

    const clientParsed = bookingSubmissionSchema.safeParse(payload);
    if (!clientParsed.success) {
      const mapped: FieldErrors = {};
      for (const issue of clientParsed.error.issues) {
        const key = issue.path[0] ? String(issue.path[0]) : "form";
        if (!mapped[key]) {
          mapped[key] = issue.message as BookingErrorCode;
        }
      }
      setErrors(mapped);
      setBannerError(dict.bookingWizard.errors.fixFieldsBanner);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setBannerError("");

    try {
      const response = await fetch("/api/v1/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientParsed.data),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data?.fieldErrors) {
          setErrors(data.fieldErrors as FieldErrors);
          setBannerError(dict.bookingWizard.errors.fixFieldsBanner);
          const keys = Object.keys(data.fieldErrors);
          if (
            keys.some((k) =>
              ["origin", "destination", "pickupDate", "pickupTime", "returnDate", "passengers"].includes(k)
            )
          ) {
            setStep(2);
          } else {
            setStep(3);
          }
        } else {
          setSubmitError(dict.bookingWizard.errors.submitFailed);
        }
        return;
      }

      const created = data.booking as BookingRecord;
      saveClientBooking(created);
      setSubmittedRecord(created);
      resetDraft();
      setIdempotencyKey(createUuid());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(dict.bookingWizard.errors.submitFailed);
    } finally {
      setSubmitting(false);
    }
  }

  function handleApplyPreset(corridorId: string) {
    const found = POPULAR_CORRIDORS.find((c) => c.id === corridorId);
    if (!found) return;
    const origin = locale === "uk" ? found.originUk : found.originEn;
    const destination =
      locale === "uk" ? found.destinationUk : found.destinationEn;
    const nextPax = found.defaultTripType === "group" ? 12 : draft.passengers;
    updateDraft({
      origin,
      destination,
      geography: found.geography,
      tripType: found.defaultTripType,
      passengers: nextPax,
    });
    setErrors((prev) => ({
      ...prev,
      origin: undefined,
      destination: undefined,
    }));
  }

  function handlePassengersDelta(delta: number) {
    const next = Math.max(1, Math.min(50, draft.passengers + delta));
    updateDraft({
      passengers: next,
      tripType: next >= 8 ? "group" : draft.tripType,
    });
    setErrors((prev) => ({ ...prev, passengers: undefined }));
  }

  function handleCopyReference(text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  }

  function handleStartAnother() {
    resetDraft();
    setSubmittedRecord(null);
    setStep(1);
    setErrors({});
    setBannerError("");
    setSubmitError("");
    setIdempotencyKey(createUuid());
  }

  function getVehicleName(choice: VehicleChoiceId): string {
    if (choice === "operator-choice") {
      return dict.bookingWizard.operatorChoiceTitle;
    }
    return dict.fleetSection.classes[choice].name;
  }

  // Render Confirmation Screen after successful submission
  if (submittedRecord) {
    const c = dict.bookingWizard.confirmation;
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[24px] border border-[#E4E6EC] bg-white p-6 shadow-[0_14px_40px_-22px_rgba(15,27,46,0.16)] sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E6EC] pb-6">
            <div>
              <h1 className="font-display flex items-center gap-3 text-2xl font-semibold text-[#0F1B2E] sm:text-3xl">
                <CheckCircle2 className="h-7 w-7 shrink-0 text-[#127A4D]" aria-hidden="true" />
                <span>{c.title}</span>
              </h1>
              <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#475467] sm:text-base">
                {c.subtitle}
              </p>
            </div>
          </div>

          {/* Reference Number & Status Bar */}
          <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#E4E6EC] bg-[#FAF9F6] p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-[#667085]">
                {c.referenceLabel}
              </p>
              <div className="mt-1.5 flex items-center gap-3">
                <span className="font-display tabular-nums text-xl font-semibold text-[#0F1B2E] sm:text-2xl">
                  {submittedRecord.publicNumber}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyReference(submittedRecord.publicNumber)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E4E6EC] bg-white px-2.5 text-xs font-semibold text-[#24508F] hover:border-[#24508F]"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copiedRef ? c.copiedReference : c.copyReference}</span>
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-[#667085]">
                {c.statusLabel}
              </p>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                    STATUS_BADGE_CLASSES[submittedRecord.status]
                  }`}
                >
                  {dict.demoRequestsPage.statuses[submittedRecord.status]}
                </span>
              </div>
            </div>
          </div>

          {/* Explicit no-false-promise warning */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#EBD884] bg-[#FDF6D3] p-4 text-sm text-[#4A3803]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#785C05]" aria-hidden="true" />
            <p className="font-medium">{c.pricingStatement}</p>
          </div>

          {/* Trip Dossier Recap */}
          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#667085]">
              {c.summaryHeading}
            </h2>
            <dl className="mt-4 divide-y divide-[#E4E6EC] rounded-2xl border border-[#E4E6EC]">
              <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-3">
                <dt className="text-xs font-medium text-[#667085]">
                  {dict.bookingWizard.summaryCard.tripFormat}
                </dt>
                <dd className="text-sm font-semibold text-[#101828] sm:col-span-2">
                  {dict.bookingWizard.tripTypes[submittedRecord.tripType].title} ·{" "}
                  {dict.bookingWizard.geographies[submittedRecord.geography].label}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-3">
                <dt className="text-xs font-medium text-[#667085]">
                  {dict.demoRequestsPage.columns.route}
                </dt>
                <dd className="text-sm font-semibold text-[#101828] sm:col-span-2">
                  {submittedRecord.origin} → {submittedRecord.destination}
                  {submittedRecord.extraStops ? (
                    <span className="mt-1 block text-xs font-normal text-[#475467]">
                      {submittedRecord.extraStops}
                    </span>
                  ) : null}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-3">
                <dt className="text-xs font-medium text-[#667085]">
                  {dict.bookingWizard.summaryCard.schedule}
                </dt>
                <dd className="tabular-nums text-sm font-semibold text-[#101828] sm:col-span-2">
                  {submittedRecord.pickupDate} · {submittedRecord.pickupTime} (
                  {submittedRecord.timezone})
                  {submittedRecord.isRoundTrip ? (
                    <span className="mt-1 block text-xs font-normal text-[#475467]">
                      ↩ {submittedRecord.returnDate} · {submittedRecord.returnTime}
                    </span>
                  ) : null}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-3">
                <dt className="text-xs font-medium text-[#667085]">
                  {dict.bookingWizard.summaryCard.vehicleClass}
                </dt>
                <dd className="text-sm font-semibold text-[#101828] sm:col-span-2">
                  {getVehicleName(submittedRecord.vehicleClass)}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-3">
                <dt className="text-xs font-medium text-[#667085]">
                  {dict.bookingWizard.summaryCard.passengersLuggage}
                </dt>
                <dd className="tabular-nums text-sm font-semibold text-[#101828] sm:col-span-2">
                  {submittedRecord.passengers} / {submittedRecord.luggage}
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-3">
                <dt className="text-xs font-medium text-[#667085]">
                  {dict.demoRequestsPage.columns.contact}
                </dt>
                <dd className="text-sm font-semibold text-[#101828] sm:col-span-2">
                  {submittedRecord.contactName} ·{" "}
                  <span className="tabular-nums">{submittedRecord.fullPhone}</span> (
                  {dict.bookingWizard.channels[submittedRecord.preferredChannel]})
                </dd>
              </div>
              <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-3">
                <dt className="text-xs font-medium text-[#667085]">
                  {c.consentRecordLabel}
                </dt>
                <dd className="tabular-nums text-xs font-medium text-[#475467] sm:col-span-2">
                  {submittedRecord.consentVersion} ·{" "}
                  {new Date(submittedRecord.consentAcceptedAt).toLocaleString(
                    locale === "uk" ? "uk-UA" : "en-US"
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Next Steps */}
          <div className="mt-8 rounded-2xl bg-[#F1F3F7] p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-[#0F1B2E]">
              {c.nextStepsHeading}
            </h2>
            <ol className="mt-3 space-y-2.5 text-sm text-[#344054]">
              {c.nextSteps.map((line, i) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F1B2E] tabular-nums text-[11px] font-semibold text-[#F2CE24]">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/demo-requests`}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#24508F] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1B3E73]"
            >
              <span>{c.openDemoLogCta}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleStartAnother}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#CBD2DF] bg-white px-5 text-sm font-semibold text-[#101828] transition-colors hover:border-[#24508F]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>{c.newRequestCta}</span>
            </button>
            <Link
              href={`/${locale}`}
              className="inline-flex h-11 items-center px-3 text-sm font-semibold text-[#475467] hover:text-[#101828]"
            >
              {c.backHomeCta}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-[#0F1B2E] sm:text-4xl">
          {dict.bookingWizard.pageTitle}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#475467] sm:text-base">
          {dict.bookingWizard.pageLead}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Main Interactive Wizard Column (~66%) */}
      <div className="lg:col-span-8">
        {/* Step Indicator */}
        <nav aria-label="Booking progress" className="mb-6">
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {dict.bookingWizard.steps.map((label, idx) => {
              const sNum = (idx + 1) as 1 | 2 | 3 | 4;
              const isCurrent = step === sNum;
              const isCompleted = step > sNum;
              return (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => handleStepJump(sNum)}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      isCurrent
                        ? "border-[#24508F] bg-[#EBF1FA] text-[#0F1B2E]"
                        : isCompleted
                        ? "border-[#CBD2DF] bg-white text-[#101828] hover:border-[#24508F]"
                        : "border-[#E4E6EC] bg-white/70 text-[#667085] hover:border-[#CBD2DF]"
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full tabular-nums text-xs font-semibold ${
                        isCurrent
                          ? "bg-[#24508F] text-white"
                          : isCompleted
                          ? "bg-[#127A4D] text-white"
                          : "bg-[#F1F3F7] text-[#475467]"
                      }`}
                    >
                      {isCompleted ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : sNum}
                    </span>
                    <span className="truncate text-xs font-semibold sm:text-[13px]">
                      {label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-[24px] border border-[#E4E6EC] bg-white p-5 sm:p-8"
        >
          {/* Honeypot anti-bot field */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="uv-website-field">Website</label>
            <input
              id="uv-website-field"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {bannerError ? (
            <div
              role="alert"
              className="mb-6 flex items-center gap-2.5 rounded-xl border border-[#F5C6C2] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#C42B1C]"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{bannerError}</span>
            </div>
          ) : null}

          {submitError ? (
            <div
              role="alert"
              className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#F5C6C2] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#C42B1C]"
            >
              <span className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {submitError}
              </span>
              <button
                type="submit"
                className="rounded-lg bg-[#C42B1C] px-3 py-1.5 text-xs font-semibold text-white"
              >
                {dict.bookingWizard.errors.retryBtn}
              </button>
            </div>
          ) : null}

          {/* STEP 1: Format, Geography & Vehicle Class */}
          {step === 1 ? (
            <div className="space-y-8">
              <h2 className="font-display text-xl font-semibold text-[#0F1B2E] sm:text-2xl">
                {dict.bookingWizard.steps[0]}
              </h2>

              {/* Trip Type Cards */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {(["individual", "group"] as TripType[]).map((type) => {
                  const selected = draft.tripType === type;
                  const tCopy = dict.bookingWizard.tripTypes[type];
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        const nextPax =
                          type === "group" && draft.passengers < 6
                            ? 10
                            : type === "individual" && draft.passengers > 7
                            ? 2
                            : draft.passengers;
                        updateDraft({
                          tripType: type,
                          passengers: nextPax,
                          vehicleClass: recommendVehicleClassForPassengers(
                            nextPax,
                            type
                          ),
                        });
                      }}
                      className={`flex flex-col rounded-2xl border p-5 text-left transition-colors ${
                        selected
                          ? "border-[#24508F] bg-[#EBF1FA]"
                          : "border-[#E4E6EC] bg-[#FAF9F6] hover:border-[#CBD2DF]"
                      }`}
                    >
                      <span className="flex w-full items-center justify-between">
                        <span className="text-base font-semibold text-[#0F1B2E]">
                          {tCopy.title}
                        </span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            selected
                              ? "border-[#24508F] bg-[#24508F] text-white"
                              : "border-[#CBD2DF] bg-white"
                          }`}
                        >
                          {selected ? <Check className="h-3 w-3" /> : null}
                        </span>
                      </span>
                      <span className="mt-2 text-sm text-[#475467]">
                        {tCopy.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Geography */}
              <div>
                <p className="text-sm font-semibold text-[#101828]">
                  {dict.quickBooking.geographyLabel}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {(["city", "ukraine", "international"] as GeographyType[]).map(
                    (geo) => {
                      const selected = draft.geography === geo;
                      const gCopy = dict.bookingWizard.geographies[geo];
                      return (
                        <button
                          key={geo}
                          type="button"
                          onClick={() => updateDraft({ geography: geo })}
                          className={`rounded-xl border p-3.5 text-left transition-colors ${
                            selected
                              ? "border-[#24508F] bg-[#EBF1FA]"
                              : "border-[#E4E6EC] bg-white hover:border-[#CBD2DF]"
                          }`}
                        >
                          <p className="text-sm font-semibold text-[#0F1B2E]">
                            {gCopy.label}
                          </p>
                          <p className="mt-0.5 text-xs text-[#475467]">
                            {gCopy.hint}
                          </p>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Vehicle Class Selection */}
              <div>
                <p className="text-sm font-semibold text-[#101828]">
                  {dict.bookingWizard.vehicleChoiceLabel}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {FLEET_CATEGORIES.map((cat) => {
                    const selected = draft.vehicleClass === cat.id;
                    const copy = dict.fleetSection.classes[cat.id];
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => updateDraft({ vehicleClass: cat.id })}
                        className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors ${
                          selected
                            ? "border-[#24508F] bg-[#EBF1FA]"
                            : "border-[#E4E6EC] bg-white hover:border-[#CBD2DF]"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#0F1B2E]">
                            {copy.name}
                          </p>
                          <p className="mt-1 tabular-nums text-xs text-[#475467]">
                            {copy.passengerLabel} · {copy.luggageLabel}
                          </p>
                        </div>
                        <Image
                          src={cat.imagePath}
                          alt={copy.name}
                          width={120}
                          height={67}
                          className="h-14 w-24 shrink-0 object-contain mix-blend-multiply"
                        />
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => updateDraft({ vehicleClass: "operator-choice" })}
                    className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors ${
                      draft.vehicleClass === "operator-choice"
                        ? "border-[#24508F] bg-[#EBF1FA]"
                        : "border-[#E4E6EC] bg-white hover:border-[#CBD2DF]"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#0F1B2E]">
                        {dict.bookingWizard.operatorChoiceTitle}
                      </p>
                      <p className="mt-1 text-xs text-[#475467]">
                        {dict.bookingWizard.operatorChoiceSubtitle}
                      </p>
                    </div>
                    <Sparkles className="h-5 w-5 shrink-0 text-[#24508F]" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* STEP 2: Route, Schedule, Passengers & Options */}
          {step === 2 ? (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-semibold text-[#0F1B2E] sm:text-2xl">
                {dict.bookingWizard.steps[1]}
              </h2>

              {/* Connected Origin & Destination inputs */}
              <div className="space-y-3">
                <div className="relative rounded-2xl border border-[#E4E6EC] bg-[#FAF9F6] p-3">
                  <div className="space-y-3 pr-12">
                    <div>
                      <label
                        htmlFor="booking-origin"
                        className="mb-1 flex items-center gap-2 text-xs font-semibold text-[#475467]"
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full border-2 border-[#24508F] bg-white"
                          aria-hidden="true"
                        />
                        {dict.bookingWizard.originLabel} *
                      </label>
                      <input
                        id="booking-origin"
                        type="text"
                        value={draft.origin}
                        onChange={(e) => {
                          updateDraft({ origin: e.target.value });
                          setErrors((p) => ({ ...p, origin: undefined }));
                        }}
                        placeholder={dict.bookingWizard.originPlaceholder}
                        aria-invalid={Boolean(errors.origin)}
                        className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm font-medium text-[#101828] ${
                          errors.origin ? "border-[#C42B1C]" : "border-[#E4E6EC]"
                        }`}
                      />
                      {errors.origin ? (
                        <p className="mt-1 text-xs font-medium text-[#C42B1C]">
                          {resolveErrorText(errors.origin)}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="booking-destination"
                        className="mb-1 flex items-center gap-2 text-xs font-semibold text-[#475467]"
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-[2px] bg-[#0F1B2E]"
                          aria-hidden="true"
                        />
                        {dict.bookingWizard.destinationLabel} *
                      </label>
                      <input
                        id="booking-destination"
                        type="text"
                        value={draft.destination}
                        onChange={(e) => {
                          updateDraft({ destination: e.target.value });
                          setErrors((p) => ({ ...p, destination: undefined }));
                        }}
                        placeholder={dict.bookingWizard.destinationPlaceholder}
                        aria-invalid={Boolean(errors.destination)}
                        className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm font-medium text-[#101828] ${
                          errors.destination
                            ? "border-[#C42B1C]"
                            : "border-[#E4E6EC]"
                        }`}
                      />
                      {errors.destination ? (
                        <p className="mt-1 text-xs font-medium text-[#C42B1C]">
                          {resolveErrorText(errors.destination)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={swapRoutePoints}
                    aria-label={dict.bookingWizard.swapAria}
                    className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-[#E4E6EC] bg-white text-[#24508F] hover:border-[#24508F]"
                  >
                    <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Sample quick fill presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-medium text-[#667085]">
                    {dict.bookingWizard.presetFillLabel}
                  </span>
                  {POPULAR_CORRIDORS.slice(2, 6).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleApplyPreset(c.id)}
                      className="rounded-lg bg-[#F1F3F7] px-2.5 py-1 text-xs font-medium text-[#101828] transition-colors hover:bg-[#EBF1FA] hover:text-[#24508F]"
                    >
                      {locale === "uk"
                        ? `${c.originUk} → ${c.destinationUk}`
                        : `${c.originEn} → ${c.destinationEn}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date, Time & Timezone */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="booking-pickup-date"
                    className="mb-1.5 block text-xs font-semibold text-[#475467]"
                  >
                    {dict.bookingWizard.pickupDateLabel} *
                  </label>
                  <input
                    id="booking-pickup-date"
                    type="date"
                    min={minDate}
                    value={draft.pickupDate}
                    onChange={(e) => {
                      updateDraft({ pickupDate: e.target.value });
                      setErrors((p) => ({ ...p, pickupDate: undefined }));
                    }}
                    aria-invalid={Boolean(errors.pickupDate)}
                    className={`h-11 w-full rounded-xl border bg-white px-3 tabular-nums text-sm font-medium text-[#101828] ${
                      errors.pickupDate ? "border-[#C42B1C]" : "border-[#E4E6EC]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-pickup-time"
                    className="mb-1.5 block text-xs font-semibold text-[#475467]"
                  >
                    {dict.bookingWizard.pickupTimeLabel} *
                  </label>
                  <input
                    id="booking-pickup-time"
                    type="time"
                    value={draft.pickupTime}
                    onChange={(e) => {
                      updateDraft({ pickupTime: e.target.value });
                      setErrors((p) => ({
                        ...p,
                        pickupTime: undefined,
                        pickupDate: undefined,
                      }));
                    }}
                    aria-invalid={Boolean(errors.pickupTime || errors.pickupDate)}
                    className={`h-11 w-full rounded-xl border bg-white px-3 tabular-nums text-sm font-medium text-[#101828] ${
                      errors.pickupTime || errors.pickupDate
                        ? "border-[#C42B1C]"
                        : "border-[#E4E6EC]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-timezone"
                    className="mb-1.5 block text-xs font-semibold text-[#475467]"
                  >
                    {dict.bookingWizard.timezoneLabel}
                  </label>
                  <select
                    id="booking-timezone"
                    value={draft.timezone}
                    onChange={(e) => updateDraft({ timezone: e.target.value })}
                    className="h-11 w-full rounded-xl border border-[#E4E6EC] bg-white px-3 text-sm font-medium text-[#101828]"
                  >
                    {DEMO_TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {locale === "uk" ? tz.labelUk : tz.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.pickupDate || errors.pickupTime ? (
                <p className="-mt-3 text-xs font-medium text-[#C42B1C]">
                  {resolveErrorText(errors.pickupDate ?? errors.pickupTime)}
                </p>
              ) : null}

              {/* Round-trip toggle */}
              <div className="rounded-2xl border border-[#E4E6EC] bg-[#FAF9F6] p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={draft.isRoundTrip}
                    onChange={(e) =>
                      updateDraft({
                        isRoundTrip: e.target.checked,
                        returnDate:
                          e.target.checked && !draft.returnDate
                            ? draft.pickupDate
                            : draft.returnDate,
                      })
                    }
                    className="mt-1 h-4 w-4 rounded border-[#CBD2DF] accent-[#24508F]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#101828]">
                      {dict.bookingWizard.roundTripLabel}
                    </span>
                    <span className="block text-xs text-[#667085]">
                      {dict.bookingWizard.roundTripHint}
                    </span>
                  </span>
                </label>

                {draft.isRoundTrip ? (
                  <div className="mt-4 grid grid-cols-1 gap-4 border-t border-[#E4E6EC] pt-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="booking-return-date"
                        className="mb-1.5 block text-xs font-semibold text-[#475467]"
                      >
                        {dict.bookingWizard.returnDateLabel} *
                      </label>
                      <input
                        id="booking-return-date"
                        type="date"
                        min={draft.pickupDate || minDate}
                        value={draft.returnDate}
                        onChange={(e) => {
                          updateDraft({ returnDate: e.target.value });
                          setErrors((p) => ({ ...p, returnDate: undefined }));
                        }}
                        className={`h-11 w-full rounded-xl border bg-white px-3 tabular-nums text-sm font-medium ${
                          errors.returnDate
                            ? "border-[#C42B1C]"
                            : "border-[#E4E6EC]"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="booking-return-time"
                        className="mb-1.5 block text-xs font-semibold text-[#475467]"
                      >
                        {dict.bookingWizard.returnTimeLabel} *
                      </label>
                      <input
                        id="booking-return-time"
                        type="time"
                        value={draft.returnTime}
                        onChange={(e) => {
                          updateDraft({ returnTime: e.target.value });
                          setErrors((p) => ({ ...p, returnDate: undefined }));
                        }}
                        className={`h-11 w-full rounded-xl border bg-white px-3 tabular-nums text-sm font-medium ${
                          errors.returnDate
                            ? "border-[#C42B1C]"
                            : "border-[#E4E6EC]"
                        }`}
                      />
                    </div>
                    {errors.returnDate ? (
                      <p className="text-xs font-medium text-[#C42B1C] sm:col-span-2">
                        {resolveErrorText(errors.returnDate)}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Passengers & Luggage */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#E4E6EC] p-3.5">
                  <label
                    htmlFor="booking-passengers-input"
                    className="block text-xs font-semibold text-[#475467]"
                  >
                    {dict.bookingWizard.passengersLabel} *
                  </label>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handlePassengersDelta(-1)}
                      disabled={draft.passengers <= 1}
                      aria-label="Decrease passengers"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E6EC] bg-[#FAF9F6] disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <input
                      id="booking-passengers-input"
                      type="number"
                      min={1}
                      max={50}
                      value={draft.passengers}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateDraft({
                          passengers: Number.isNaN(val) ? 0 : val,
                        });
                        setErrors((p) => ({ ...p, passengers: undefined }));
                      }}
                      className="h-10 w-20 rounded-lg border border-[#E4E6EC] text-center tabular-nums text-base font-semibold text-[#101828]"
                    />
                    <button
                      type="button"
                      onClick={() => handlePassengersDelta(1)}
                      disabled={draft.passengers >= 50}
                      aria-label="Increase passengers"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E6EC] bg-[#FAF9F6] disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  {errors.passengers ? (
                    <p className="mt-1.5 text-xs font-medium text-[#C42B1C]">
                      {resolveErrorText(errors.passengers)}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-xl border border-[#E4E6EC] p-3.5">
                  <label
                    htmlFor="booking-luggage-input"
                    className="block text-xs font-semibold text-[#475467]"
                  >
                    {dict.bookingWizard.luggageLabel}
                  </label>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateDraft({ luggage: Math.max(0, draft.luggage - 1) })
                      }
                      disabled={draft.luggage <= 0}
                      aria-label="Decrease luggage"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E6EC] bg-[#FAF9F6] disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <input
                      id="booking-luggage-input"
                      type="number"
                      min={0}
                      max={60}
                      value={draft.luggage}
                      onChange={(e) =>
                        updateDraft({
                          luggage: Math.max(
                            0,
                            Math.min(60, Number(e.target.value) || 0)
                          ),
                        })
                      }
                      className="h-10 w-20 rounded-lg border border-[#E4E6EC] text-center tabular-nums text-base font-semibold text-[#101828]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateDraft({
                          luggage: Math.min(60, draft.luggage + 1),
                        })
                      }
                      aria-label="Increase luggage"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E6EC] bg-[#FAF9F6]"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Capacity Mismatch Prompt */}
              {showCapacityWarning ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#EBD884] bg-[#FDF6D3] p-4 text-sm">
                  <div>
                    <p className="font-semibold text-[#0F1B2E]">
                      {dict.bookingWizard.capacityHintTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-[#4A3803]">
                      {dict.bookingWizard.capacityHintMessage} (
                      {dict.fleetSection.classes[recommendedClass].name})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateDraft({ vehicleClass: recommendedClass })}
                    className="rounded-lg bg-[#0F1B2E] px-3.5 py-2 text-xs font-semibold text-[#F2CE24]"
                  >
                    {dict.bookingWizard.capacityHintApply}
                  </button>
                </div>
              ) : null}

              {/* Intermediate stops (especially important for Group / International) */}
              <div>
                <label
                  htmlFor="booking-extra-stops"
                  className="mb-1.5 block text-xs font-semibold text-[#475467]"
                >
                  {dict.bookingWizard.extraStopsLabel}
                </label>
                <input
                  id="booking-extra-stops"
                  type="text"
                  maxLength={300}
                  value={draft.extraStops}
                  onChange={(e) => updateDraft({ extraStops: e.target.value })}
                  placeholder={dict.bookingWizard.extraStopsPlaceholder}
                  className="h-11 w-full rounded-xl border border-[#E4E6EC] bg-white px-3.5 text-sm text-[#101828]"
                />
              </div>

              {/* Trip options */}
              <div>
                <p className="text-xs font-semibold text-[#475467]">
                  {dict.bookingWizard.optionsLabel}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {TRIP_OPTION_KEYS.map((key: TripOptionKey) => {
                    const checked = draft.options.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleOption(key)}
                        aria-pressed={checked}
                        className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition-colors ${
                          checked
                            ? "border-[#24508F] bg-[#EBF1FA] text-[#24508F]"
                            : "border-[#E4E6EC] bg-white text-[#475467] hover:border-[#CBD2DF]"
                        }`}
                      >
                        {checked ? (
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : null}
                        <span>{dict.bookingWizard.optionsList[key]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {/* STEP 3: Contacts & Consent */}
          {step === 3 ? (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-semibold text-[#0F1B2E] sm:text-2xl">
                {dict.bookingWizard.steps[2]}
              </h2>

              <div>
                <label
                  htmlFor="booking-name"
                  className="mb-1.5 block text-xs font-semibold text-[#475467]"
                >
                  {dict.bookingWizard.contactNameLabel} *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  value={draft.contactName}
                  onChange={(e) => {
                    updateDraft({ contactName: e.target.value });
                    setErrors((p) => ({ ...p, contactName: undefined }));
                  }}
                  placeholder={dict.bookingWizard.contactNamePlaceholder}
                  aria-invalid={Boolean(errors.contactName)}
                  className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm font-medium text-[#101828] ${
                    errors.contactName ? "border-[#C42B1C]" : "border-[#E4E6EC]"
                  }`}
                />
                {errors.contactName ? (
                  <p className="mt-1 text-xs font-medium text-[#C42B1C]">
                    {resolveErrorText(errors.contactName)}
                  </p>
                ) : null}
              </div>

              {/* International Phone Field */}
              <div>
                <label
                  htmlFor="booking-phone"
                  className="mb-1.5 block text-xs font-semibold text-[#475467]"
                >
                  {dict.bookingWizard.phoneLabel} *
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <select
                    aria-label={dict.bookingWizard.phoneCountryLabel}
                    value={draft.phoneCountryCode}
                    onChange={(e) =>
                      updateDraft({ phoneCountryCode: e.target.value })
                    }
                    className="h-11 rounded-xl border border-[#E4E6EC] bg-[#FAF9F6] px-3 tabular-nums text-sm font-semibold text-[#101828] sm:w-36"
                  >
                    {DIAL_CODES.map((dial) => (
                      <option key={dial.code} value={dial.code}>
                        {dial.label}
                      </option>
                    ))}
                  </select>
                  <input
                    id="booking-phone"
                    type="tel"
                    inputMode="tel"
                    value={draft.phoneNumber}
                    onChange={(e) => {
                      updateDraft({ phoneNumber: e.target.value });
                      setErrors((p) => ({ ...p, phoneNumber: undefined }));
                    }}
                    placeholder={dict.bookingWizard.phoneNumberPlaceholder}
                    aria-invalid={Boolean(errors.phoneNumber)}
                    className={`h-11 flex-1 rounded-xl border bg-white px-3.5 tabular-nums text-sm font-medium text-[#101828] ${
                      errors.phoneNumber ? "border-[#C42B1C]" : "border-[#E4E6EC]"
                    }`}
                  />
                </div>
                <p className="mt-1 text-xs text-[#667085]">
                  {dict.bookingWizard.phoneIntlHint}
                </p>
                {errors.phoneNumber ? (
                  <p className="mt-1 text-xs font-medium text-[#C42B1C]">
                    {resolveErrorText(errors.phoneNumber)}
                  </p>
                ) : null}
              </div>

              {/* Preferred Contact Channel */}
              <div>
                <p className="text-xs font-semibold text-[#475467]">
                  {dict.bookingWizard.channelLabel}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {(
                    ["phone", "telegram", "viber", "whatsapp", "email"] as ContactChannelId[]
                  ).map((ch) => {
                    const active = draft.preferredChannel === ch;
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => updateDraft({ preferredChannel: ch })}
                        className={`min-h-[38px] rounded-xl border px-3.5 text-xs font-semibold transition-colors ${
                          active
                            ? "border-[#24508F] bg-[#EBF1FA] text-[#24508F]"
                            : "border-[#E4E6EC] bg-white text-[#475467] hover:border-[#CBD2DF]"
                        }`}
                      >
                        {dict.bookingWizard.channels[ch]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-email"
                  className="mb-1.5 block text-xs font-semibold text-[#475467]"
                >
                  {dict.bookingWizard.emailLabel}
                </label>
                <input
                  id="booking-email"
                  type="email"
                  value={draft.contactEmail}
                  onChange={(e) => {
                    updateDraft({ contactEmail: e.target.value });
                    setErrors((p) => ({ ...p, contactEmail: undefined }));
                  }}
                  placeholder={dict.bookingWizard.emailPlaceholder}
                  aria-invalid={Boolean(errors.contactEmail)}
                  className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-[#101828] ${
                    errors.contactEmail ? "border-[#C42B1C]" : "border-[#E4E6EC]"
                  }`}
                />
                {errors.contactEmail ? (
                  <p className="mt-1 text-xs font-medium text-[#C42B1C]">
                    {resolveErrorText(errors.contactEmail)}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="booking-comment"
                  className="mb-1.5 block text-xs font-semibold text-[#475467]"
                >
                  {dict.bookingWizard.commentLabel}
                </label>
                <textarea
                  id="booking-comment"
                  rows={3}
                  maxLength={800}
                  value={draft.comment}
                  onChange={(e) => updateDraft({ comment: e.target.value })}
                  placeholder={dict.bookingWizard.commentPlaceholder}
                  className="w-full rounded-xl border border-[#E4E6EC] bg-white p-3.5 text-sm text-[#101828]"
                />
              </div>

              {/* Privacy Policy Consent */}
              <div
                className={`rounded-xl border p-4 ${
                  errors.consentAccepted
                    ? "border-[#C42B1C] bg-[#FEF2F2]"
                    : "border-[#E4E6EC] bg-[#FAF9F6]"
                }`}
              >
                <label className="flex cursor-pointer items-start gap-3 text-sm text-[#101828]">
                  <input
                    type="checkbox"
                    checked={draft.consentAccepted}
                    onChange={(e) => {
                      updateDraft({ consentAccepted: e.target.checked });
                      setErrors((p) => ({ ...p, consentAccepted: undefined }));
                    }}
                    className="mt-1 h-4 w-4 rounded border-[#CBD2DF] accent-[#24508F]"
                  />
                  <span>
                    {dict.bookingWizard.consentLabelStart}
                    <Link
                      href={`/${locale}/privacy`}
                      className="font-semibold text-[#24508F] underline underline-offset-2"
                    >
                      {dict.bookingWizard.consentLinkText}
                    </Link>
                    {dict.bookingWizard.consentLabelEnd}
                  </span>
                </label>
                {errors.consentAccepted ? (
                  <p className="mt-2 text-xs font-medium text-[#C42B1C]">
                    {resolveErrorText(errors.consentAccepted)}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* STEP 4: Review & Submit */}
          {step === 4 ? (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-semibold text-[#0F1B2E] sm:text-2xl">
                {dict.bookingWizard.steps[3]}
              </h2>

              <div className="divide-y divide-[#E4E6EC] rounded-2xl border border-[#E4E6EC] bg-[#FAF9F6]">
                <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-semibold text-[#667085]">
                      {dict.bookingWizard.steps[0]}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#0F1B2E]">
                      {dict.bookingWizard.tripTypes[draft.tripType].title} ·{" "}
                      {dict.bookingWizard.geographies[draft.geography].label}
                    </p>
                    <p className="mt-0.5 text-sm text-[#475467]">
                      {getVehicleName(draft.vehicleClass)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-[#24508F] hover:underline"
                  >
                    {dict.bookingWizard.editStep}
                  </button>
                </div>

                <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-semibold text-[#667085]">
                      {dict.bookingWizard.steps[1]}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#0F1B2E]">
                      {draft.origin} → {draft.destination}
                    </p>
                    <p className="mt-0.5 tabular-nums text-sm text-[#475467]">
                      {draft.pickupDate} · {draft.pickupTime} ({draft.timezone})
                    </p>
                    {draft.isRoundTrip ? (
                      <p className="mt-0.5 tabular-nums text-xs text-[#475467]">
                        ↩ {draft.returnDate} · {draft.returnTime}
                      </p>
                    ) : null}
                    <p className="mt-1 tabular-nums text-xs text-[#475467]">
                      {dict.bookingWizard.passengersLabel}: {draft.passengers} ·{" "}
                      {dict.bookingWizard.luggageLabel}: {draft.luggage}
                    </p>
                    {draft.extraStops ? (
                      <p className="mt-1 text-xs text-[#475467]">
                        {draft.extraStops}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-[#24508F] hover:underline"
                  >
                    {dict.bookingWizard.editStep}
                  </button>
                </div>

                <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-semibold text-[#667085]">
                      {dict.bookingWizard.steps[2]}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#0F1B2E]">
                      {draft.contactName} ·{" "}
                      <span className="tabular-nums">
                        {draft.phoneCountryCode}
                        {cleanPhoneDigits(draft.phoneNumber)}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-[#475467]">
                      {dict.bookingWizard.channels[draft.preferredChannel]}
                      {draft.contactEmail ? ` · ${draft.contactEmail}` : ""}
                    </p>
                    {draft.comment ? (
                      <p className="mt-1 text-xs text-[#475467]">{draft.comment}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs font-semibold text-[#24508F] hover:underline"
                  >
                    {dict.bookingWizard.editStep}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[#C9D7ED] bg-[#EBF1FA] p-4 text-sm text-[#1B3E73]">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">
                    {dict.bookingWizard.reviewNoticeTitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed">
                    {dict.bookingWizard.reviewNoticeBody}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Footer Navigation Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E6EC] pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setBannerError("");
                  setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : 1));
                }}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#CBD2DF] bg-white px-5 text-sm font-semibold text-[#101828] transition-colors hover:border-[#24508F]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>{dict.bookingWizard.backBtn}</span>
              </button>
            ) : (
              <span />
            )}

            {step < 4 ? (
              <button
                key="wizard-next-btn"
                type="button"
                onClick={handleNext}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#24508F] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1B3E73]"
              >
                <span>{dict.bookingWizard.nextBtn}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                key="wizard-submit-btn"
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#24508F] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#1B3E73] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {submitting
                    ? dict.bookingWizard.submittingBtn
                    : dict.bookingWizard.submitBtn}
                </span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Right Sticky Summary & Reassurance Sidebar (~33%, Lenox-inspired) */}
      <aside className="lg:col-span-4">
        <div className="sticky top-24 space-y-5">
          <div className="rounded-2xl border border-[#E4E6EC] bg-white p-5 sm:p-6">
            <h3 className="font-display text-base font-semibold text-[#0F1B2E]">
              {dict.bookingWizard.summaryCard.title}
            </h3>

            <dl className="mt-4 space-y-3 border-t border-[#E4E6EC] pt-4 text-sm">
              <div>
                <dt className="text-xs text-[#667085]">
                  {dict.demoRequestsPage.columns.route}
                </dt>
                <dd className="mt-0.5 font-semibold text-[#101828]">
                  {draft.origin || draft.destination
                    ? `${draft.origin || "—"} → ${draft.destination || "—"}`
                    : dict.bookingWizard.summaryCard.emptyRoute}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-xs text-[#667085]">
                  {dict.bookingWizard.summaryCard.tripFormat}
                </dt>
                <dd className="font-medium text-[#101828]">
                  {dict.bookingWizard.tripTypes[draft.tripType].title}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-xs text-[#667085]">
                  {dict.bookingWizard.summaryCard.geography}
                </dt>
                <dd className="font-medium text-[#101828]">
                  {dict.bookingWizard.geographies[draft.geography].label}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-xs text-[#667085]">
                  {dict.bookingWizard.summaryCard.vehicleClass}
                </dt>
                <dd className="font-medium text-[#101828]">
                  {getVehicleName(draft.vehicleClass)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-xs text-[#667085]">
                  {dict.bookingWizard.summaryCard.schedule}
                </dt>
                <dd className="tabular-nums font-medium text-[#101828]">
                  {draft.pickupDate} · {draft.pickupTime}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-xs text-[#667085]">
                  {dict.bookingWizard.summaryCard.passengersLuggage}
                </dt>
                <dd className="tabular-nums font-medium text-[#101828]">
                  {draft.passengers} / {draft.luggage}
                </dd>
              </div>
            </dl>

            <div className="mt-5 rounded-xl bg-[#FDF6D3] p-3.5 text-xs">
              <p className="font-semibold text-[#0F1B2E]">
                {dict.bookingWizard.summaryCard.pricingTitle}
              </p>
              <p className="mt-1 text-[#4A3803]">
                {dict.bookingWizard.summaryCard.pricingValue}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E4E6EC] bg-[#F1F3F7] p-5 sm:p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0F1B2E]">
              <ShieldCheck className="h-4 w-4 text-[#24508F]" aria-hidden="true" />
              <span>{dict.bookingWizard.summaryCard.reassuranceTitle}</span>
            </div>

            <ul className="mt-3.5 space-y-2.5 text-xs leading-relaxed text-[#475467]">
              {dict.bookingWizard.summaryCard.reassurancePoints.map((pt) => (
                <li key={pt} className="flex items-start gap-2">
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#24508F]"
                    aria-hidden="true"
                  />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 border-t border-[#DDE2EB] pt-4 text-xs">
              <a
                href={BRAND_PHONES[0].href}
                className="flex items-center gap-2 font-semibold text-[#0F1B2E] hover:text-[#24508F]"
              >
                <Phone className="h-3.5 w-3.5 text-[#24508F]" aria-hidden="true" />
                <span className="tabular-nums">{BRAND_PHONES[0].display}</span>
              </a>
              <a
                href={BRAND_CHANNELS.telegramBotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-semibold text-[#24508F] hover:underline"
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Telegram {BRAND_CHANNELS.telegramBotHandle}</span>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
    </>
  );
}
