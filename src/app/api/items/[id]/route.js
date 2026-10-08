import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Item } from "@/models/Item";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// 1. GET: Fetch a single item by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const item = await Item.findById(id).lean();
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch item:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 2. PUT: Update an existing item by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const body = await request.json();
    
    // Update and return the new document
    const updatedItem = await Item.findByIdAndUpdate(
      id, 
      { ...body, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    ).lean();

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (err) {
    console.error("Failed to update item:", err);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// 3. DELETE: Remove an item by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const deletedItem = await Item.findByIdAndDelete(id).lean();

    if (!deletedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Failed to delete item:", err);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}