import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, TABLES, trackUniqueLinkClick } from '@sarpanch-campaign/lib';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const rid = searchParams.get('rid'); // recipient ID

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    // Get unique link details
    const { data: link, error: linkError } = await supabaseAdmin
      ?.from(TABLES.UNIQUE_LINKS)
      .select(`
        *,
        campaigns!inner(*),
        audience!inner(*)
      `)
      .eq('slug', slug)
      .single();

    if (linkError || !link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Verify recipient ID matches
    if (rid && rid !== link.audience_id) {
      return NextResponse.json({ error: 'Invalid recipient' }, { status: 400 });
    }

    // Increment click count
    await supabaseAdmin
      ?.from(TABLES.UNIQUE_LINKS)
      .update({
        clicks: link.clicks + 1,
        last_clicked_at: new Date().toISOString(),
      })
      .eq('id', link.id);

    // Track analytics event
    trackUniqueLinkClick(
      slug,
      link.audience_id,
      link.campaign_id,
      link.utm
    );

    // Build redirect URL with UTM parameters
    const redirectUrl = new URL(link.url);
    
    // Add UTM parameters
    if (link.utm) {
      Object.entries(link.utm).forEach(([key, value]) => {
        redirectUrl.searchParams.set(key, value);
      });
    }
    
    // Add recipient ID
    redirectUrl.searchParams.set('rid', link.audience_id);

    // Redirect to the target URL
    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
