import { connection, NextResponse } from "next/server";
import { bookingSubmissionSchema } from "@/lib/booking/schema";
import { createDemoBooking, listDemoBookings } from "@/lib/booking/store";

export async function GET() {
  await connection();
  const bookings = listDemoBookings();
  return NextResponse.json({ bookings });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errorCode: "INVALID_JSON", message: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const parsed = bookingSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] ? String(issue.path[0]) : "form";
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return NextResponse.json(
      { errorCode: "VALIDATION_ERROR", fieldErrors },
      { status: 400 }
    );
  }

  if (parsed.data.honeypot && parsed.data.honeypot.trim().length > 0) {
    return NextResponse.json(
      { errorCode: "SPAM_REJECTED", message: "Request rejected" },
      { status: 400 }
    );
  }

  const { record, duplicate } = createDemoBooking(parsed.data);
  return NextResponse.json(
    { booking: record, duplicate },
    { status: duplicate ? 200 : 201 }
  );
}

