import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { BOOKING_STATUSES } from "@/lib/booking/status";
import { updateDemoBookingStatus } from "@/lib/booking/store";

const patchSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errorCode: "INVALID_JSON" },
      { status: 400 }
    );
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errorCode: "INVALID_STATUS" },
      { status: 400 }
    );
  }

  const result = updateDemoBookingStatus(id, parsed.data.status);
  if (!result.ok) {
    return NextResponse.json(
      { errorCode: result.code },
      { status: result.code === "NOT_FOUND" ? 404 : 422 }
    );
  }

  return NextResponse.json({ booking: result.record });
}

