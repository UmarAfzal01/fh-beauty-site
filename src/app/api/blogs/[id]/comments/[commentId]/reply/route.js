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
    const commentId = resolvedParams.commentId;
    const { name, email, message, img } = await request.json(); // <-- Add image here

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const blog = await BLOGMODEL.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
    }

    const newReply = {
      name,
      email,
      message,
      img, // <-- Include image here
      status: 'Active',
      postedAt: new Date(),
    };

    comment.replies.push(newReply);
    await blog.save();

    const addedReply = comment.replies[comment.replies.length - 1];

    return NextResponse.json({ success: true, reply: addedReply }, { status: 201 });
  } catch (err) {
    console.error('Error posting reply:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}