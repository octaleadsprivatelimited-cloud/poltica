import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    // Find the manifesto
    const manifesto = manifestos.find(m => m.id === id);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { 
      manifesto: manifestoData, 
      election, 
      social 
    } = await request.json();

    // Load manifestos data
    const manifestosPath = path.join(process.cwd(), 'data', 'manifestos.json');
    let manifestos: ManifestoData[] = [];
    
    try {
      const manifestosData = await readFile(manifestosPath, 'utf8');
      manifestos = JSON.parse(manifestosData);
    } catch (error) {
      return NextResponse.json(
        { error: 'Manifestos data not found' },
        { status: 404 }
      );
    }

    // Find the manifesto
    const manifestoIndex = manifestos.findIndex(m => m.id === id);
    if (manifestoIndex === -1) {
      return NextResponse.json(
        { error: 'Manifesto not found' },
        { status: 404 }
      );
    }

    // Update the manifesto
    manifestos[manifestoIndex] = {
      ...manifestos[manifestoIndex],
      manifesto: {
        ...manifestos[manifestoIndex].manifesto,
        ...manifestoData
      },
      election: {
        ...manifestos[manifestoIndex].election,
        ...election
      },
      social: {
        ...manifestos[manifestoIndex].social,
        ...social
      },
      updatedAt: new Date().toISOString()
    };

    // Save updated data
    await writeFile(manifestosPath, JSON.stringify(manifestos, null, 2));

    return NextResponse.json({
      success: true,
      manifesto: manifestos[manifestoIndex],
      message: 'Manifesto updated successfully'
    });

  } catch (error) {
    console.error('Error updating manifesto:', error);
    return NextResponse.json(
      { error: 'Failed to update manifesto' },
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

    // Load manifestos data
    const manifestosPath = path.join(process.cwd(), 'data', 'manifestos.json');
    let manifestos: ManifestoData[] = [];
    
    try {
      const manifestosData = await readFile(manifestosPath, 'utf8');
      manifestos = JSON.parse(manifestosData);
    } catch (error) {
      return NextResponse.json(
        { error: 'Manifestos data not found' },
        { status: 404 }
      );
    }

    // Find and remove the manifesto
    const manifestoIndex = manifestos.findIndex(m => m.id === id);
    if (manifestoIndex === -1) {
      return NextResponse.json(
        { error: 'Manifesto not found' },
        { status: 404 }
      );
    }

    const deletedManifesto = manifestos[manifestoIndex];
    manifestos.splice(manifestoIndex, 1);

    // Save updated data
    await writeFile(manifestosPath, JSON.stringify(manifestos, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Manifesto deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting manifesto:', error);
    return NextResponse.json(
      { error: 'Failed to delete manifesto' },
      { status: 500 }
    );
  }
}
