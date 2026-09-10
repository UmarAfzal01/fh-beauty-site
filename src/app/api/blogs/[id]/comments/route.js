import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { BLOGMODEL } from '@/models/blogModel'; // Adjust path if your model is located elsewhere

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const blogId = resolvedParams.id;
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const blog = await BLOGMODEL.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const newComment = {
      name,
      email,
      message,
      status: 'Active',
      postedAt: new Date(),
      replies: [],
    };

    blog.comments.push(newComment);
    await blog.save();

    return NextResponse.json({ success: true, comments: blog.comments }, { status: 201 });
  } catch (err) {
    console.error('Error posting comment:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}