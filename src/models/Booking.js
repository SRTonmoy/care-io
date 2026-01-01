import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userEmail: String,
    service: String,
    caregiver: String,
    date: String,
    address: String,
    price: Number
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
