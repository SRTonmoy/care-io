import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String },

    durationOptions: {
      type: [String],
      default: []
    },

    locationOptions: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.models.Service ||
  mongoose.model("Service", serviceSchema);
