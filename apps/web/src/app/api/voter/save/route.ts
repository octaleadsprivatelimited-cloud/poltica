import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

interface VoterData {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  age?: number;
  gender?: string;
  voterId?: string;
  booth?: string;
  ward?: string;
  subscriberId: string;
  createdAt: string;
  updatedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const { voters } = await request.json();
    
    if (!voters || !Array.isArray(voters) || voters.length === 0) {
      return NextResponse.json(
        { error: 'No voter data provided' },
        { status: 400 }
      );
    }

    // Get subscriber ID from session (in a real app, this would come from authentication)
    // For now, we'll use a default subscriber ID or get it from request headers
    const subscriberId = request.headers.get('x-subscriber-id') || 'default-subscriber';

    // Load existing voter data
    const votersPath = path.join(process.cwd(), 'data', 'voters.json');
    let existingVoters: VoterData[] = [];
    
    try {
      const existingData = await readFile(votersPath, 'utf8');
      existingVoters = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      existingVoters = [];
    }

    // Generate IDs and timestamps for new voters
    const newVoters: VoterData[] = voters.map((voter: any) => ({
      id: `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...voter,
      subscriberId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Check for duplicates based on phone number
    const existingPhones = new Set(existingVoters.map(v => v.phone));
    const duplicateVoters = newVoters.filter(v => existingPhones.has(v.phone));
    
    if (duplicateVoters.length > 0) {
      return NextResponse.json(
        { 
          error: 'Duplicate voters found',
          duplicates: duplicateVoters.map(v => ({ name: v.name, phone: v.phone })),
          message: `Found ${duplicateVoters.length} voters with existing phone numbers`
        },
        { status: 400 }
      );
    }

    // Add new voters to existing data
    const updatedVoters = [...existingVoters, ...newVoters];

    // Save updated data
    await writeFile(votersPath, JSON.stringify(updatedVoters, null, 2));

    // Update subscriber's voter count
    await updateSubscriberVoterCount(subscriberId, newVoters.length);

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${newVoters.length} voter records`,
      totalVoters: updatedVoters.length,
      newVoters: newVoters.length
    });

  } catch (error) {
    console.error('Error saving voter data:', error);
    return NextResponse.json(
      { error: 'Failed to save voter data' },
      { status: 500 }
    );
  }
}

async function updateSubscriberVoterCount(subscriberId: string, newVoterCount: number) {
  try {
    // Load subscribers data
    const subscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');
    const subscribersData = await readFile(subscribersPath, 'utf8');
    const subscribers = JSON.parse(subscribersData);
    
    // Find and update subscriber
    const subscriberIndex = subscribers.findIndex((sub: any) => sub.id === subscriberId);
    if (subscriberIndex !== -1) {
      subscribers[subscriberIndex].totalVoters = (subscribers[subscriberIndex].totalVoters || 0) + newVoterCount;
      subscribers[subscriberIndex].lastUpdated = new Date().toISOString();
      
      // Save updated subscribers
      await writeFile(subscribersPath, JSON.stringify(subscribers, null, 2));
    }
  } catch (error) {
    console.error('Error updating subscriber voter count:', error);
    // Don't throw error here as it's not critical
  }
}
