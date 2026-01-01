import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    
    const { name, nid, email, contact, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { nid }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email or NID" },
        { status: 400 }
      );
    }

    // Validate NID format (10, 13, or 17 digits)
    const nidRegex = /^(?:\d{10}|\d{13}|\d{17})$/;
    if (!nidRegex.test(nid)) {
      return NextResponse.json(
        { message: "Invalid NID format. Must be 10, 13, or 17 digits" },
        { status: 400 }
      );
    }

    // Validate contact number
    const phoneRegex = /^(?:\+88|01[3-9])[0-9]{8}$/;
    if (!phoneRegex.test(contact)) {
      return NextResponse.json(
        { message: "Invalid Bangladeshi phone number" },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters with uppercase and lowercase letters" },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      nid,
      email,
      contact,
      password, // Will be hashed by the User model pre-save hook
      role: "user"
    });

    return NextResponse.json(
      { 
        message: "Registration successful! Please login.",
        user: { id: user._id, name: user.name, email: user.email }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}