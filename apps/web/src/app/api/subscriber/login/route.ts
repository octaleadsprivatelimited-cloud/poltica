import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    
    if (!phone) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      );
    }

    // Load subscribers data
    const subscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');
    const subscribersData = await readFile(subscribersPath, 'utf8');
    const subscribers = JSON.parse(subscribersData);
    
    // Find subscriber by phone number
    const subscriber = subscribers.find((sub: any) => {
      const subPhone = sub.phone?.replace(/\D/g, '') || '';
      const subWhatsapp = sub.whatsappNumber?.replace(/\D/g, '') || '';
      return subPhone === cleanPhone || subWhatsapp === cleanPhone;
    });
    
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found. Please check your mobile number or contact support.' },
        { status: 404 }
      );
    }

    // Return subscriber data (without sensitive information)
    const subscriberData = {
      id: subscriber.id,
      name: subscriber.name,
      email: subscriber.email,
      phone: subscriber.phone,
      whatsappNumber: subscriber.whatsappNumber,
      location: subscriber.location,
      village: subscriber.village,
      district: subscriber.district,
      state: subscriber.state,
      campaignFocus: subscriber.campaignFocus,
      interests: subscriber.interests,
      bio: subscriber.bio,
      plan: subscriber.plan,
      status: subscriber.status,
      joinDate: subscriber.joinDate,
      lastActive: subscriber.lastActive,
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
      audioFiles: subscriber.audioFiles || [],
      videos: subscriber.videos || [],
      documents: subscriber.documents || [],
      images: subscriber.images || [],
      socialLinks: {
        whatsapp: `https://wa.me/${subscriber.whatsappNumber || subscriber.phone}`,
        phone: `tel:${subscriber.phone}`,
        email: `mailto:${subscriber.email}`
      }
    };
    
    return NextResponse.json({
      success: true,
      subscriber: subscriberData,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error in subscriber login:', error);
    return NextResponse.json(
      { error: 'Failed to process login request' },
      { status: 500 }
    );
  }
}
