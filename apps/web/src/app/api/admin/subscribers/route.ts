import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// State abbreviation mapping for subscriber ID generation
const STATE_ABBREVIATIONS: Record<string, string> = {
  'andhra pradesh': 'AP',
  'arunachal pradesh': 'AR',
  'assam': 'AS',
  'bihar': 'BR',
  'chhattisgarh': 'CG',
  'goa': 'GA',
  'gujarat': 'GJ',
  'haryana': 'HR',
  'himachal pradesh': 'HP',
  'jharkhand': 'JH',
  'karnataka': 'KA',
  'kerala': 'KL',
  'madhya pradesh': 'MP',
  'maharashtra': 'MH',
  'manipur': 'MN',
  'meghalaya': 'ML',
  'mizoram': 'MZ',
  'nagaland': 'NL',
  'odisha': 'OD',
  'punjab': 'PB',
  'rajasthan': 'RJ',
  'sikkim': 'SK',
  'tamil nadu': 'TN',
  'telangana': 'TG',
  'tripura': 'TR',
  'uttar pradesh': 'UP',
  'uttarakhand': 'UK',
  'west bengal': 'WB',
  'andaman and nicobar islands': 'AN',
  'chandigarh': 'CH',
  'dadra and nagar haveli and daman and diu': 'DN',
  'delhi': 'DL',
  'jammu and kashmir': 'JK',
  'ladakh': 'LA',
  'lakshadweep': 'LD',
  'puducherry': 'PY'
};

function getStateAbbreviation(state: string): string {
  const normalizedState = state.toLowerCase().trim();
  return STATE_ABBREVIATIONS[normalizedState] || 'XX';
}

function generateSubscriberId(state: string, phoneNumber: string): string {
  const stateCode = getStateAbbreviation(state);
  const currentYear = new Date().getFullYear().toString().slice(-2); // Last 2 digits of year
  const last4Digits = phoneNumber.replace(/\D/g, '').slice(-4); // Last 4 digits of phone number
  
  return `${stateCode}${currentYear}${last4Digits}`;
}

interface SubscriberData {
  name: string;
  email: string;
  phone: string;
  location: string;
  plan: 'Basic' | 'Standard' | 'Premium';
  teamSize: number;
  village: string;
  district: string;
  state: string;
  pincode: string;
  whatsappNumber: string;
  campaignFocus: string;
  expectedAudience: number;
  budget: number;
  messageLimits: {
    sms: number;
    ivr: number;
    whatsapp: number;
  };
  createManifesto?: boolean;
  manifestoTitle?: string;
  manifestoDescription?: string;
  pollingDate?: string;
  pollingTime?: string;
  boothNumber?: string;
  wardNumber?: string;
  constituency?: string;
  party?: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'subscribers.json');

async function readSubscribers(): Promise<any[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscribers file:', error);
    return [];
  }
}

async function writeSubscribers(subscribers: any[]): Promise<void> {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(subscribers, null, 2));
  } catch (error) {
    console.error('Error writing subscribers file:', error);
    throw error;
  }
}

function generateUniqueUrl(subscriberName: string): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const cleanName = subscriberName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `https://sarpanch-campaign.com/${cleanName}-${randomId}`;
}

export async function POST(request: NextRequest) {
  try {
    const data: SubscriberData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.village) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Read existing subscribers
    const subscribers = await readSubscribers();

    // Generate unique subscriber ID based on state and phone
    const subscriberId = generateSubscriberId(data.state, data.phone);

    // Generate unique URL
    const uniqueUrl = generateUniqueUrl(data.name);

    const newSubscriber = {
      id: subscriberId,
      ...data,
      uniqueUrl,
      status: 'Active',
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      totalCampaigns: 0,
      totalMessages: 0,
      revenue: 0,
      whatsappMessages: 0,
      smsMessages: 0,
      ivrCalls: 0,
      linkClicks: 0,
      engagementRate: 0,
      avgResponseTime: 0,
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      paymentStatus: 'Trial' as const,
      // Message usage tracking
      messageUsage: {
        sms: 0,
        ivr: 0,
        whatsapp: 0,
      },
      // Monthly reset tracking
      lastResetDate: new Date().toISOString(),
    };

    // Add to subscribers array
    subscribers.push(newSubscriber);

    // Write back to file
    await writeSubscribers(subscribers);
    console.log('New subscriber created:', newSubscriber);

    // Create manifesto if requested
    if (data.createManifesto && data.manifestoTitle && data.manifestoDescription) {
      try {
        const manifestoData = {
          subscriberId: subscriberId,
          manifesto: {
            title: data.manifestoTitle,
            description: data.manifestoDescription,
            keyPoints: [],
            vision: '',
            mission: ''
          },
          election: {
            pollingDate: data.pollingDate || '',
            pollingTime: data.pollingTime || '',
            boothNumber: data.boothNumber || '',
            wardNumber: data.wardNumber || '',
            constituency: data.constituency || data.village,
            state: data.state
          },
          social: {
            facebook: '',
            twitter: '',
            instagram: '',
            youtube: '',
            website: ''
          },
          media: {
            videos: [],
            audios: [],
            images: [],
            documents: []
          }
        };

        // Create manifesto via API
        const manifestoResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/manifesto/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(manifestoData),
        });

        if (manifestoResponse.ok) {
          const manifestoResult = await manifestoResponse.json();
          console.log('Manifesto created:', manifestoResult);
        } else {
          console.error('Failed to create manifesto:', await manifestoResponse.text());
        }
      } catch (error) {
        console.error('Error creating manifesto:', error);
        // Don't fail the subscriber creation if manifesto creation fails
      }
    }

    return NextResponse.json({
      success: true,
      subscriber: newSubscriber,
      message: 'Subscriber added successfully'
    });

  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Read subscribers from file
    const subscribers = await readSubscribers();
    
    return NextResponse.json({
      success: true,
      subscribers
    });

  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
