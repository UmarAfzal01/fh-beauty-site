import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Doctor from "@/models/Doctor";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const identifier = resolvedParams.slug || resolvedParams.id;

    // Check slug first, then fallback to _id if valid 24-char hex
    let doctor = await Doctor.findOne({
      $or: [
        { slug: identifier },
        ...(identifier.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: identifier }] : [])
      ]
    });

    if (!doctor) {
      return NextResponse.json({ success: false, message: `Doctor not found for: ${identifier}` }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: doctor }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const identifier = resolvedParams.slug || resolvedParams.id;
    const body = await req.json();

    let updatedDoctor = await Doctor.findOneAndUpdate(
      { $or: [{ slug: identifier }, ...(identifier.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: identifier }] : [])] },
      body,
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return NextResponse.json({ success: false, message: "Doctor not found to update" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Doctor updated successfully", data: updatedDoctor }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}