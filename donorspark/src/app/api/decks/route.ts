import { NextRequest, NextResponse } from 'next/server';
import { saveDeck, getAllDecks } from '@/lib/deck-store';

// POST /api/decks - Create a new deck
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      orgName,
      orgWebsite,
      logoUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      donorFirstName,
      donorLastName,
      giftAmount,
      giftDate,
      impactHeadline,
      impactStory,
    } = body;

    // Validate required fields
    if (!orgName || !donorFirstName) {
      return NextResponse.json(
        { error: 'Organization name and donor first name are required' },
        { status: 400 }
      );
    }

    const slug = saveDeck({
      orgName,
      orgWebsite: orgWebsite || '',
      logoUrl: logoUrl || '',
      primaryColor: primaryColor || '#1D2350',
      secondaryColor: secondaryColor || '#FFC303',
      accentColor: accentColor || '#FFC303',
      donorFirstName,
      donorLastName: donorLastName || '',
      giftAmount: giftAmount || '',
      giftDate: giftDate || '',
      impactHeadline: impactHeadline || 'Changed a Life',
      impactStory: impactStory || '',
    });

    return NextResponse.json({ slug, url: `/preview/${slug}` });
  } catch (error) {
    console.error('Error creating deck:', error);
    return NextResponse.json({ error: 'Failed to create deck' }, { status: 500 });
  }
}

// GET /api/decks - List all decks (for debugging)
export async function GET() {
  const decks = getAllDecks();
  return NextResponse.json({ decks });
}
