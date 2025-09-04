import { WhatsAppProvider, SMSProvider, IVRProvider } from './types';
import { createGupshupWhatsAppProvider } from './whatsapp-gupshup';
import { createGupshupSMSProvider } from './sms-gupshup';
import { createExotelIVRProvider } from './ivr-exotel';

// Provider factory functions
export function createWhatsAppProvider(config?: Partial<ProviderConfig>): WhatsAppProvider {
  return createGupshupWhatsAppProvider(config);
}

export function createSMSProvider(config?: Partial<ProviderConfig>): SMSProvider {
  return createGupshupSMSProvider(config);
}

export function createIVRProvider(config?: Partial<ProviderConfig>): IVRProvider {
  return createExotelIVRProvider(config);
}

// Export types
export * from './types';
export * from './whatsapp-gupshup';
export * from './sms-gupshup';
export * from './ivr-exotel';
