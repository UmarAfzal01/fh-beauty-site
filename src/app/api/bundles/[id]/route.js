import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { BUNDLEMODEL } from "@/models/Bundle";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, shortDesc, services, price, image } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Bundle ID is required" }, { status: 400 });
    }

    if (!name || !slug || !shortDesc || !price || !services || services.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please fill in all mandatory fields including slug." },
        { status: 400 }
      );
    }

    // FORCE EXTRACT ONLY THE STRING ID
    const serviceIds = services.map((s) => {
      if (typeof s === "object" && s !== null) {
        return s._id || s.id;
      }
      return s;
    });

    await connectDB();

    const updatedBundle = await BUNDLEMODEL.findByIdAndUpdate(
      id,
      {
        name,
        slug: slug.toLowerCase().trim(),
        shortDesc,
        services: serviceIds, // Saves strictly array of ObjectIds
        price: Number(price),
        image: image || "",
      },
      { returnDocument: "after", lean: true }
    );

    if (!updatedBundle) {
      return NextResponse.json({ success: false, message: "Bundle not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, bundle: updatedBundle });
  } catch (err) {
    console.error("Failed to update bundle:", err);
    if (err.code === 11000) {
      return NextResponse.json({ success: false, message: "Slug already exists. Please choose a unique slug." }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: "Bundle ID is required" }, { status: 400 });
    }

    await connectDB();
    const deletedBundle = await BUNDLEMODEL.findByIdAndDelete(id);

    if (!deletedBundle) {
      return NextResponse.json({ success: false, message: "Bundle not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Bundle deleted successfully" });
  } catch (err) {
    console.error("Failed to delete bundle:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}