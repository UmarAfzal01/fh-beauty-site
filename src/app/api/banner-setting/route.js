import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

// Simple Schema for Site Settings
const SettingSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: { type: String },
});
const Setting = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

// GET: Fetch the current banner image URL
export async function GET() {
  try {
    await dbConnect();
    const setting = await Setting.findOne({ key: "appointment_banner_image" });
    return NextResponse.json({ success: true, imageUrl: setting ? setting.value : null });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Save the selected bundle's image URL
export async function POST(req) {
  try {
    await dbConnect();
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: "Image URL is required" }, { status: 400 });
    }

    await Setting.findOneAndUpdate(
      { key: "appointment_banner_image" },
      { value: imageUrl },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: "Banner image updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}