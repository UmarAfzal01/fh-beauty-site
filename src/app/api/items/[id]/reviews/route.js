import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Item } from "@/models/Item";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { rating, reviewText, name, email, image } = body;

    // Validate required fields
    if (!rating || !reviewText || !name || !email || !image) {
      return NextResponse.json(
        { success: false, error: "All review fields and user session data are required." },
        { status: 400 }
      );
    }

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found." },
        { status: 404 }
      );
    }

    const newReview = {
      rating: Number(rating),
      reviewText,
      name,
      email,
      image,
      createdAt: new Date(),
    };

    item.reviews.push(newReview);
    await item.save();

    return NextResponse.json(
      { success: true, message: "Review added successfully!", review: newReview },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error adding review:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}