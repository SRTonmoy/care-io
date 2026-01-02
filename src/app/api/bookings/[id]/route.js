// src/app/api/bookings/[id]/route.js
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid booking ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { 
          message: "Unauthorized: Please login first",
          code: session ? "NO_USER_EMAIL" : "NO_SESSION"
        },
        { status: 401 }
      );
    }

    const booking = await Booking.findById(id);
    
    if (!booking) {
      return NextResponse.json(
        { 
          message: "Booking not found",
          code: "BOOKING_NOT_FOUND"
        },
        { status: 404 }
      );
    }

    const user = await mongoose.model("User").findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { 
          message: "User not found",
          code: "USER_NOT_FOUND"
        },
        { status: 404 }
      );
    }

    const bookingUserObjId = new mongoose.Types.ObjectId(booking.user.toString());
    const currentUserObjId = new mongoose.Types.ObjectId(user._id.toString());

    if (!bookingUserObjId.equals(currentUserObjId)) {
      return NextResponse.json(
        { 
          message: "You can only cancel your own bookings",
          code: "NOT_OWNER",
          debugInfo: {
            bookingOwnerId: booking.user.toString(),
            currentUserId: user._id.toString(),
            sessionEmail: session.user.email
          }
        },
        { status: 403 }
      );
    }

    if (booking.status !== "Pending") {
      return NextResponse.json(
        { 
          message: `Cannot cancel booking with status: "${booking.status}". Only pending bookings can be cancelled.`,
          code: "INVALID_STATUS",
          currentStatus: booking.status
        },
        { status: 400 }
      );
    }

    booking.status = "Cancelled";
    booking.cancelledAt = new Date();
    booking.cancellationNote = `Cancelled by user on ${new Date().toISOString()}`;
    
    await booking.save();

    return NextResponse.json({ 
      success: true,
      message: "Booking cancelled successfully",
      data: {
        bookingId: booking._id,
        status: booking.status,
        cancelledAt: booking.cancelledAt
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        message: "Internal server error",
        code: "INTERNAL_ERROR",
        error: error.message
      },
      { status: 500 }
    );
  }
}
