import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

interface ManifestoData {
  id: string;
  slug: string;
  subscriberId: string;
  subscriber: {
    name: string;
    phone: string;
    email: string;
    village: string;
    district: string;
    state: string;
    party?: string;
    constituency?: string;
    profileImage?: string;
  };
  manifesto: {
    title: string;
    description: string;
    keyPoints: string[];
    vision: string;
    mission: string;
  };
  media: {
    videos: Array<{
      id: string;
      title: string;
      url: string;
      thumbnail?: string;
      duration?: string;
    }>;
    audios: Array<{
      id: string;
      title: string;
      url: string;
      duration?: string;
    }>;
    images: Array<{
      id: string;
      title: string;
      url: string;
      caption?: string;
    }>;
    documents: Array<{
      id: string;
      title: string;
      url: string;
      type: string;
      size?: string;
    }>;
  };
  election: {
    pollingDate: string;
    pollingTime: string;
    boothNumber?: string;
    wardNumber?: string;
    constituency: string;
    state: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get subscriber ID from session (in a real app, this would come from authentication)
    const subscriberId = request.headers.get('x-subscriber-id') || 'default-subscriber';

    // Load manifestos data
    const manifestosPath = path.join(process.cwd(), 'data', 'manifestos.json');
    let manifestos: ManifestoData[] = [];
    
    try {
      const manifestosData = await readFile(manifestosPath, 'utf8');
      manifestos = JSON.parse(manifestosData);
    } catch (error) {
      return NextResponse.json(
        { error: 'Manifesto not found' },
        { status: 404 }
      );
    }

    // Find the manifesto for this subscriber
    const manifesto = manifestos.find(m => m.subscriberId === subscriberId);
    if (!manifesto) {
      return NextResponse.json(
        { error: 'Manifesto not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      manifesto
    });

  } catch (error) {
    console.error('Error fetching manifesto:', error);
    return NextResponse.json(
      { error: 'Failed to fetch manifesto' },
      { status: 500 }
    );
  }
}
