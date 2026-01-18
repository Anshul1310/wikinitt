import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';
import slugify from 'slugify';

export async function GET() {
    console.log("hi")
  await dbConnect();
  try {
    // Sort by newest first
   
    const articles = await Article.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // Auto-generate slug from title if not provided
    if (!body.slug && body.title) {
      body.slug = slugify(body.title, { lower: true, strict: true });
    }

    const article = await Article.create(body);
    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}