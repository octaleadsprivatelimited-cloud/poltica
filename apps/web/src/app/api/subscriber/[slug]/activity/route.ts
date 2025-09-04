import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Mock activity data - in production, this would come from analytics database
    const activityData = {
      whatsappMessages: {
        total: 2847,
        thisWeek: 234,
        growth: 12,
        delivered: 2750,
        read: 2200,
        replied: 450
      },
      smsMessages: {
        total: 1234,
        thisWeek: 98,
        growth: 8,
        delivered: 1200,
        failed: 34
      },
      ivrCalls: {
        total: 456,
        thisWeek: 67,
        growth: 15,
        answered: 420,
        completed: 380,
        missed: 36
      },
      urlClicks: {
        total: 3421,
        thisWeek: 456,
        growth: 22,
        uniqueClicks: 2890,
        topPages: [
          { url: '/welcome', clicks: 450, title: 'Welcome Page' },
          { url: '/development', clicks: 320, title: 'Development Plans' },
          { url: '/contact', clicks: 280, title: 'Contact Info' }
        ]
      },
      heatMapData: Array.from({ length: 28 }, (_, i) => ({
        day: i + 1,
        clicks: Math.floor(Math.random() * 100),
        date: new Date(Date.now() - (27 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })),
      contentStats: {
        images: { total: 12, thisWeek: 3, views: 1250 },
        videos: { total: 8, thisWeek: 1, views: 890 },
        documents: { total: 5, thisWeek: 2, downloads: 340 },
        audio: { total: 3, thisWeek: 1, plays: 670 }
      }
    };
    
    return NextResponse.json(activityData);
  } catch (error) {
    console.error('Error fetching activity data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity data' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    
    // In production, this would save to database
    console.log('Adding content for subscriber:', slug, body);
    
    // Mock response
    return NextResponse.json({
      success: true,
      message: 'Content added successfully',
      contentId: `content_${Date.now()}`
    });
  } catch (error) {
    console.error('Error adding content:', error);
    return NextResponse.json(
      { error: 'Failed to add content' },
      { status: 500 }
    );
  }
}
