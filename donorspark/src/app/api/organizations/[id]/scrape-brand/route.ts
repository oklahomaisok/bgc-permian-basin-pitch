import { NextRequest, NextResponse } from 'next/server';
import { scrapeBrandAssets } from '@/lib/scraping';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Get the URL from the request body
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Scrape brand assets
    const brandAssets = await scrapeBrandAssets(url);

    return NextResponse.json({
      organizationId: id,
      url,
      brandAssets,
    });
  } catch (error) {
    console.error('Brand scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape brand assets' },
      { status: 500 }
    );
  }
}
