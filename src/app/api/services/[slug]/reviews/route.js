import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Service from '@/models/Service';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { rating, reviewText, name, email, image } = body;

    // Validate required fields matching your ReviewSchema
    if (!rating || !reviewText || !name || !email || !image) {
      return NextResponse.json(
        { success: false, error: 'All review fields are required.' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find service and push the new review into the reviews array
    const updatedService = await Service.findOneAndUpdate(
      { slug },
      {
        $push: {
          reviews: {
            rating: Number(rating),
            reviewText,
            name,
            email,
            image,
            createdAt: new Date(),
          },
        },
      },
      { new: true, lean: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        { success: false, error: 'Service not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      reviews: updatedService.reviews,
    });
  } catch (err) {
    console.error('Failed to post review:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}