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

export async function GET(
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
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Find the URL
    const url = urls.find(u => u.id === id);
    if (!url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      url
    });

  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URL' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { originalUrl, title, description, tags, isActive } = await request.json();

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

    // Validate URL format if provided
    if (originalUrl) {
      try {
        new URL(originalUrl);
      } catch {
        return NextResponse.json(
          { error: 'Invalid URL format' },
          { status: 400 }
        );
      }
    }

    // Update the URL
    urls[urlIndex] = {
      ...urls[urlIndex],
      originalUrl: originalUrl || urls[urlIndex].originalUrl,
      title: title || urls[urlIndex].title,
      description: description !== undefined ? description : urls[urlIndex].description,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : urls[urlIndex].tags,
      isActive: isActive !== undefined ? isActive : urls[urlIndex].isActive,
      updatedAt: new Date().toISOString()
    };

    // Save updated data
    await writeFile(urlsPath, JSON.stringify(urls, null, 2));

    return NextResponse.json({
      success: true,
      url: urls[urlIndex],
      message: 'URL updated successfully'
    });

  } catch (error) {
    console.error('Error updating URL:', error);
    return NextResponse.json(
      { error: 'Failed to update URL' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Find and remove the URL
    const urlIndex = urls.findIndex(u => u.id === id);
    if (urlIndex === -1) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    const deletedUrl = urls[urlIndex];
    urls.splice(urlIndex, 1);

    // Save updated data
    await writeFile(urlsPath, JSON.stringify(urls, null, 2));

    return NextResponse.json({
      success: true,
      message: 'URL deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting URL:', error);
    return NextResponse.json(
      { error: 'Failed to delete URL' },
      { status: 500 }
    );
  }
}
