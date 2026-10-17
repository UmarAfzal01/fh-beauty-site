import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Patient from "@/models/Patient";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const patient = await Patient.findOne({ email: session.user.email });

    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    // Returns response formatted with email as the key
    return NextResponse.json({
      success: true,
      [patient.email]: {
        history: patient.history,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const patient = await Patient.findOne({ email: session.user.email });
    if (!patient) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 }
      );
    }

    // Push new entry into this specific patient's history array
    patient.history.unshift(body);
    await patient.save();

    // Returns response formatted with email as the key containing the updated history
    return NextResponse.json({
      success: true,
      [patient.email]: {
        history: patient.history,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}