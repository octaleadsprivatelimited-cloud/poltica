import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES, createWhatsAppProvider, createSMSProvider, createIVRProvider } from '@sarpanch-campaign/lib';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'subscribers.json');
const configFilePath = path.join(process.cwd(), 'data', 'api-config.json');

async function readSubscribers(): Promise<any[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscribers file:', error);
    return [];
  }
}

async function readApiConfig(): Promise<any> {
  try {
    const data = await fs.readFile(configFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading API config file:', error);
    return {
      whatsapp: { provider: 'gupshup', apiKey: '', baseUrl: 'https://api.gupshup.io' },
      sms: { provider: 'gupshup', apiKey: '', baseUrl: 'https://api.gupshup.io' },
      ivr: { provider: 'exotel', apiKey: '', token: '', baseUrl: 'https://api.exotel.com' }
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { batchSize = 100 } = await request.json();

    // Get queued dispatches
    const { data: dispatches, error: fetchError } = await supabaseAdmin
      ?.from(TABLES.DISPATCHES)
      .select(`
        *,
        campaigns!inner(*),
        audience!inner(*),
        templates!inner(*)
      `)
      .eq('status', 'queued')
      .limit(batchSize);

    if (fetchError) {
      console.error('Error fetching dispatches:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch dispatches' }, { status: 500 });
    }

    if (!dispatches || dispatches.length === 0) {
      return NextResponse.json({ success: true, processed: 0 });
    }

    console.log(`Processing ${dispatches.length} dispatches`);

    // Load shared API configuration and subscribers
    const [apiConfig, subscribers] = await Promise.all([
      readApiConfig(),
      readSubscribers()
    ]);

    const results = [];

    for (const dispatch of dispatches) {
      try {
        const { current_channel, campaigns, audience, templates } = dispatch;
        
        // Find subscriber for this campaign
        const subscriber = subscribers.find(sub => sub.id === campaigns.subscriber_id);
        if (!subscriber || !subscriber.providerSettings) {
          console.error(`No subscriber or settings found for campaign ${campaigns.id}`);
          continue;
        }

        // Get shared API config for current channel
        const sharedConfig = apiConfig[current_channel];
        if (!sharedConfig || sharedConfig.status !== 'active') {
          console.error(`No active shared API config found for ${current_channel}`);
          continue;
        }

        // Get subscriber-specific settings for current channel
        const subscriberSettings = subscriber.providerSettings[current_channel];
        if (!subscriberSettings || subscriberSettings.status !== 'active') {
          console.error(`No active subscriber settings found for ${current_channel} for subscriber ${subscriber.id}`);
          continue;
        }
        
        // Find template for current channel
        const template = templates.find(t => t.channel === current_channel);
        if (!template) {
          console.error(`No template found for channel ${current_channel}`);
          continue;
        }

        // Initialize provider with shared API keys and subscriber-specific settings
        let result;
        
        switch (current_channel) {
          case 'whatsapp':
            const whatsappProvider = createWhatsAppProvider({
              apiKey: sharedConfig.apiKey,
              phoneNumber: subscriberSettings.phoneNumber,
              webhookUrl: subscriberSettings.webhookUrl,
              subscriberId: subscriber.id,
              subscriberName: subscriber.name,
              baseUrl: sharedConfig.baseUrl
            });
            
            result = await whatsappProvider.sendTemplate({
              to: audience.phone,
              templateCode: template.content, // Assuming content contains template code
              variables: {
                candidate_name: subscriber.name,
                // Add more variables based on template.variables
              },
            });
            break;
            
          case 'sms':
            const smsProvider = createSMSProvider({
              apiKey: sharedConfig.apiKey,
              senderId: subscriberSettings.senderId,
              webhookUrl: subscriberSettings.webhookUrl,
              subscriberId: subscriber.id,
              subscriberName: subscriber.name,
              baseUrl: sharedConfig.baseUrl
            });
            
            result = await smsProvider.send({
              to: audience.phone,
              text: template.content,
            });
            break;
            
          case 'ivr':
            const ivrProvider = createIVRProvider({
              apiKey: sharedConfig.apiKey,
              source: sharedConfig.token,
              phoneNumber: subscriberSettings.phoneNumber,
              webhookUrl: subscriberSettings.webhookUrl,
              subscriberId: subscriber.id,
              subscriberName: subscriber.name,
              baseUrl: sharedConfig.baseUrl
            });
            
            result = await ivrProvider.call({
              to: audience.phone,
              campaignId: dispatch.campaign_id,
              ttsScript: template.content,
            });
            break;
            
          default:
            console.error(`Unknown channel: ${current_channel}`);
            continue;
        }

        // Update dispatch with result
        const updateData: any = {
          status: result.success ? 'sent' : 'failed',
          updated_at: new Date().toISOString(),
        };

        if (result.success && result.messageId) {
          updateData.provider_message_id = result.messageId;
          updateData.sent_at = new Date().toISOString();
        }

        await supabaseAdmin
          ?.from(TABLES.DISPATCHES)
          .update(updateData)
          .eq('id', dispatch.id);

        results.push({
          dispatchId: dispatch.id,
          success: result.success,
          error: result.error,
        });

      } catch (error) {
        console.error(`Error processing dispatch ${dispatch.id}:`, error);
        
        // Mark as failed
        await supabaseAdmin
          ?.from(TABLES.DISPATCHES)
          .update({
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', dispatch.id);

        results.push({
          dispatchId: dispatch.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Processed ${dispatches.length} dispatches: ${successCount} success, ${failureCount} failed`);

    return NextResponse.json({
      success: true,
      processed: dispatches.length,
      successCount,
      failureCount,
      results,
    });

  } catch (error) {
    console.error('Dispatch processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
