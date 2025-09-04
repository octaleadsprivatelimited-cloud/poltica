import { WhatsAppProvider, ProviderConfig } from './types';

export class GupshupWhatsAppProvider implements WhatsAppProvider {
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async sendTemplate(params: {
    to: string;
    templateCode: string;
    variables: Record<string, string>;
    mediaUrl?: string;
  }): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      const { to, templateCode, variables, mediaUrl } = params;
      
      const payload = {
        source: this.config.source,
        destination: to,
        template: {
          id: templateCode,
          params: Object.values(variables),
        },
        ...(mediaUrl && { media: { url: mediaUrl } }),
      };

      const response = await fetch(`${this.config.baseUrl}/api/2.0/whatsapp/msg`, {
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
          error: data.message || 'Failed to send WhatsApp message',
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

export function createGupshupWhatsAppProvider(config?: Partial<ProviderConfig>): WhatsAppProvider {
  const finalConfig: ProviderConfig = {
    apiKey: config?.apiKey || process.env.GUPSHUP_API_KEY || '',
    source: config?.phoneNumber || config?.source || process.env.GUPSHUP_SOURCE || '',
    baseUrl: config?.baseUrl || 'https://api.gupshup.io',
    subscriberId: config?.subscriberId,
    subscriberName: config?.subscriberName,
    phoneNumber: config?.phoneNumber,
    webhookUrl: config?.webhookUrl,
  };

  if (!finalConfig.apiKey || !finalConfig.source) {
    throw new Error('Missing Gupshup configuration');
  }

  // Log subscriber-specific configuration
  if (config?.subscriberId) {
    console.log(`Creating WhatsApp provider for subscriber ${config.subscriberId} (${config.subscriberName})`);
  }

  return new GupshupWhatsAppProvider(finalConfig);
}
