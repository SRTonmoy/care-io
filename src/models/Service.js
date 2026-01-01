import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String }
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);
