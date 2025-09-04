import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES, getAudienceSegment, createUniqueLink } from '@sarpanch-campaign/lib';
import shortid from 'shortid';

export async function POST(request: NextRequest) {
  try {
    const { campaignId } = await request.json();
    
    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabaseAdmin
      ?.from(TABLES.CAMPAIGNS)
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Get all audience members
    const { data: audience, error: audienceError } = await supabaseAdmin
      ?.from(TABLES.AUDIENCE)
      .select('*');

    if (audienceError) {
      return NextResponse.json({ error: 'Failed to fetch audience' }, { status: 500 });
    }

    // Filter audience based on campaign target_filter
    const targetAudience = campaign.target_filter 
      ? getAudienceSegment(audience || [], campaign.target_filter)
      : audience || [];

    // Filter out opted-out users
    const eligibleAudience = targetAudience.filter(audience => !audience.opted_out);

    console.log(`Launching campaign for ${eligibleAudience.length} recipients`);

    // Create dispatch records for each recipient
    const dispatches = eligibleAudience.map(audience => ({
      campaign_id: campaignId,
      audience_id: audience.id,
      current_channel: campaign.channel_order[0], // Start with first channel
      status: 'queued',
    }));

    const { error: dispatchError } = await supabaseAdmin
      ?.from(TABLES.DISPATCHES)
      .insert(dispatches);

    if (dispatchError) {
      console.error('Error creating dispatches:', dispatchError);
      return NextResponse.json({ error: 'Failed to create dispatches' }, { status: 500 });
    }

    // Create unique links for each recipient
    const uniqueLinks = eligibleAudience.map(audience => ({
      slug: shortid.generate(),
      campaign_id: campaignId,
      audience_id: audience.id,
      url: `${process.env.APP_BASE_URL}/landing`,
      utm: campaign.utm,
    }));

    const { error: linksError } = await supabaseAdmin
      ?.from(TABLES.UNIQUE_LINKS)
      .insert(uniqueLinks);

    if (linksError) {
      console.error('Error creating unique links:', linksError);
      return NextResponse.json({ error: 'Failed to create unique links' }, { status: 500 });
    }

    // Update campaign start time
    await supabaseAdmin
      ?.from(TABLES.CAMPAIGNS)
      .update({ start_at: new Date().toISOString() })
      .eq('id', campaignId);

    return NextResponse.json({ 
      success: true, 
      message: `Campaign launched for ${eligibleAudience.length} recipients`,
      recipients: eligibleAudience.length 
    });

  } catch (error) {
    console.error('Campaign launch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
