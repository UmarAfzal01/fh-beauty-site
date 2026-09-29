import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Service from '@/models/Service';

// Helper for DB connection
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// GET: Fetch all services
export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, services }, { status: 200 });
  } catch (error) {
    console.error('Fetch Services Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add a new service
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const newService = await Service.create(body);
    return NextResponse.json({ success: true, service: newService }, { status: 201 });
  } catch (error) {
    console.error('Create Service Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create service' }, { status: 400 });
  }
}