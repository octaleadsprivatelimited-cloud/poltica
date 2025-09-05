import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

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

export async function POST(request: NextRequest) {
  try {
    const { originalUrl, title, description, tags, subscriberId } = await request.json();
    
    if (!originalUrl || !title || !subscriberId) {
      return NextResponse.json(
        { error: 'Original URL, title, and subscriber ID are required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Verify subscriber exists
    const subscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');
    let subscribers = [];
    
    try {
      const subscribersData = await readFile(subscribersPath, 'utf8');
      subscribers = JSON.parse(subscribersData);
    } catch (error) {
      return NextResponse.json(
        { error: 'Subscribers data not found' },
        { status: 404 }
      );
    }

    const subscriber = subscribers.find((s: any) => s.id === subscriberId);
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    // Load existing URLs
    const urlsPath = path.join(process.cwd(), 'data', 'urls.json');
    let existingUrls: UrlData[] = [];
    
    try {
      const existingData = await readFile(urlsPath, 'utf8');
      existingUrls = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      existingUrls = [];
    }

    // Generate unique short URL
    let shortUrl: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortUrl = nanoid(8); // Generate 8-character short URL
      attempts++;
    } while (
      existingUrls.some(url => url.shortUrl === shortUrl) && 
      attempts < maxAttempts
    );

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'Failed to generate unique short URL. Please try again.' },
        { status: 500 }
      );
    }

    // Create new URL
    const newUrl: UrlData = {
      id: `url_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      shortUrl,
      originalUrl,
      title,
      description: description || '',
      subscriberId,
      clicks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };

    // Add new URL to existing data
    const updatedUrls = [...existingUrls, newUrl];

    // Save updated data
    await writeFile(urlsPath, JSON.stringify(updatedUrls, null, 2));

    return NextResponse.json({
      success: true,
      url: newUrl,
      message: 'URL created successfully for subscriber'
    });

  } catch (error) {
    console.error('Error creating URL:', error);
    return NextResponse.json(
      { error: 'Failed to create URL' },
      { status: 500 }
    );
  }
}
