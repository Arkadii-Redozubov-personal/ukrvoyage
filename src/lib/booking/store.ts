import {
  cleanPhoneDigits,
  sanitizeText,
  type BookingRecord,
  type BookingSubmissionPayload,
} from "./schema";
import { canTransitionStatus, type BookingStatus } from "./status";

interface StoreState {
  bookings: BookingRecord[];
  idempotencyMap: Map<string, BookingRecord>;
  sequence: number;
}

const INITIAL_DEMO_SAMPLES: BookingRecord[] = [
  {
    id: "demo-sample-1",
    publicNumber: "UV-2026-0101",
    isDemoSample: true,
    locale: "uk",
    tripType: "individual",
    geography: "ukraine",
    vehicleClass: "business-sedan",
    origin: "Київ (Залізничний вокзал)",
    destination: "Одеса (Центр)",
    isRoundTrip: false,
    pickupDate: "2026-12-04",
    pickupTime: "09:30",
    returnDate: "",
    returnTime: "",
    timezone: "Europe/Kyiv",
    passengers: 2,
    luggage: 2,
    extraStops: "",
    options: ["meet-sign"],
    contactName: "Олена (демо-приклад)",
    fullPhone: "+380670000101",
    preferredChannel: "telegram",
    contactEmail: "",
    comment: "Демонстраційний приклад індивідуального міжміського запиту.",
    consentAccepted: true,
    consentVersion: "v1.0-demo",
    consentAcceptedAt: "2026-11-19T10:00:00.000Z",
    status: "in_review",
    pricingMode: "operator_confirmation",
    createdAt: "2026-11-19T10:00:00.000Z",
    updatedAt: "2026-11-19T10:15:00.000Z",
    history: [
      {
        status: "new",
        changedAt: "2026-11-19T10:00:00.000Z",
        actor: "system",
      },
      {
        status: "in_review",
        changedAt: "2026-11-19T10:15:00.000Z",
        actor: "operator-demo",
      },
    ],
  },
  {
    id: "demo-sample-2",
    publicNumber: "UV-2026-0102",
    isDemoSample: true,
    locale: "uk",
    tripType: "group",
    geography: "international",
    vehicleClass: "minibus",
    origin: "Київ",
    destination: "Бургас (Болгарія)",
    isRoundTrip: true,
    pickupDate: "2026-12-12",
    pickupTime: "07:00",
    returnDate: "2026-12-20",
    returnTime: "10:00",
    timezone: "Europe/Kyiv",
    passengers: 14,
    luggage: 14,
    extraStops: "Зупинка для посадки частини групи в Одесі",
    options: ["extra-stops", "extra-luggage"],
    contactName: "Дмитро (демо-приклад)",
    fullPhone: "+380500000102",
    preferredChannel: "phone",
    contactEmail: "",
    comment: "Демонстраційний приклад групового міжнародного запиту.",
    consentAccepted: true,
    consentVersion: "v1.0-demo",
    consentAcceptedAt: "2026-11-19T11:30:00.000Z",
    status: "awaiting_quote",
    pricingMode: "operator_confirmation",
    createdAt: "2026-11-19T11:30:00.000Z",
    updatedAt: "2026-11-19T11:45:00.000Z",
    history: [
      {
        status: "new",
        changedAt: "2026-11-19T11:30:00.000Z",
        actor: "system",
      },
      {
        status: "in_review",
        changedAt: "2026-11-19T11:36:00.000Z",
        actor: "operator-demo",
      },
      {
        status: "awaiting_quote",
        changedAt: "2026-11-19T11:45:00.000Z",
        actor: "operator-demo",
      },
    ],
  },
];

const globalForStore = globalThis as unknown as {
  __ukrvoyageDemoStore?: StoreState;
};

function getStore(): StoreState {
  if (!globalForStore.__ukrvoyageDemoStore) {
    globalForStore.__ukrvoyageDemoStore = {
      bookings: [...INITIAL_DEMO_SAMPLES],
      idempotencyMap: new Map(),
      sequence: 102,
    };
  }
  return globalForStore.__ukrvoyageDemoStore;
}

export function listDemoBookings(): BookingRecord[] {
  const store = getStore();
  return [...store.bookings].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function createDemoBooking(
  payload: BookingSubmissionPayload
): { record: BookingRecord; duplicate: boolean } {
  const store = getStore();
  const existing = store.idempotencyMap.get(payload.idempotencyKey);
  if (existing) {
    return { record: existing, duplicate: true };
  }

  store.sequence += 1;
  const nowIso = new Date().toISOString();
  const numStr = String(store.sequence).padStart(4, "0");
  const fullPhone = `${payload.phoneCountryCode}${cleanPhoneDigits(
    payload.phoneNumber
  )}`;

  const record: BookingRecord = {
    id: crypto.randomUUID(),
    publicNumber: `UV-2026-${numStr}`,
    isDemoSample: false,
    locale: payload.locale,
    tripType: payload.tripType,
    geography: payload.geography,
    vehicleClass: payload.vehicleClass,
    origin: sanitizeText(payload.origin),
    destination: sanitizeText(payload.destination),
    isRoundTrip: payload.isRoundTrip,
    pickupDate: payload.pickupDate,
    pickupTime: payload.pickupTime,
    returnDate: payload.isRoundTrip ? payload.returnDate ?? "" : "",
    returnTime: payload.isRoundTrip ? payload.returnTime ?? "" : "",
    timezone: payload.timezone,
    passengers: payload.passengers,
    luggage: payload.luggage,
    extraStops: sanitizeText(payload.extraStops ?? ""),
    options: payload.options,
    contactName: sanitizeText(payload.contactName),
    fullPhone,
    preferredChannel: payload.preferredChannel,
    contactEmail: sanitizeText(payload.contactEmail ?? ""),
    comment: sanitizeText(payload.comment ?? ""),
    consentAccepted: true,
    consentVersion: payload.consentVersion,
    consentAcceptedAt: nowIso,
    status: "new",
    pricingMode: "operator_confirmation",
    createdAt: nowIso,
    updatedAt: nowIso,
    history: [
      {
        status: "new",
        changedAt: nowIso,
        actor: "system",
      },
    ],
  };

  store.bookings.unshift(record);
  store.idempotencyMap.set(payload.idempotencyKey, record);
  return { record, duplicate: false };
}

export function updateDemoBookingStatus(
  id: string,
  nextStatus: BookingStatus
): { ok: true; record: BookingRecord } | { ok: false; code: "NOT_FOUND" | "INVALID_TRANSITION" } {
  const store = getStore();
  const target = store.bookings.find((b) => b.id === id || b.publicNumber === id);
  if (!target) {
    return { ok: false, code: "NOT_FOUND" };
  }
  if (!canTransitionStatus(target.status, nextStatus)) {
    return { ok: false, code: "INVALID_TRANSITION" };
  }
  const nowIso = new Date().toISOString();
  target.status = nextStatus;
  target.updatedAt = nowIso;
  target.history.push({
    status: nextStatus,
    changedAt: nowIso,
    actor: "operator-demo",
  });
  return { ok: true, record: target };
}

export function getInitialDemoSamples(): BookingRecord[] {
  return INITIAL_DEMO_SAMPLES;
}

