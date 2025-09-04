import { IVRProvider, ProviderConfig } from './types';

export class ExotelIVRProvider implements IVRProvider {
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async call(params: {
    to: string;
    campaignId: string;
    audioUrl?: string;
    ttsScript?: string;
  }): Promise<{
    success: boolean;
    callId?: string;
    error?: string;
  }> {
    try {
      const { to, campaignId, audioUrl, ttsScript } = params;
      
      if (!audioUrl && !ttsScript) {
        return {
          success: false,
          error: 'Either audioUrl or ttsScript must be provided',
        };
      }

      const payload: Record<string, string> = {
        from: this.config.virtualNumber || '',
        to: to,
        caller_id: this.config.virtualNumber || '',
        custom_data: JSON.stringify({
          campaign_id: campaignId,
        }),
      };

      if (audioUrl) {
        payload.play = audioUrl;
      }
      if (ttsScript) {
        payload.say = ttsScript;
      }

      const response = await fetch(`${this.config.baseUrl}/v1/Accounts/${this.config.apiKey}/Calls/connect.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${this.config.apiKey}:${this.config.source}`).toString('base64')}`,
        },
        body: new URLSearchParams(payload),
      });

      const data = await response.json() as any;

      if (response.ok && data.Call) {
        return {
          success: true,
          callId: data.Call.Sid,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to place IVR call',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export function createExotelIVRProvider(config?: Partial<ProviderConfig>): IVRProvider {
  const finalConfig: ProviderConfig = {
    apiKey: config?.apiKey || process.env.EXOTEL_SID || '',
    source: config?.source || process.env.EXOTEL_TOKEN || '',
    virtualNumber: config?.phoneNumber || config?.virtualNumber || process.env.EXOTEL_VIRTUAL_NUMBER || '',
    baseUrl: config?.baseUrl || 'https://api.exotel.com',
    subscriberId: config?.subscriberId,
    subscriberName: config?.subscriberName,
    phoneNumber: config?.phoneNumber,
    webhookUrl: config?.webhookUrl,
  };

  if (!finalConfig.apiKey || !finalConfig.source || !finalConfig.virtualNumber) {
    throw new Error('Missing Exotel configuration');
  }

  // Log subscriber-specific configuration
  if (config?.subscriberId) {
    console.log(`Creating IVR provider for subscriber ${config.subscriberId} (${config.subscriberName})`);
  }

  return new ExotelIVRProvider(finalConfig);
}
