import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { SERVICE_MODEL } from '@/models/serviceModel';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// POST: Save a new service
export async function POST(request) {
  try {
    await connectDB();
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Service name is required' },
        { status: 400 }
      );
    }

    const newService = await SERVICE_MODEL.create({
      name: name.trim(),
    });

    return NextResponse.json(
      { success: true, service: newService },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error saving service:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// GET: Fetch all services
export async function GET() {
  try {
    await connectDB();
    const services = await SERVICE_MODEL.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, services },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching services:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}