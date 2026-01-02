// src/app/api/bookings/[id]/route.js
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(request, { params }) {
  try {
    // Await params to unwrap it
    const { id } = await params;
    
   

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid booking ID format:", id);
      return NextResponse.json(
        { message: "Invalid booking ID format" },
        { status: 400 }
      );
    }

    // Connect to DB
    await connectDB();
    console.log("✅ Database connected");

    // Get logged-in user session
    const session = await getServerSession(authOptions);
    
    console.log("🔍 Session check:");
    console.log("   Has session?", !!session);
    console.log("   User ID from session:", session?.user?.id);
    console.log("   User email from session:", session?.user?.email);
    
    if (!session || !session.user) {
      console.log("❌ No valid session found");
      return NextResponse.json(
        { 
          message: "Unauthorized: Please login first",
          code: "NO_SESSION"
        },
        { status: 401 }
      );
    }

    if (!session.user.email) {
      console.log("❌ No user email in session");
      return NextResponse.json(
        { 
          message: "Unauthorized: User email missing",
          code: "NO_USER_EMAIL"
        },
        { status: 401 }
      );
    }

    // Find booking WITHOUT populate first
    const booking = await Booking.findById(id);
    
    console.log("🔍 Booking found:", {
      exists: !!booking,
      bookingId: booking?._id,
      bookingStatus: booking?.status,
      bookingUserField: booking?.user
    });
    
    if (!booking) {
      return NextResponse.json(
        { 
          message: "Booking not found",
          code: "BOOKING_NOT_FOUND"
        },
        { status: 404 }
      );
    }

    // IMPORTANT: Get the user from database using session email (same as POST endpoint)
    const user = await mongoose.model("User").findOne({ email: session.user.email });
    
    if (!user) {
      console.log("❌ User not found in database with email:", session.user.email);
      return NextResponse.json(
        { 
          message: "User not found",
          code: "USER_NOT_FOUND"
        },
        { status: 404 }
      );
    }
    
    console.log("🔍 Database user found:", {
      userId: user._id,
      userEmail: user.email
    });

    // Convert both IDs to string for comparison
    const bookingUserId = booking.user.toString(); // booking.user is ObjectId
    const currentUserId = user._id.toString(); // user._id is ObjectId
    
    console.log("🔍 User comparison:");
    console.log("   Booking User ID:", bookingUserId);
    console.log("   Current User ID:", currentUserId);
    console.log("   IDs match?", bookingUserId === currentUserId);
    
    // Also compare as ObjectIds
    const bookingUserObjId = new mongoose.Types.ObjectId(bookingUserId);
    const currentUserObjId = new mongoose.Types.ObjectId(currentUserId);
    console.log("   ObjectId.equals?", bookingUserObjId.equals(currentUserObjId));

    // Check if current user owns this booking
    if (!bookingUserObjId.equals(currentUserObjId)) {
      console.log("❌ User is NOT the owner of this booking");
      
      return NextResponse.json(
        { 
          message: "You can only cancel your own bookings",
          code: "NOT_OWNER",
          debugInfo: {
            bookingOwnerId: bookingUserId,
            currentUserId: currentUserId,
            sessionEmail: session.user.email
          }
        },
        { status: 403 }
      );
    }

    console.log("✅ User IS the owner of this booking");

    // Only allow cancellation for pending bookings
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

    // Update booking status to Cancelled
    booking.status = "Cancelled";
    booking.cancelledAt = new Date();
    
    // Add cancellation note
    booking.cancellationNote = `Cancelled by user on ${new Date().toISOString()}`;
    
    await booking.save();
    
    console.log("✅ Booking cancelled successfully:", {
      bookingId: booking._id,
      newStatus: booking.status,
      cancelledAt: booking.cancelledAt
    });

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
    console.error("💥 DELETE booking error:", error);
    
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