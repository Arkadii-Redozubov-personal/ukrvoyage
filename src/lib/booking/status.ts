export const BOOKING_STATUSES = [
  "new",
  "in_review",
  "awaiting_quote",
  "quote_sent",
  "confirmed",
  "completed",
  "cancelled",
  "declined",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  new: ["in_review", "awaiting_quote", "cancelled", "declined"],
  in_review: ["awaiting_quote", "quote_sent", "confirmed", "cancelled", "declined"],
  awaiting_quote: ["quote_sent", "confirmed", "cancelled", "declined"],
  quote_sent: ["confirmed", "in_review", "cancelled", "declined"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  declined: [],
};

export function canTransitionStatus(
  fromStatus: BookingStatus,
  toStatus: BookingStatus
): boolean {
  return ALLOWED_TRANSITIONS[fromStatus].includes(toStatus);
}

export const STATUS_BADGE_CLASSES: Record<BookingStatus, string> = {
  new: "bg-[#EBF1FA] text-[#24508F] border-[#C9D7ED]",
  in_review: "bg-[#FDF6D3] text-[#785C05] border-[#EBD884]",
  awaiting_quote: "bg-[#FDF6D3] text-[#785C05] border-[#EBD884]",
  quote_sent: "bg-[#EEF2FF] text-[#3546A6] border-[#C9D1F5]",
  confirmed: "bg-[#ECFDF3] text-[#127A4D] border-[#BCE6CF]",
  completed: "bg-[#F1F3F7] text-[#344054] border-[#D0D5DD]",
  cancelled: "bg-[#FEF2F2] text-[#C42B1C] border-[#F5C6C2]",
  declined: "bg-[#FEF2F2] text-[#C42B1C] border-[#F5C6C2]",
};

