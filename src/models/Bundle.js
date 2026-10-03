import mongoose from "mongoose";

const BundleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDesc: { type: String, required: true },
    // Stored strictly as an array of string IDs
    services: { type: [String], required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export const BUNDLEMODEL = mongoose.models.Bundle || mongoose.model("Bundle", BundleSchema);