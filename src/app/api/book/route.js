import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Booking from "@/models/Booking";
import { sendInvoiceEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();

    const booking = await Booking.create(body);

    await sendInvoiceEmail({
      to: body.userEmail,
      booking
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Booking failed" },
      { status: 500 }
    );
  }
}
