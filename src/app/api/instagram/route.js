import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const IG_USER_ID = process.env.INSTAGRAM_USER_ID;
    const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!IG_USER_ID || !ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, error: "Instagram credentials not configured" },
        { status: 500 }
      );
    }

    // Updated domain from graph.facebook.com to graph.instagram.com
    const url = `https://graph.instagram.com/v18.0/${IG_USER_ID}/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url&limit=6&access_token=${ACCESS_TOKEN}`;
    
    const response = await fetch(url, { next: { revalidate: 3600 } });
    const data = await response.json();

    if (data.error) {
      console.error("Instagram API Error:", data.error);
      return NextResponse.json({ success: false, error: data.error.message }, { status: 400 });
    }

    const posts = (data.data || []).map((post) => ({
      id: post.id,
      src: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      alt: post.caption ? post.caption.slice(0, 100) : 'Instagram Post',
      permalink: post.permalink || 'https://instagram.com',
    }));

    return NextResponse.json({ success: true, posts }, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch Instagram feed:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}