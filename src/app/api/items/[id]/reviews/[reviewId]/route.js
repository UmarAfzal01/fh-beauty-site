import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Item } from "@/models/Item";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id, reviewId } = await params;

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found." }, { status: 404 });
    }

    // Filter out the review to be deleted
    item.reviews = item.reviews.filter((rev) => rev._id.toString() !== reviewId);
    await item.save();

    return NextResponse.json({ success: true, message: "Review deleted successfully.", item }, { status: 200 });
  } catch (error) {
    console.error("API Error deleting review:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error." }, { status: 500 });
  }
}