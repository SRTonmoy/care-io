import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    
    const { id } = await params;
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" }, 
        { status: 400 }
      );
    }

    await connectDB();

    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" }, 
        { status: 404 }
      );
    }

    // Convert to plain object and ensure price is a number
    const serviceData = service.toObject ? service.toObject() : service;
    serviceData.pricePerDay = Number(serviceData.pricePerDay) || 0;

    return NextResponse.json(serviceData);
  } catch (error) {
   
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}