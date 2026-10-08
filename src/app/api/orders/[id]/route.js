import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Match the same db helper path as your main orders route
import Order from "@/models/Order";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // Await params for Next.js 15+ compatibility

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("API Error fetching single order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(id, body, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error("API Error updating order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("API Error deleting order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}