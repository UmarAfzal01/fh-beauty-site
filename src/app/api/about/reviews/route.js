import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ABOUTMODEL } from "@/models/About"; // Adjust path if your model path differs

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { aboutId, rating, reviewText, name, email, image } = body;

    // Validate required fields
    if (!rating || !reviewText || !name || !image) {
      return NextResponse.json(
        {
          success: false,
          message: "All required review fields must be provided.",
        },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5." },
        { status: 400 },
      );
    }

    await connectDB();

    // If an aboutId is provided, push to that document; otherwise, find the single About document
    let query = aboutId ? { _id: aboutId } : {};
    let aboutDoc = await ABOUTMODEL.findOne(query);

    if (!aboutDoc) {
      return NextResponse.json(
        { success: false, message: "About document not found." },
        { status: 404 },
      );
    }

    // Atomically push the review into the reviews array
    const updatedAbout = await ABOUTMODEL.findOneAndUpdate(
      { _id: aboutDoc._id },
      {
        $push: {
          reviews: {
            rating: Number(rating),
            message: reviewText,
            name,
            email: email || "",
            image,
            createdAt: new Date(),
          },
        },
      },
      { returnDocument: "after", lean: true },
    );

    return NextResponse.json({
      success: true,
      reviews: updatedAbout.reviews,
    });
  } catch (err) {
    console.error("Failed to post about review:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { reviewId, aboutId } = body;

    if (!reviewId) {
      return NextResponse.json(
        { success: false, message: "Review ID is required." },
        { status: 400 },
      );
    }

    await connectDB();

    let query = aboutId ? { _id: aboutId } : {};
    let aboutDoc = await ABOUTMODEL.findOne(query);

    if (!aboutDoc) {
      return NextResponse.json(
        { success: false, message: "About document not found." },
        { status: 404 },
      );
    }

    // Atomically pull/remove the review from the array by its _id
    const updatedAbout = await ABOUTMODEL.findOneAndUpdate(
      { _id: aboutDoc._id },
      {
        $pull: {
          reviews: { _id: reviewId },
        },
      },
      { returnDocument: "after", lean: true },
    );

    return NextResponse.json({
      success: true,
      reviews: updatedAbout.reviews,
    });
  } catch (err) {
    console.error("Failed to delete about review:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}