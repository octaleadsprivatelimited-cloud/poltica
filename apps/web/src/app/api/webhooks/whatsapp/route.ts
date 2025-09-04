import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@sarpanch-campaign/lib';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook signature (implement based on Gupshup docs)
    const signature = request.headers.get('x-gupshup-signature');
    if (signature && !verifySignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse Gupshup webhook payload
    const { type, payload } = body;
    
    if (type === 'message-event') {
      const { messageId, eventType, timestamp } = payload;
      
      // Map Gupshup event types to our dispatch statuses
      let status: string;
      switch (eventType) {
        case 'sent':
          status = 'sent';
          break;
        case 'delivered':
          status = 'delivered';
          break;
        case 'read':
          status = 'read';
          break;
        case 'failed':
          status = 'failed';
          break;
        default:
          console.log('Unknown event type:', eventType);
          return NextResponse.json({ success: true });
      }

      // Update dispatch status
      const { error } = await supabaseAdmin
        ?.from(TABLES.DISPATCHES)
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('provider_message_id', messageId);

      if (error) {
        console.error('Error updating dispatch:', error);
        return NextResponse.json({ error: 'Failed to update dispatch' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function verifySignature(body: any, signature: string): boolean {
  // Implement HMAC verification based on Gupshup documentation
  // This is a placeholder - implement actual verification
  return true;
}
