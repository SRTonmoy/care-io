import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import User from "@/models/User";
import { authOptions } from "@/lib/authOptions";
import mongoose from "mongoose";

/* =========================
   GET: My Bookings
========================= */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const bookings = await Booking.find({ user: user._id })
      .populate("service")
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/* =========================
   POST: Create Booking
========================= */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { serviceId, duration, durationType, location, totalCost, notes } = body;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return NextResponse.json({ message: "Invalid service ID" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    const requiredLocationFields = ["division", "district", "city", "area", "address"];
    for (const field of requiredLocationFields) {
      if (!location?.[field] || location[field].trim() === "") {
        return NextResponse.json(
          { message: `Location ${field} is required` },
          { status: 400 }
        );
      }
    }

    const booking = await Booking.create({
      user: user._id,
      service: serviceId,
      duration,
      durationType,
      location,
      totalCost,
      notes,
      status: "Pending",
      bookingDate: new Date(),
    });

    return NextResponse.json(
      { message: "Booking created successfully", bookingId: booking._id },
      { status: 201 }
    );
  } catch (error) {
    
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
