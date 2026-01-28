// In-memory store for generated decks (demo purposes)
// In production, this would be Supabase or another database

export interface GeneratedDeck {
  slug: string;
  createdAt: string;
  orgName: string;
  orgWebsite: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  donorFirstName: string;
  donorLastName: string;
  giftAmount: string;
  giftDate: string;
  impactHeadline: string;
  impactStory: string;
}

// Using a Map as in-memory store
// Note: This resets when the server restarts
const deckStore = new Map<string, GeneratedDeck>();

export function saveDeck(deck: Omit<GeneratedDeck, 'slug' | 'createdAt'>): string {
  // Generate a unique slug
  const slug = `${deck.donorFirstName.toLowerCase()}-${Date.now().toString(36)}`;

  const fullDeck: GeneratedDeck = {
    ...deck,
    slug,
    createdAt: new Date().toISOString(),
  };

  deckStore.set(slug, fullDeck);
  return slug;
}

export function getDeck(slug: string): GeneratedDeck | undefined {
  return deckStore.get(slug);
}

export function getAllDecks(): GeneratedDeck[] {
  return Array.from(deckStore.values());
}
