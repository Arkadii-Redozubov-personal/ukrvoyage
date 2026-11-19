import type { BookingRecord } from "./schema";
import { canTransitionStatus, type BookingStatus } from "./status";

const STORAGE_KEY = "ukrvoyage_demo_bookings_v1";

export function readClientBookings(): BookingRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BookingRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveClientBooking(record: BookingRecord): void {
  if (typeof window === "undefined") return;
  try {
    const current = readClientBookings();
    const filtered = current.filter((item) => item.publicNumber !== record.publicNumber);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...filtered]));
  } catch {
    // Ignore storage quota errors in demo mode
  }
}

export function updateClientBookingStatus(
  idOrNumber: string,
  nextStatus: BookingStatus
): BookingRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const current = readClientBookings();
    const idx = current.findIndex(
      (b) => b.id === idOrNumber || b.publicNumber === idOrNumber
    );
    if (idx === -1) return null;
    const item = current[idx];
    if (!canTransitionStatus(item.status, nextStatus)) return null;
    const nowIso = new Date().toISOString();
    const updated: BookingRecord = {
      ...item,
      status: nextStatus,
      updatedAt: nowIso,
      history: [
        ...item.history,
        {
          status: nextStatus,
          changedAt: nowIso,
          actor: "operator-demo",
        },
      ],
    };
    current[idx] = updated;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return updated;
  } catch {
    return null;
  }
}

export function clearClientBookings(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function mergeBookingLists(
  serverItems: BookingRecord[],
  clientItems: BookingRecord[]
): BookingRecord[] {
  const byNumber = new Map<string, BookingRecord>();
  for (const item of serverItems) {
    byNumber.set(item.publicNumber, item);
  }
  for (const item of clientItems) {
    const existing = byNumber.get(item.publicNumber);
    if (!existing || item.updatedAt > existing.updatedAt) {
      byNumber.set(item.publicNumber, item);
    }
  }
  return Array.from(byNumber.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

