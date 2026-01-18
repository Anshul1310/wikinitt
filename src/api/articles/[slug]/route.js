import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';

export async function GET(request, { params }) {
  await dbConnect();
  const { slug } = await params; // Next.js 15+ requires awaiting params

  try {
    const article = await Article.findOne({ slug });
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}