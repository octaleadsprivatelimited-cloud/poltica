import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

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

export async function POST(request: NextRequest) {
  try {
    const { 
      subscriberId, 
      manifesto, 
      media, 
      election, 
      social 
    } = await request.json();
    
    if (!subscriberId || !manifesto || !election) {
      return NextResponse.json(
        { error: 'Subscriber ID, manifesto, and election data are required' },
        { status: 400 }
      );
    }

    // Load subscribers to get subscriber data
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

    // Load existing manifestos
    const manifestosPath = path.join(process.cwd(), 'data', 'manifestos.json');
    let existingManifestos: ManifestoData[] = [];
    
    try {
      const existingData = await readFile(manifestosPath, 'utf8');
      existingManifestos = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      existingManifestos = [];
    }

    // Check if subscriber already has a manifesto
    const existingManifesto = existingManifestos.find(m => m.subscriberId === subscriberId);
    if (existingManifesto) {
      return NextResponse.json(
        { error: 'Subscriber already has a manifesto. Use update endpoint instead.' },
        { status: 400 }
      );
    }

    // Generate slug using village/username format
    const village = subscriber.village.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const username = subscriber.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    let slug = `${village}/${username}`;
    
    // Check if slug already exists and make it unique if needed
    let attempts = 0;
    const maxAttempts = 10;
    let originalSlug = slug;

    while (existingManifestos.some(m => m.slug === slug) && attempts < maxAttempts) {
      attempts++;
      slug = `${originalSlug}-${attempts}`;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'Failed to generate unique slug. Please try again.' },
        { status: 500 }
      );
    }

    // Create new manifesto
    const newManifesto: ManifestoData = {
      id: `manifesto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      slug,
      subscriberId,
      subscriber: {
        name: subscriber.name,
        phone: subscriber.phone,
        email: subscriber.email,
        village: subscriber.village,
        district: subscriber.district,
        state: subscriber.state,
        party: subscriber.party,
        constituency: subscriber.constituency,
        profileImage: subscriber.profileImage
      },
      manifesto: {
        title: manifesto.title || `${subscriber.name}'s Election Manifesto`,
        description: manifesto.description || '',
        keyPoints: manifesto.keyPoints || [],
        vision: manifesto.vision || '',
        mission: manifesto.mission || ''
      },
      media: {
        videos: media?.videos || [],
        audios: media?.audios || [],
        images: media?.images || [],
        documents: media?.documents || []
      },
      election: {
        pollingDate: election.pollingDate,
        pollingTime: election.pollingTime,
        boothNumber: election.boothNumber,
        wardNumber: election.wardNumber,
        constituency: election.constituency || subscriber.constituency || subscriber.village,
        state: election.state || subscriber.state
      },
      social: {
        facebook: social?.facebook,
        twitter: social?.twitter,
        instagram: social?.instagram,
        youtube: social?.youtube,
        website: social?.website
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add new manifesto to existing data
    const updatedManifestos = [...existingManifestos, newManifesto];

    // Save updated data
    await writeFile(manifestosPath, JSON.stringify(updatedManifestos, null, 2));

    return NextResponse.json({
      success: true,
      manifesto: newManifesto,
      message: 'Manifesto created successfully'
    });

  } catch (error) {
    console.error('Error creating manifesto:', error);
    return NextResponse.json(
      { error: 'Failed to create manifesto' },
      { status: 500 }
    );
  }
}
