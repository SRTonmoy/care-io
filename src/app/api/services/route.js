import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({}).sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch (error) {
    
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const service = await Service.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
   
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}