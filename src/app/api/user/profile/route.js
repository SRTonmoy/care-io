import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
const user = await User.findOne({ email: session.user.email }).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        nid: user.nid,
        contact: user.contact,
        image: user.image,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        nidVerified: user.nidVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error) {
   
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, contact } = await request.json();

    // Validate input
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { message: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    await connectDB();
    
    const updateData = { name: name.trim() };
    
    // Add contact if provided and valid
    if (contact && contact.trim()) {
      const phoneRegex = /^(?:\+88|01[3-9])[0-9]{8}$/;
      if (!phoneRegex.test(contact.trim())) {
        return NextResponse.json(
          { message: "Invalid Bangladeshi phone number" },
          { status: 400 }
        );
      }
      updateData.contact = contact.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        contact: updatedUser.contact,
      }
    });
  } catch (error) {
    
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}