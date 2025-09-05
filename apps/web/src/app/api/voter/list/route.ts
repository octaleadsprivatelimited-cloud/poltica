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

    if (!subscriberId) {
      return NextResponse.json(
        { error: 'Subscriber ID is required' },
        { status: 400 }
      );
    }

    // Load voter data
    const votersPath = path.join(process.cwd(), 'data', 'voters.json');
    let voters = [];
    
    try {
      const votersData = await readFile(votersPath, 'utf8');
      voters = JSON.parse(votersData);
    } catch (error) {
      // File doesn't exist yet, return empty array
      return NextResponse.json({
        success: true,
        voters: [],
        total: 0,
        page: 1,
        totalPages: 0
      });
    }

    // Filter by subscriber ID
    let filteredVoters = voters.filter((voter: any) => voter.subscriberId === subscriberId);

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVoters = filteredVoters.filter((voter: any) =>
        voter.name.toLowerCase().includes(searchLower) ||
        voter.phone.includes(search) ||
        voter.village.toLowerCase().includes(searchLower) ||
        voter.district.toLowerCase().includes(searchLower) ||
        (voter.voterId && voter.voterId.toLowerCase().includes(searchLower))
      );
    }

    // Calculate pagination
    const total = filteredVoters.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVoters = filteredVoters.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      voters: paginatedVoters,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });

  } catch (error) {
    console.error('Error fetching voter data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voter data' },
      { status: 500 }
    );
  }
}
