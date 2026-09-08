import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { BLOGMODEL } from "@/models/blogModel";

// GET: Fetch all blogs and trigger Auto-Activation
export const GET = async () => {
  try {
    await dbConnect();
    const now = new Date(); // Global UTC current time

    // 1. AUTO-ACTIVATE: Status turns Active if scheduled time has passed
    await BLOGMODEL.updateMany(
      {
        status: "Inactive",
        scheduledAt: { $lte: now, $ne: null },
      },
      { $set: { status: "Active" } }
    );

    const data = await BLOGMODEL.find().sort({ createdAt: -1 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// POST: Create a new blog with scheduling logic
export const POST = async (req) => {
  try {
    await dbConnect();
    const payload = await req.json();

    const now = new Date();
    // Convert the incoming string to a Date object safely
    const scheduledDate = payload.scheduledAt
      ? new Date(payload.scheduledAt)
      : null;

    // Logic: Is the scheduled date in the future?
    const isFuture = scheduledDate && scheduledDate > now;

    const finalData = {
      ...payload,
      status: isFuture ? "Inactive" : "Active",
      scheduledAt: scheduledDate, // Store as actual Date object in DB
    };

    const newBlog = new BLOGMODEL(finalData);
    const savedBlog = await newBlog.save();
    return NextResponse.json(savedBlog);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// DELETE: Remove a blog by ID
export const DELETE = async (req) => {
  try {
    await dbConnect();
    const { _id } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { message: "Blog ID is required" },
        { status: 400 }
      );
    }

    const deletedBlog = await BLOGMODEL.findByIdAndDelete(_id);

    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};