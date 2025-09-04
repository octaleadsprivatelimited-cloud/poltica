import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

export async function GET() {
  try {
    const subscribers = await readSubscribers();
    
    // Return only provider credentials for each subscriber
    const providerData = subscribers.map(sub => ({
      id: sub.id,
      name: sub.name,
      email: sub.email,
      phone: sub.phone,
      plan: sub.plan,
      status: sub.status,
      providerCredentials: sub.providerCredentials || {
        whatsapp: {
          provider: 'gupshup',
          apiKey: '',
          phoneNumber: sub.phone,
          webhookUrl: `https://sarpanch-campaign.com/webhooks/whatsapp/${sub.id}`,
          status: 'inactive'
        },
        sms: {
          provider: 'gupshup',
          apiKey: '',
          senderId: sub.name.toUpperCase().substring(0, 6),
          webhookUrl: `https://sarpanch-campaign.com/webhooks/sms/${sub.id}`,
          status: 'inactive'
        },
        ivr: {
          provider: 'exotel',
          apiKey: '',
          phoneNumber: sub.phone,
          webhookUrl: `https://sarpanch-campaign.com/webhooks/ivr/${sub.id}`,
          status: 'inactive'
        }
      }
    }));
    
    return NextResponse.json({
      success: true,
      subscribers: providerData
    });

  } catch (error) {
    console.error('Error fetching provider data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { subscriberId, provider, credentials } = await request.json();

    if (!subscriberId || !provider || !credentials) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const subscribers = await readSubscribers();
    const subscriberIndex = subscribers.findIndex(sub => sub.id === subscriberId);

    if (subscriberIndex === -1) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    // Update provider credentials
    if (!subscribers[subscriberIndex].providerCredentials) {
      subscribers[subscriberIndex].providerCredentials = {
        whatsapp: { provider: 'gupshup', apiKey: '', phoneNumber: '', webhookUrl: '', status: 'inactive' },
        sms: { provider: 'gupshup', apiKey: '', senderId: '', webhookUrl: '', status: 'inactive' },
        ivr: { provider: 'exotel', apiKey: '', phoneNumber: '', webhookUrl: '', status: 'inactive' }
      };
    }

    subscribers[subscriberIndex].providerCredentials[provider] = {
      ...subscribers[subscriberIndex].providerCredentials[provider],
      ...credentials,
      status: 'active'
    };

    await writeSubscribers(subscribers);

    return NextResponse.json({
      success: true,
      message: 'Provider credentials updated successfully'
    });

  } catch (error) {
    console.error('Error updating provider credentials:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { subscriberId, provider } = await request.json();

    if (!subscriberId || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Test provider connection
    const testResult = await testProviderConnection(subscriberId, provider);
    
    return NextResponse.json({
      success: true,
      testResult
    });

  } catch (error) {
    console.error('Error testing provider:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function testProviderConnection(subscriberId: string, provider: string) {
  // Simulate API test - in real implementation, make actual API calls
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const success = Math.random() > 0.3; // 70% success rate for demo
  
  return {
    success,
    message: success ? 'Connection successful' : 'Connection failed',
    timestamp: new Date().toISOString()
  };
}
