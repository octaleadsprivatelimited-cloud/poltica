import { Audience } from './schemas';

export interface TargetFilter {
  ward?: string | string[];
  booth?: string | string[];
  tags?: string | string[];
  whatsapp_capable?: boolean;
  opted_out?: boolean;
}

export function evaluateTargetFilter(audience: Audience, filter: TargetFilter): boolean {
  // Check opted_out first - if opted out, never include
  if (filter.opted_out === false && audience.opted_out) {
    return false;
  }

  // Check ward filter
  if (filter.ward) {
    const targetWards = Array.isArray(filter.ward) ? filter.ward : [filter.ward];
    if (audience.ward && !targetWards.includes(audience.ward)) {
      return false;
    }
  }

  // Check booth filter
  if (filter.booth) {
    const targetBooths = Array.isArray(filter.booth) ? filter.booth : [filter.booth];
    if (audience.booth && !targetBooths.includes(audience.booth)) {
      return false;
    }
  }

  // Check tags filter
  if (filter.tags) {
    const targetTags = Array.isArray(filter.tags) ? filter.tags : [filter.tags];
    const hasMatchingTag = targetTags.some(tag => audience.tags.includes(tag));
    if (!hasMatchingTag) {
      return false;
    }
  }

  // Check whatsapp_capable filter
  if (filter.whatsapp_capable !== undefined && audience.whatsapp_capable !== filter.whatsapp_capable) {
    return false;
  }

  return true;
}

export function getAudienceSegment(audience: Audience[], filter: TargetFilter): Audience[] {
  return audience.filter(audience => evaluateTargetFilter(audience, filter));
}
