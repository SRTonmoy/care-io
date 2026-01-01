import {connectDB} from "@/lib/db";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  await connectDB();

  const booking = await Booking.create({
    userEmail: session.user.email,
    ...body,
    status: "Pending"
  });

  return NextResponse.json(booking);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const bookings = await Booking.find({
    userEmail: session.user.email
  }).sort({ createdAt: -1 });

  return NextResponse.json(bookings);
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await req.json();
  await connectDB();

  await Booking.findByIdAndUpdate(id, {
    status: "Cancelled"
  });

  return NextResponse.json({ success: true });
}
