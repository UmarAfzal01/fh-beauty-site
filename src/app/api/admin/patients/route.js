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
    // Retrieve all patient records with selected fields
    const patients = await Patient.find(
      {},
      "name email dateOfBirth gender contactNumber history createdAt"
    ).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, patients });
  } catch (err) {
    console.error("Failed to fetch all patients:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}