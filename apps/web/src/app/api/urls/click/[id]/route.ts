import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Load URLs data
    const urlsPath = path.join(process.cwd(), 'data', 'urls.json');
    let urls: UrlData[] = [];
    
    try {
      const urlsData = await readFile(urlsPath, 'utf8');
      urls = JSON.parse(urlsData);
    } catch (error) {
      return NextResponse.json(
        { error: 'URLs data not found' },
        { status: 404 }
      );
    }

    // Find the URL
    const urlIndex = urls.findIndex(u => u.id === id);
    if (urlIndex === -1) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Increment click count
    urls[urlIndex].clicks += 1;
    urls[urlIndex].updatedAt = new Date().toISOString();

    // Save updated data
    await writeFile(urlsPath, JSON.stringify(urls, null, 2));

    return NextResponse.json({
      success: true,
      clicks: urls[urlIndex].clicks,
      message: 'Click recorded successfully'
    });

  } catch (error) {
    console.error('Error recording click:', error);
    return NextResponse.json(
      { error: 'Failed to record click' },
      { status: 500 }
    );
  }
}
