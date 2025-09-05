import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Load subscribers data
    const subscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');
    const subscribersData = await readFile(subscribersPath, 'utf8');
    const subscribers = JSON.parse(subscribersData);
    
    // Find subscriber by slug (uniqueUrl or name-based slug)
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
    
    // Transform subscriber data for the page using real data
    const subscriberData = {
      id: subscriber.id,
      name: subscriber.name,
      email: subscriber.email,
      phone: subscriber.phone,
      location: subscriber.location,
      village: subscriber.village || 'Unknown',
      district: subscriber.district || 'Unknown',
      state: subscriber.state || 'Unknown',
      whatsappNumber: subscriber.whatsappNumber || subscriber.phone,
      campaignFocus: subscriber.campaignFocus || 'Village Development',
      interests: subscriber.interests || ['Development', 'Education', 'Healthcare'],
      bio: subscriber.bio || `Dedicated to serving the people of ${subscriber.village || 'our village'} with focus on development and community welfare.`,
      profileImage: subscriber.profileImage || '/api/placeholder/200/200',
      audioFiles: subscriber.audioFiles || [
        {
          id: '1',
          title: 'Welcome Message',
          description: 'Introduction and vision for the village',
          url: '/audio/welcome-message.mp3',
          duration: 120,
          category: 'Introduction',
          autoPlay: true,
          thumbnail: '/api/placeholder/300/200'
        }
      ],
      videos: subscriber.videos || [
        {
          id: '1',
          title: 'Village Introduction',
          description: 'Learn more about our village and community',
          youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube ID
          thumbnail: '/api/placeholder/300/200',
          duration: '5:30',
          category: 'Introduction'
        }
      ],
      documents: subscriber.documents || [
        {
          id: '1',
          title: 'Development Plan 2025',
          description: 'Comprehensive development plan for the village',
          url: '/documents/development-plan-2025.pdf',
          type: 'pdf',
          size: '2.5 MB',
          category: 'Planning'
        }
      ],
      images: subscriber.images || [
        {
          id: '1',
          title: 'Village Panorama',
          description: 'Beautiful view of our village',
          url: '/api/placeholder/800/600',
          alt: 'Village panorama',
          category: 'Landscape'
        }
      ],
      socialLinks: {
        whatsapp: `https://wa.me/${subscriber.whatsappNumber || subscriber.phone}`,
        phone: `tel:${subscriber.phone}`,
        email: `mailto:${subscriber.email}`
      },
      lastUpdated: subscriber.lastUpdated || new Date().toISOString(),
      // Add real-time metrics
      totalMessages: subscriber.totalMessages || 0,
      whatsappMessages: subscriber.whatsappMessages || 0,
      smsMessages: subscriber.smsMessages || 0,
      ivrCalls: subscriber.ivrCalls || 0,
      linkClicks: subscriber.linkClicks || 0,
      engagementRate: subscriber.engagementRate || 0,
      totalCampaigns: subscriber.totalCampaigns || 0,
      revenue: subscriber.revenue || 0,
      expectedAudience: subscriber.expectedAudience || 0,
      uniqueUrl: subscriber.uniqueUrl || '',
      status: subscriber.status || 'Active',
      joinDate: subscriber.joinDate || new Date().toISOString(),
      lastActive: subscriber.lastActive || new Date().toISOString()
    };
    
    return NextResponse.json(subscriberData);
  } catch (error) {
    console.error('Error fetching subscriber data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriber data' },
      { status: 500 }
    );
  }
}
