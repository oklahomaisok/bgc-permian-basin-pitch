import { NextRequest, NextResponse } from 'next/server';
import { getDeck } from '@/lib/deck-store';

// GET /api/decks/[slug] - Get a specific deck
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const deck = getDeck(slug);

  if (!deck) {
    return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
  }

  return NextResponse.json(deck);
}
