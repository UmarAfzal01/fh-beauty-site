import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Update with your DB connection utility
import Category from "@/models/Category";

// GET: Fetch all categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ createdAt: 1 });
    const categoryNames = categories.map((cat) => cat.name);
    return NextResponse.json({ success: true, categories: categoryNames }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add a new category
export async function POST(request) {
  try {
    await dbConnect();
    const { name } = await request.json();
    const formattedName = name.trim().toLowerCase();

    if (!formattedName) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    const existingCategory = await Category.findOne({ name: formattedName });
    if (existingCategory) {
      return NextResponse.json({ success: false, error: "Category already exists" }, { status: 400 });
    }

    const newCategory = await Category.create({ name: formattedName });
    return NextResponse.json({ success: true, category: newCategory.name }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a category
export async function DELETE(request) {
  try {
    await dbConnect();
    const { name } = await request.json();
    
    await Category.findOneAndDelete({ name: name.toLowerCase().trim() });
    return NextResponse.json({ success: true, message: "Category deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}