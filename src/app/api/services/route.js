import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Service from "@/models/Service";

export async function GET() {
  await connectDB();
  const services = await Service.find({}).sort({ createdAt: -1 });
  return NextResponse.json(services);
}
