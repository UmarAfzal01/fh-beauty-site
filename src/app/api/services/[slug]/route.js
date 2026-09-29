import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Service from '@/models/Service';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// PUT: Update an existing service by slug
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    // Await params to unwrap the Promise in Next.js App Router
    const { slug } = await params;
    const body = await request.json();

    // Find the existing service
    let service = await Service.findOne({ slug });

    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    // Update fields
    service.hero = body.hero;
    service.about = body.about;
    service.howItWorks = body.howItWorks;
    service.candidateRequirements = body.candidateRequirements;
    service.faqs = body.faqs;

    // Save will trigger the pre('save') slug generator if the name changed
    await service.save();

    return NextResponse.json({ success: true, service }, { status: 200 });
  } catch (error) {
    console.error('Update Service Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update service' }, { status: 400 });
  }
}