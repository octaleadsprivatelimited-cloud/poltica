import { Channel, DispatchStatus } from './schemas';

export interface CascadeConfig {
  maxAttempts: Record<Channel, number>;
  escalationDelay: Record<Channel, number>; // in milliseconds
  retryDelays: Record<Channel, number[]>; // exponential backoff delays
}

export const DEFAULT_CASCADE_CONFIG: CascadeConfig = {
  maxAttempts: {
    whatsapp: 3,
    ivr: 2,
    sms: 2,
  },
  escalationDelay: {
    whatsapp: 6 * 60 * 60 * 1000, // 6 hours
    ivr: 2 * 60 * 60 * 1000, // 2 hours
    sms: 0, // immediate
  },
  retryDelays: {
    whatsapp: [5 * 60 * 1000, 15 * 60 * 1000, 30 * 60 * 1000], // 5min, 15min, 30min
    ivr: [2 * 60 * 1000, 5 * 60 * 1000], // 2min, 5min
    sms: [1 * 60 * 1000, 3 * 60 * 1000], // 1min, 3min
  },
};

export function getNextChannel(currentChannel: Channel, channelOrder: Channel[]): Channel | null {
  const currentIndex = channelOrder.indexOf(currentChannel);
  if (currentIndex === -1 || currentIndex === channelOrder.length - 1) {
    return null;
  }
  return channelOrder[currentIndex + 1];
}

export function shouldEscalate(
  currentChannel: Channel,
  status: DispatchStatus,
  sentAt: Date,
  config: CascadeConfig = DEFAULT_CASCADE_CONFIG
): boolean {
  const now = new Date();
  const timeSinceSent = now.getTime() - sentAt.getTime();
  const escalationDelay = config.escalationDelay[currentChannel];

  // Check if enough time has passed for escalation
  if (timeSinceSent < escalationDelay) {
    return false;
  }

  // Check if current status allows escalation
  const escalationStatuses: DispatchStatus[] = ['failed', 'no_answer'];
  return escalationStatuses.includes(status);
}

export function getRetryDelay(
  channel: Channel,
  attemptNumber: number,
  config: CascadeConfig = DEFAULT_CASCADE_CONFIG
): number {
  const delays = config.retryDelays[channel];
  const maxAttempts = config.maxAttempts[channel];
  
  if (attemptNumber >= maxAttempts) {
    return -1; // No more retries
  }

  return delays[Math.min(attemptNumber, delays.length - 1)] || delays[delays.length - 1];
}

export function canRetry(
  channel: Channel,
  attemptNumber: number,
  config: CascadeConfig = DEFAULT_CASCADE_CONFIG
): boolean {
  return attemptNumber < config.maxAttempts[channel];
}
