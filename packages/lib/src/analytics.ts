import { PostHog } from 'posthog-js';

let posthog: PostHog | null = null;

export function initPostHog() {
  if (typeof globalThis !== 'undefined' && 'window' in globalThis && !posthog) {
    const { PostHog } = require('posthog-js');
    
    posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com',
    });
  }
  return posthog;
}

export function identifyUser(userId: string, properties?: Record<string, any>) {
  const client = initPostHog();
  if (client) {
    client.identify(userId, properties);
  }
}

export function trackEvent(event: string, properties?: Record<string, any>) {
  const client = initPostHog();
  if (client) {
    client.capture(event, properties);
  }
}

export function trackUniqueLinkClick(slug: string, audienceId: string, campaignId: string, utm?: Record<string, string>) {
  trackEvent('unique_link_clicked', {
    slug,
    audience_id: audienceId,
    campaign_id: campaignId,
    ...utm,
  });
}

export function trackLandingView(audienceId: string, campaignId: string, utm?: Record<string, string>) {
  trackEvent('landing_viewed', {
    audience_id: audienceId,
    campaign_id: campaignId,
    ...utm,
  });
}

export function trackCTASubmit(audienceId: string, campaignId: string, ctaType: string, utm?: Record<string, string>) {
  trackEvent('cta_submitted', {
    audience_id: audienceId,
    campaign_id: campaignId,
    cta_type: ctaType,
    ...utm,
  });
}
