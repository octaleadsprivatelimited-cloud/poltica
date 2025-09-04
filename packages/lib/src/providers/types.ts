// Provider interfaces for WhatsApp, SMS, and IVR

export interface WhatsAppProvider {
  sendTemplate(params: {
    to: string;
    templateCode: string;
    variables: Record<string, string>;
    mediaUrl?: string;
  }): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
}

export interface SMSProvider {
  send(params: {
    to: string;
    text: string;
  }): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
}

export interface IVRProvider {
  call(params: {
    to: string;
    campaignId: string;
    audioUrl?: string;
    ttsScript?: string;
  }): Promise<{
    success: boolean;
    callId?: string;
    error?: string;
  }>;
}

export interface WebhookPayload {
  provider: 'whatsapp' | 'sms' | 'ivr';
  messageId: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'no_answer' | 'ringing' | 'answered';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ProviderConfig {
  apiKey: string;
  source?: string;
  virtualNumber?: string;
  baseUrl?: string;
  subscriberId?: string;
  subscriberName?: string;
  phoneNumber?: string;
  senderId?: string;
  webhookUrl?: string;
}
