import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Doctor from "@/models/Doctor";

// GET single doctor by slug (or fallback to id if needed)
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // route parameter name can remain 'id' or be renamed to 'slug'

    // Try finding by slug first, fallback to _id if it's a valid ObjectId format
    let doctor = await Doctor.findOne({ slug: id });
    if (!doctor && id.match(/^[0-9a-fA-F]{24}$/)) {
      doctor = await Doctor.findById(id);
    }

    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: doctor }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT / Update doctor by slug or id
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    let updatedDoctor = await Doctor.findOneAndUpdate({ slug: id }, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoctor && id.match(/^[0-9a-fA-F]{24}$/)) {
      updatedDoctor = await Doctor.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
    }

    if (!updatedDoctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Doctor updated successfully", data: updatedDoctor }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}