import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { ABOUTMODEL } from '@/models/About';

// GET: Fetch the About Us document
export async function GET() {
  try {
    await dbConnect();
    let aboutData = await ABOUTMODEL.findOne({});

    if (!aboutData) {
      aboutData = await ABOUTMODEL.create({
        subtitle: '',
        title: '',
        description: '',
        img: '',
        imgalt: '',
        about_detail: [],
      });
    }

    return NextResponse.json({ success: true, about: aboutData }, { status: 200 });
  } catch (error) {
    console.error("GET API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Update or create the single About Us document
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const updatedData = await ABOUTMODEL.findOneAndUpdate(
      {},
      { $set: body },
      { 
        returnDocument: 'after', 
        upsert: true, 
        runValidators: true 
      }
    );

    return NextResponse.json(
      { success: true, message: 'About Us page updated successfully!', about: updatedData },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  return POST(request);
}