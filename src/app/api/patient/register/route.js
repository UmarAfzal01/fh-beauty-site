import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Patient from "@/models/Patient";
import dbConnect from "@/lib/dbConnect"; // Ensure you have a DB connection helper

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, dateOfBirth, gender, contactNumber } =
      await req.json();

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return NextResponse.json(
        { success: false, message: "Patient already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = await Patient.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      contactNumber,
      history: [],
    });

    return NextResponse.json({ success: true, patient: newPatient });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}