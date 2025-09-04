import { redirect } from 'next/navigation';
import { supabaseAdmin, TABLES, trackUniqueLinkClick } from '@sarpanch-campaign/lib';

interface RedirectPageProps {
  params: { slug: string };
  searchParams: { rid?: string };
}

export default async function RedirectPage({ params, searchParams }: RedirectPageProps) {
  const { slug } = params;
  const { rid } = searchParams;

  if (!slug) {
    redirect('/');
  }

  try {
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
      redirect('/');
    }

    // Verify recipient ID matches
    if (rid && rid !== link.audience_id) {
      redirect('/');
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
    redirect(redirectUrl.toString());

  } catch (error) {
    console.error('Redirect error:', error);
    redirect('/');
  }
}
