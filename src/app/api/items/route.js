import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Item } from '@/models/Item';

// Helper function to slugify if needed server-side
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// POST: Create a new item / service / product
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { type, name, slug, images, description, price, cutPrice, sku, options, sections } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: 'Item name is required' },
        { status: 400 }
      );
    }

    const itemSlug = slug && slug.trim() ? slugify(slug) : slugify(name);

    // Check if slug already exists
    const existingItem = await Item.findOne({ slug: itemSlug });
    if (existingItem) {
      return NextResponse.json(
        { message: 'An item with this slug already exists. Please use a unique slug.' },
        { status: 400 }
      );
    }

    // Create item in MongoDB
    const newItem = await Item.create({
      type: type || 'Service',
      name: name.trim(),
      slug: itemSlug,
      images: images || [],
      description: description || '',
      price: price !== '' && price !== undefined ? Number(price) : undefined,
      cutPrice: cutPrice !== '' && cutPrice !== undefined ? Number(cutPrice) : undefined,
      sku: type === 'Product' ? sku : undefined,
      options: type === 'Product' ? (options || []) : [],
      sections: sections || [],
    });

    return NextResponse.json(
      { message: 'Item created successfully', item: newItem },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error [POST /api/items]:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all items
export async function GET(request) {
  try {
    await dbConnect();

    const items = await Item.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, items },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error [GET /api/items]:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}