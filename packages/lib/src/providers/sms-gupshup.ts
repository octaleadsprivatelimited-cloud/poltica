import { SMSProvider, ProviderConfig } from './types';

export class GupshupSMSProvider implements SMSProvider {
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async send(params: {
    to: string;
    text: string;
  }): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      const { to, text } = params;
      
      const payload = {
        source: this.config.source,
        destination: to,
        message: text,
      };

      const response = await fetch(`${this.config.baseUrl}/api/2.0/sms/msg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.apiKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json() as any;

      if (response.ok && data.status === 'submitted') {
        return {
          success: true,
          messageId: data.messageId,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to send SMS',
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

export function createGupshupSMSProvider(config?: Partial<ProviderConfig>): SMSProvider {
  const finalConfig: ProviderConfig = {
    apiKey: config?.apiKey || process.env.GUPSHUP_API_KEY || '',
    source: config?.senderId || config?.source || process.env.GUPSHUP_SOURCE || '',
    baseUrl: config?.baseUrl || 'https://api.gupshup.io',
    subscriberId: config?.subscriberId,
    subscriberName: config?.subscriberName,
    senderId: config?.senderId,
    webhookUrl: config?.webhookUrl,
  };

  if (!finalConfig.apiKey || !finalConfig.source) {
    throw new Error('Missing Gupshup configuration');
  }

  // Log subscriber-specific configuration
  if (config?.subscriberId) {
    console.log(`Creating SMS provider for subscriber ${config.subscriberId} (${config.subscriberName})`);
  }

  return new GupshupSMSProvider(finalConfig);
}
