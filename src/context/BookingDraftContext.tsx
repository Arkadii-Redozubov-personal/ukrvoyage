"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";
import type { GeographyType, TripType } from "@/data/routes";
import type {
  ContactChannelId,
  TripOptionKey,
  VehicleChoiceId,
} from "@/lib/booking/schema";

export interface BookingDraft {
  wizardStep: 1 | 2 | 3 | 4;
  tripType: TripType;
  geography: GeographyType;
  vehicleClass: VehicleChoiceId;
  origin: string;
  destination: string;
  isRoundTrip: boolean;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  timezone: string;
  passengers: number;
  luggage: number;
  extraStops: string;
  options: TripOptionKey[];
  contactName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  preferredChannel: ContactChannelId;
  contactEmail: string;
  comment: string;
  consentAccepted: boolean;
}

const DRAFT_STORAGE_KEY = "ukrvoyage_booking_draft_v1";

function getTodayIsoDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTomorrowIsoDate(): string {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

let todayIsoCache = "";

function getClientTodaySnapshot(): string {
  if (!todayIsoCache) {
    todayIsoCache = getTodayIsoDate();
  }
  return todayIsoCache;
}

function getServerTodaySnapshot(): string {
  return "";
}

const SERVER_DEFAULT_DRAFT: BookingDraft = {
  wizardStep: 1,
  tripType: "individual",
  geography: "ukraine",
  vehicleClass: "comfort-sedan",
  origin: "",
  destination: "",
  isRoundTrip: false,
  pickupDate: "",
  pickupTime: "10:00",
  returnDate: "",
  returnTime: "18:00",
  timezone: "Europe/Kyiv",
  passengers: 2,
  luggage: 2,
  extraStops: "",
  options: [],
  contactName: "",
  phoneCountryCode: "+380",
  phoneNumber: "",
  preferredChannel: "phone",
  contactEmail: "",
  comment: "",
  consentAccepted: false,
};

let clientDraftCache: BookingDraft | null = null;
const listeners = new Set<() => void>();

function buildInitialClientDraft(): BookingDraft {
  const base: BookingDraft = {
    ...SERVER_DEFAULT_DRAFT,
    pickupDate: getTomorrowIsoDate(),
  };
  if (typeof window === "undefined") {
    return base;
  }
  try {
    const saved = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<BookingDraft>;
      return {
        ...base,
        ...parsed,
        pickupDate: parsed.pickupDate || base.pickupDate,
      };
    }
  } catch {
    // Ignore storage read errors
  }
  return base;
}

function getClientSnapshot(): BookingDraft {
  if (!clientDraftCache) {
    clientDraftCache = buildInitialClientDraft();
  }
  return clientDraftCache;
}

function getServerSnapshot(): BookingDraft {
  return SERVER_DEFAULT_DRAFT;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setClientDraft(next: BookingDraft) {
  clientDraftCache = next;
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  }
  for (const listener of listeners) {
    listener();
  }
}

interface BookingDraftContextValue {
  draft: BookingDraft;
  minDate: string;
  updateDraft: (patch: Partial<BookingDraft>) => void;
  resetDraft: () => void;
  swapRoutePoints: () => void;
  toggleOption: (key: TripOptionKey) => void;
}

const BookingDraftContext = createContext<BookingDraftContextValue | null>(null);

export function BookingDraftProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const draft = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const minDate = useSyncExternalStore(
    subscribe,
    getClientTodaySnapshot,
    getServerTodaySnapshot
  );

  const updateDraft = useCallback((patch: Partial<BookingDraft>) => {
    const current = getClientSnapshot();
    setClientDraft({ ...current, ...patch });
  }, []);

  const resetDraft = useCallback(() => {
    const fresh: BookingDraft = {
      ...SERVER_DEFAULT_DRAFT,
      pickupDate: getTomorrowIsoDate(),
    };
    setClientDraft(fresh);
  }, []);

  const swapRoutePoints = useCallback(() => {
    const current = getClientSnapshot();
    setClientDraft({
      ...current,
      origin: current.destination,
      destination: current.origin,
    });
  }, []);

  const toggleOption = useCallback((key: TripOptionKey) => {
    const current = getClientSnapshot();
    const exists = current.options.includes(key);
    setClientDraft({
      ...current,
      options: exists
        ? current.options.filter((item) => item !== key)
        : [...current.options, key],
    });
  }, []);

  return (
    <BookingDraftContext.Provider
      value={{
        draft,
        minDate,
        updateDraft,
        resetDraft,
        swapRoutePoints,
        toggleOption,
      }}
    >
      {children}
    </BookingDraftContext.Provider>
  );
}

export function useBookingDraft() {
  const ctx = useContext(BookingDraftContext);
  if (!ctx) {
    throw new Error("useBookingDraft must be used inside BookingDraftProvider");
  }
  return ctx;
}
