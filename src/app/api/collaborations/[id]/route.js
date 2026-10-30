import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Collaboration from "@/models/Collaboration";

// GET: Fetch a single collaboration by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const collaboration = await Collaboration.findById(id);
    if (!collaboration) {
      return NextResponse.json(
        { success: false, error: "Collaboration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, collaboration }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch collaboration:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing collaboration by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const updatedCollaboration = await Collaboration.findByIdAndUpdate(
      id,
      {
        name: body.name,
        role: body.role,
        coverImage: body.coverImage,
        logo: body.logo,
        shortDesc: body.shortDesc,
        images: Array.isArray(body.images) ? body.images : [],
      },
      { new: true, runValidators: true }
    );

    if (!updatedCollaboration) {
      return NextResponse.json(
        { success: false, error: "Collaboration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, collaboration: updatedCollaboration },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update collaboration:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a collaboration by ID
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedCollaboration = await Collaboration.findByIdAndDelete(id);
    if (!deletedCollaboration) {
      return NextResponse.json(
        { success: false, error: "Collaboration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Collaboration deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete collaboration:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}