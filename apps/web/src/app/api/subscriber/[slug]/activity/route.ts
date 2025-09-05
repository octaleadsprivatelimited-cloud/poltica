import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Load subscribers data to get real metrics
    const subscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');
    const subscribersData = await readFile(subscribersPath, 'utf8');
    const subscribers = JSON.parse(subscribersData);
    
    // Find subscriber by slug
    const subscriber = subscribers.find((sub: any) => 
      sub.uniqueUrl?.includes(slug) || 
      sub.name.toLowerCase().replace(/\s+/g, '-') === slug
    );
    
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    // Calculate real metrics from subscriber data
    const whatsappTotal = subscriber.whatsappMessages || 0;
    const smsTotal = subscriber.smsMessages || 0;
    const ivrTotal = subscriber.ivrCalls || 0;
    const clicksTotal = subscriber.linkClicks || 0;
    
    // Calculate weekly growth (simulate based on total)
    const whatsappGrowth = Math.floor(whatsappTotal * 0.12);
    const smsGrowth = Math.floor(smsTotal * 0.08);
    const ivrGrowth = Math.floor(ivrTotal * 0.15);
    const clicksGrowth = Math.floor(clicksTotal * 0.22);
    
    // Calculate this week's activity (simulate)
    const whatsappThisWeek = Math.floor(whatsappTotal * 0.08);
    const smsThisWeek = Math.floor(smsTotal * 0.08);
    const ivrThisWeek = Math.floor(ivrTotal * 0.15);
    const clicksThisWeek = Math.floor(clicksTotal * 0.13);
    
    // Calculate delivery rates (realistic estimates)
    const whatsappDelivered = Math.floor(whatsappTotal * 0.98);
    const whatsappRead = Math.floor(whatsappTotal * 0.78);
    const whatsappReplied = Math.floor(whatsappTotal * 0.16);
    const smsDelivered = Math.floor(smsTotal * 0.95);
    const smsFailed = smsTotal - smsDelivered;
    const ivrAnswered = Math.floor(ivrTotal * 0.84);
    const ivrCompleted = Math.floor(ivrTotal * 0.76);
    const ivrMissed = ivrTotal - ivrAnswered;
    
    // Generate heat map data based on actual clicks
    const baseClicks = Math.floor(clicksTotal / 28);
    const heatMapData = Array.from({ length: 28 }, (_, i) => {
      const variation = Math.floor(Math.random() * 20) - 10; // -10 to +10 variation
      const clicks = Math.max(0, baseClicks + variation);
      return {
        day: i + 1,
        clicks: clicks,
        date: new Date(Date.now() - (27 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
    });
    
    // Calculate content stats based on subscriber data
    const contentStats = {
      images: { 
        total: subscriber.images?.length || 0, 
        thisWeek: Math.floor((subscriber.images?.length || 0) * 0.25),
        views: Math.floor((subscriber.images?.length || 0) * 100)
      },
      videos: { 
        total: subscriber.videos?.length || 0, 
        thisWeek: Math.floor((subscriber.videos?.length || 0) * 0.125),
        views: Math.floor((subscriber.videos?.length || 0) * 110)
      },
      documents: { 
        total: subscriber.documents?.length || 0, 
        thisWeek: Math.floor((subscriber.documents?.length || 0) * 0.4),
        downloads: Math.floor((subscriber.documents?.length || 0) * 68)
      },
      audio: { 
        total: subscriber.audioFiles?.length || 0, 
        thisWeek: Math.floor((subscriber.audioFiles?.length || 0) * 0.33),
        plays: Math.floor((subscriber.audioFiles?.length || 0) * 223)
      }
    };
    
    const activityData = {
      whatsappMessages: {
        total: whatsappTotal,
        thisWeek: whatsappThisWeek,
        growth: whatsappGrowth,
        delivered: whatsappDelivered,
        read: whatsappRead,
        replied: whatsappReplied
      },
      smsMessages: {
        total: smsTotal,
        thisWeek: smsThisWeek,
        growth: smsGrowth,
        delivered: smsDelivered,
        failed: smsFailed
      },
      ivrCalls: {
        total: ivrTotal,
        thisWeek: ivrThisWeek,
        growth: ivrGrowth,
        answered: ivrAnswered,
        completed: ivrCompleted,
        missed: ivrMissed
      },
      urlClicks: {
        total: clicksTotal,
        thisWeek: clicksThisWeek,
        growth: clicksGrowth,
        uniqueClicks: Math.floor(clicksTotal * 0.85),
        topPages: [
          { url: '/welcome', clicks: Math.floor(clicksTotal * 0.13), title: 'Welcome Page' },
          { url: '/development', clicks: Math.floor(clicksTotal * 0.09), title: 'Development Plans' },
          { url: '/contact', clicks: Math.floor(clicksTotal * 0.08), title: 'Contact Info' }
        ]
      },
      heatMapData,
      contentStats
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
