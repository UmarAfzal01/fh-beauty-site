import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { SERVICE_MODEL } from '@/models/serviceModel';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// PUT: Rename/Update a service
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Service name is required' },
        { status: 400 }
      );
    }

    const updatedService = await SERVICE_MODEL.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, service: updatedService },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating service:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a service
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const deletedService = await SERVICE_MODEL.findByIdAndDelete(id);

    if (!deletedService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Service deleted successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error deleting service:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}