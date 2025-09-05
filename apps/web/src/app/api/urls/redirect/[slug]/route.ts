import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

interface UrlData {
  id: string;
  shortUrl: string;
  originalUrl: string;
  title: string;
  description?: string;
  subscriberId: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  tags?: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Load URLs data
    const urlsPath = path.join(process.cwd(), 'data', 'urls.json');
    let urls: UrlData[] = [];
    
    try {
      const urlsData = await readFile(urlsPath, 'utf8');
      urls = JSON.parse(urlsData);
    } catch (error) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Find the URL by short URL
    const url = urls.find(u => u.shortUrl === slug);
    if (!url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Check if URL is active
    if (!url.isActive) {
      return NextResponse.json(
        { error: 'URL is inactive' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      url
    });

  } catch (error) {
    console.error('Error fetching URL for redirect:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URL' },
      { status: 500 }
    );
  }
}
