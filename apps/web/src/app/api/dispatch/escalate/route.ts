import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES, shouldEscalate, getNextChannel } from '@sarpanch-campaign/lib';

export async function POST(request: NextRequest) {
  try {
    // Get all dispatches that might need escalation
    const { data: dispatches, error: fetchError } = await supabaseAdmin
      ?.from(TABLES.DISPATCHES)
      .select(`
        *,
        campaigns!inner(*)
      `)
      .in('status', ['sent', 'failed', 'no_answer']);

    if (fetchError) {
      console.error('Error fetching dispatches:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch dispatches' }, { status: 500 });
    }

    if (!dispatches || dispatches.length === 0) {
      return NextResponse.json({ success: true, escalated: 0 });
    }

    console.log(`Checking ${dispatches.length} dispatches for escalation`);

    const escalated = [];

    for (const dispatch of dispatches) {
      try {
        const { campaigns } = dispatch;
        const sentAt = dispatch.sent_at ? new Date(dispatch.sent_at) : new Date(dispatch.created_at);
        
        // Check if this dispatch should be escalated
        if (shouldEscalate(dispatch.current_channel, dispatch.status, sentAt)) {
          // Get next channel in the cascade
          const nextChannel = getNextChannel(dispatch.current_channel, campaigns.channel_order);
          
          if (nextChannel) {
            // Escalate to next channel
            await supabaseAdmin
              ?.from(TABLES.DISPATCHES)
              .update({
                current_channel: nextChannel,
                status: 'queued',
                updated_at: new Date().toISOString(),
              })
              .eq('id', dispatch.id);

            escalated.push({
              dispatchId: dispatch.id,
              fromChannel: dispatch.current_channel,
              toChannel: nextChannel,
            });

            console.log(`Escalated dispatch ${dispatch.id} from ${dispatch.current_channel} to ${nextChannel}`);
          } else {
            // No more channels, mark as failed
            await supabaseAdmin
              ?.from(TABLES.DISPATCHES)
              .update({
                status: 'failed',
                updated_at: new Date().toISOString(),
              })
              .eq('id', dispatch.id);

            escalated.push({
              dispatchId: dispatch.id,
              fromChannel: dispatch.current_channel,
              toChannel: 'failed',
            });

            console.log(`Marked dispatch ${dispatch.id} as failed (no more channels)`);
          }
        }
      } catch (error) {
        console.error(`Error escalating dispatch ${dispatch.id}:`, error);
      }
    }

    console.log(`Escalated ${escalated.length} dispatches`);

    return NextResponse.json({
      success: true,
      escalated: escalated.length,
      details: escalated,
    });

  } catch (error) {
    console.error('Dispatch escalation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
