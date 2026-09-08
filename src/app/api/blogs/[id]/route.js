import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { BLOGMODEL } from "@/models/blogModel";

// GET: Fetch single blog by ID
export const GET = async (req, { params }) => {
  try {
    await dbConnect();
    const { id } = await params;
    const blog = await BLOGMODEL.findById(id);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// PUT: Update blog by ID with scheduling logic
export const PUT = async (req, { params }) => {
  try {
    await dbConnect();
    const { id } = await params;
    const payload = await req.json();

    const now = new Date();
    const scheduledDate = payload.scheduledAt
      ? new Date(payload.scheduledAt)
      : null;

    const isFuture = scheduledDate && scheduledDate > now;

    const finalData = {
      ...payload,
      status: isFuture ? "Inactive" : "Active",
      scheduledAt: scheduledDate,
    };

    const updatedBlog = await BLOGMODEL.findByIdAndUpdate(id, finalData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

// DELETE: Remove blog by ID from dynamic route
export const DELETE = async (req, { params }) => {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedBlog = await BLOGMODEL.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};