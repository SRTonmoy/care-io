import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    await connectDB();

    const booking = await Booking.findById(id);
    
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if user owns this booking
    if (booking.user.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update status to Cancelled
    booking.status = "Cancelled";
    await booking.save();

    return NextResponse.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}