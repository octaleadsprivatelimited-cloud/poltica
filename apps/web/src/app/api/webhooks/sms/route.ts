import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@sarpanch-campaign/lib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Parse SMS webhook payload (Gupshup format)
    const { type, payload } = body;
    
    if (type === 'message-event') {
      const { messageId, eventType, timestamp } = payload;
      
      // Map SMS event types to our dispatch statuses
      let status: string;
      switch (eventType) {
        case 'sent':
          status = 'sent';
          break;
        case 'delivered':
          status = 'delivered';
          break;
        case 'failed':
          status = 'failed';
          break;
        default:
          console.log('Unknown SMS event type:', eventType);
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
        console.error('Error updating SMS dispatch:', error);
        return NextResponse.json({ error: 'Failed to update dispatch' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SMS webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
