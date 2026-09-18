import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Doctor from "@/models/Doctor";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Basic validation
    if (!body.name || !body.email || !body.designation || !body.image) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields including the image." },
        { status: 400 }
      );
    }

    const newDoctor = await Doctor.create(body);

    return NextResponse.json(
      { success: true, message: "Doctor added successfully", data: newDoctor },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "A doctor with this email already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const doctors = await Doctor.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: doctors }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}