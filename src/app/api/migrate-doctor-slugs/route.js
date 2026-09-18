import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Doctor from "@/models/Doctor";

export async function GET() {
  try {
    await dbConnect();

    // Find all doctors
    const doctors = await Doctor.find({});

    let count = 0;
    let errors = [];

    for (const doc of doctors) {
      try {
        // Skip if slug already exists and is valid
        if (doc.slug) continue;

        let baseSlug = doc.name
          ? doc.name.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim().replace(/\s+/g, "-")
          : "doctor";

        // Ensure uniqueness by appending a counter if slug already exists
        let slug = baseSlug;
        let counter = 1;
        while (await Doctor.findOne({ slug, _id: { $ne: doc._id } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        doc.slug = slug;
        await doc.save();
        count++;
      } catch (err) {
        errors.push({ id: doc._id, name: doc.name, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${count} doctors with slugs.`,
      errors: errors.length > 0 ? errors : undefined,
    }, { status: 200 });

  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}