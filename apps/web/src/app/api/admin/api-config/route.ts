import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const configFilePath = path.join(process.cwd(), 'data', 'api-config.json');

async function readApiConfig(): Promise<any> {
  try {
    const data = await fs.readFile(configFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading API config file:', error);
    return {
      whatsapp: { provider: 'gupshup', apiKey: '', baseUrl: 'https://api.gupshup.io', status: 'inactive' },
      sms: { provider: 'gupshup', apiKey: '', baseUrl: 'https://api.gupshup.io', status: 'inactive' },
      ivr: { provider: 'exotel', apiKey: '', token: '', baseUrl: 'https://api.exotel.com', status: 'inactive' }
    };
  }
}

async function writeApiConfig(config: any): Promise<void> {
  try {
    await fs.writeFile(configFilePath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error writing API config file:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const config = await readApiConfig();
    
    return NextResponse.json({
      success: true,
      config
    });

  } catch (error) {
    console.error('Error fetching API config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { service, credentials } = await request.json();

    if (!service || !credentials) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const config = await readApiConfig();
    
    // Update specific service configuration
    config[service] = {
      ...config[service],
      ...credentials,
      lastUpdated: new Date().toISOString(),
      status: 'active'
    };

    await writeApiConfig(config);

    return NextResponse.json({
      success: true,
      message: `${service} API configuration updated successfully`
    });

  } catch (error) {
    console.error('Error updating API config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { service } = await request.json();

    if (!service) {
      return NextResponse.json(
        { error: 'Missing service parameter' },
        { status: 400 }
      );
    }

    // Test API connection
    const testResult = await testApiConnection(service);
    
    return NextResponse.json({
      success: true,
      testResult
    });

  } catch (error) {
    console.error('Error testing API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function testApiConnection(service: string) {
  // Simulate API test - in real implementation, make actual API calls
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const success = Math.random() > 0.2; // 80% success rate for demo
  
  return {
    success,
    message: success ? 'API connection successful' : 'API connection failed',
    service,
    timestamp: new Date().toISOString()
  };
}
