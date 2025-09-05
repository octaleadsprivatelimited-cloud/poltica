import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriberId = searchParams.get('subscriberId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';

    // Load URLs data
    const urlsPath = path.join(process.cwd(), 'data', 'urls.json');
    let urls = [];
    
    try {
      const urlsData = await readFile(urlsPath, 'utf8');
      urls = JSON.parse(urlsData);
    } catch (error) {
      // File doesn't exist yet, return empty array
      return NextResponse.json({
        success: true,
        urls: [],
        total: 0,
        page: 1,
        totalPages: 0
      });
    }

    // Filter by subscriber ID if provided
    let filteredUrls = urls;
    if (subscriberId) {
      filteredUrls = urls.filter((url: any) => url.subscriberId === subscriberId);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUrls = filteredUrls.filter((url: any) =>
        url.title.toLowerCase().includes(searchLower) ||
        url.originalUrl.toLowerCase().includes(searchLower) ||
        url.shortUrl.toLowerCase().includes(searchLower) ||
        (url.description && url.description.toLowerCase().includes(searchLower)) ||
        (url.tags && url.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Calculate pagination
    const total = filteredUrls.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUrls = filteredUrls.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      urls: paginatedUrls,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });

  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URLs' },
      { status: 500 }
    );
  }
}
