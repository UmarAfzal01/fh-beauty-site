import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Update with your actual database connection utility path
import Collaboration from "@/models/Collaboration";

// GET: Fetch all collaborations
export async function GET() {
  try {
    await dbConnect();
    const collaborations = await Collaboration.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, collaborations }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch collaborations:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Create a new collaboration entry
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.role || !body.coverImage || !body.logo) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, role, coverImage, logo)" },
        { status: 400 }
      );
    }

    const newCollaboration = await Collaboration.create({
      name: body.name,
      role: body.role,
      coverImage: body.coverImage,
      logo: body.logo,
      shortDesc: body.shortDesc || "",
      images: Array.isArray(body.images) ? body.images : [],
    });

    return NextResponse.json(
      { success: true, collaboration: newCollaboration },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create collaboration:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}