import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES } from '@sarpanch-campaign/lib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Parse Exotel IVR webhook payload
    const { CallSid, CallStatus, CallDuration, From, To, Digits } = body;
    
    if (!CallSid) {
      return NextResponse.json({ error: 'Missing CallSid' }, { status: 400 });
    }

    // Map Exotel call status to our dispatch statuses
    let status: string;
    switch (CallStatus) {
      case 'ringing':
        status = 'ringing';
        break;
      case 'answered':
        status = 'delivered';
        break;
      case 'completed':
        status = 'delivered';
        break;
      case 'no-answer':
        status = 'no_answer';
        break;
      case 'busy':
      case 'failed':
        status = 'failed';
        break;
      default:
        console.log('Unknown IVR status:', CallStatus);
        return NextResponse.json({ success: true });
    }

    // Update dispatch status
    const { error } = await supabaseAdmin
      ?.from(TABLES.DISPATCHES)
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('provider_message_id', CallSid);

    if (error) {
      console.error('Error updating IVR dispatch:', error);
      return NextResponse.json({ error: 'Failed to update dispatch' }, { status: 500 });
    }

    // If call was answered and we have DTMF digits, we could store them
    if (status === 'delivered' && Digits) {
      // Store DTMF response in dispatch metadata or separate table
      console.log('DTMF digits received:', Digits);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('IVR webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
