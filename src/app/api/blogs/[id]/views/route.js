import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import { BLOGMODEL } from "@/models/blogModel";
import mongoose from 'mongoose';

export async function POST(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" }, 
        { status: 400 }
      );
    }

    // Ensure database connection is established
    await dbConnect();

    // Check if the passed parameter is a valid MongoDB ObjectId or a slug/custom string
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { slug: id }, { id: id }] }
      : { $or: [{ slug: id }, { id: id }] };

    // Atomically increment the view count by 1 and return the updated document
    const updatedBlog = await BLOGMODEL.findOneAndUpdate(
      query,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        views: updatedBlog.views 
      }, 
      { status: 200 }
    );

  } catch (err) {
    console.error("Error incrementing blog views:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}