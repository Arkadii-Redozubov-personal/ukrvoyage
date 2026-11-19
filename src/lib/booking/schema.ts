import { z } from "zod";
import type { BookingStatus } from "./status";

export const VEHICLE_CHOICE_IDS = [
  "comfort-sedan",
  "business-sedan",
  "minivan",
  "minibus",
  "coach",
  "operator-choice",
] as const;

export type VehicleChoiceId = (typeof VEHICLE_CHOICE_IDS)[number];

export const TRIP_OPTION_KEYS = [
  "child-seat",
  "extra-luggage",
  "meet-sign",
  "extra-stops",
  "pet-friendly",
] as const;

export type TripOptionKey = (typeof TRIP_OPTION_KEYS)[number];

export const CONTACT_CHANNEL_IDS = [
  "phone",
  "telegram",
  "viber",
  "whatsapp",
  "email",
] as const;

export type ContactChannelId = (typeof CONTACT_CHANNEL_IDS)[number];

export type BookingErrorCode =
  | "originRequired"
  | "destinationRequired"
  | "pickupDateRequired"
  | "pickupTimeRequired"
  | "pastDatetime"
  | "returnRequired"
  | "returnBeforePickup"
  | "passengersRange"
  | "nameRequired"
  | "phoneInvalid"
  | "emailInvalid"
  | "consentRequired";

export function sanitizeText(value: string): string {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
}

export function cleanPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function parseLocalDateTime(dateStr: string, timeStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || !/^\d{2}:\d{2}$/.test(timeStr)) {
    return null;
  }
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
  if (
    Number.isNaN(dt.getTime()) ||
    dt.getFullYear() !== y ||
    dt.getMonth() !== m - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return dt;
}

export function isFutureDateTime(dateStr: string, timeStr: string): boolean {
  const dt = parseLocalDateTime(dateStr, timeStr);
  if (!dt) return false;
  // Allow 2 minutes tolerance for current minute selections
  return dt.getTime() >= Date.now() - 2 * 60 * 1000;
}

export function isTodayOrFutureDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
  return dateStr >= todayStr;
}

export const bookingSubmissionSchema = z
  .object({
    locale: z.enum(["uk", "en"]),
    tripType: z.enum(["individual", "group"]),
    geography: z.enum(["city", "ukraine", "international"]),
    vehicleClass: z.enum(VEHICLE_CHOICE_IDS),
    origin: z.string().trim().min(2, "originRequired").max(160),
    destination: z.string().trim().min(2, "destinationRequired").max(160),
    isRoundTrip: z.boolean(),
    pickupDate: z.string().trim().min(1, "pickupDateRequired"),
    pickupTime: z.string().trim().min(1, "pickupTimeRequired"),
    returnDate: z.string().trim().optional().default(""),
    returnTime: z.string().trim().optional().default(""),
    timezone: z.string().trim().min(2).max(60),
    passengers: z.number().int().min(1, "passengersRange").max(50, "passengersRange"),
    luggage: z.number().int().min(0).max(60),
    extraStops: z.string().trim().max(300).optional().default(""),
    options: z.array(z.enum(TRIP_OPTION_KEYS)).max(10),
    contactName: z.string().trim().min(2, "nameRequired").max(100),
    phoneCountryCode: z
      .string()
      .trim()
      .regex(/^\+\d{1,4}$/, "phoneInvalid"),
    phoneNumber: z.string().trim().max(30),
    preferredChannel: z.enum(CONTACT_CHANNEL_IDS),
    contactEmail: z.string().trim().max(120).optional().default(""),
    comment: z.string().trim().max(800).optional().default(""),
    consentAccepted: z.boolean().refine((v) => v === true, {
      message: "consentRequired",
    }),
    consentVersion: z.string().trim().min(1).max(40),
    idempotencyKey: z.string().trim().min(8).max(80),
    honeypot: z.string().max(100).optional().default(""),
  })
  .superRefine((data, ctx) => {
    const digits = cleanPhoneDigits(data.phoneNumber);
    if (digits.length < 7 || digits.length > 14) {
      ctx.addIssue({
        code: "custom",
        path: ["phoneNumber"],
        message: "phoneInvalid",
      });
    }

    if (data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      ctx.addIssue({
        code: "custom",
        path: ["contactEmail"],
        message: "emailInvalid",
      });
    }

    if (!isFutureDateTime(data.pickupDate, data.pickupTime)) {
      ctx.addIssue({
        code: "custom",
        path: ["pickupDate"],
        message: "pastDatetime",
      });
    }

    if (data.isRoundTrip) {
      if (!data.returnDate || !data.returnTime) {
        ctx.addIssue({
          code: "custom",
          path: ["returnDate"],
          message: "returnRequired",
        });
      } else {
        const pickup = parseLocalDateTime(data.pickupDate, data.pickupTime);
        const ret = parseLocalDateTime(data.returnDate, data.returnTime);
        if (!pickup || !ret || ret.getTime() <= pickup.getTime()) {
          ctx.addIssue({
            code: "custom",
            path: ["returnDate"],
            message: "returnBeforePickup",
          });
        }
      }
    }
  });

export type BookingSubmissionPayload = z.infer<typeof bookingSubmissionSchema>;

export interface BookingStatusHistoryItem {
  status: BookingStatus;
  changedAt: string;
  actor: string;
  note?: string;
}

export interface BookingRecord {
  id: string;
  publicNumber: string;
  isDemoSample?: boolean;
  locale: "uk" | "en";
  tripType: "individual" | "group";
  geography: "city" | "ukraine" | "international";
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
  fullPhone: string;
  preferredChannel: ContactChannelId;
  contactEmail: string;
  comment: string;
  consentAccepted: true;
  consentVersion: string;
  consentAcceptedAt: string;
  status: BookingStatus;
  pricingMode: "operator_confirmation";
  createdAt: string;
  updatedAt: string;
  history: BookingStatusHistoryItem[];
}

