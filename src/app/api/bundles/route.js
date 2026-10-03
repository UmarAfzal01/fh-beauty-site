
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { BUNDLEMODEL } from "@/models/Bundle";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export async function GET() {
  try {
    await connectDB();
    
    // Fetch bundles directly. Mongoose will return `services` as an array of string IDs.
    const bundles = await BUNDLEMODEL.find({}).lean();
    
    return NextResponse.json({ success: true, bundles });
  } catch (err) {
    console.error("Failed to fetch bundles:", err);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, shortDesc, services, price, image } = body;

    if (!name || !slug || !shortDesc || !price || !services || services.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please fill in all mandatory fields and select at least one service." },
        { status: 400 }
      );
    }

    const serviceIds = services.map((s) => (typeof s === "object" ? s._id || s.id : String(s)));

    await connectDB();

    const newBundle = await BUNDLEMODEL.create({
      name,
      slug: slug.toLowerCase().trim(),
      shortDesc,
      services: serviceIds,
      price: Number(price),
      image: image || "",
    });

    return NextResponse.json({ success: true, bundle: newBundle });
  } catch (err) {
    console.error("Failed to create bundle:", err);
    if (err.code === 11000) {
      return NextResponse.json({ success: false, message: "Slug already exists. Please choose a unique slug." }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}