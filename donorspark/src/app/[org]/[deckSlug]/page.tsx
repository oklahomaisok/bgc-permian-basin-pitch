import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ResponsiveDeckViewer, DeckViewer } from '@/components/deck-viewer';
import { getMockDeckWithOrg } from '@/lib/supabase/mock-data';
import { organizationFromRow, deckFromRow } from '@/types/template';

interface DeckPageProps {
  params: Promise<{
    org: string;
    deckSlug: string;
  }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: DeckPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { org, deckSlug } = resolvedParams;

  // In production, fetch from Supabase
  // For now, use mock data
  const data = getMockDeckWithOrg(org, deckSlug);

  if (!data) {
    return {
      title: 'Deck Not Found',
    };
  }

  const organization = organizationFromRow(data.organization);

  return {
    title: `${organization.name} | DonorSpark`,
    description: `View the impact deck from ${organization.name}`,
    openGraph: {
      title: organization.name,
      description: `View the impact deck from ${organization.name}`,
      type: 'website',
    },
  };
}

export default async function DeckPage({ params }: DeckPageProps) {
  const resolvedParams = await params;
  const { org, deckSlug } = resolvedParams;

  // In production, fetch from Supabase:
  // const supabase = await createServerClient();
  // const { data, error } = await supabase
  //   .from('decks')
  //   .select('*, organizations(*)')
  //   .eq('access_slug', deckSlug)
  //   .single();

  // For now, use mock data
  const data = getMockDeckWithOrg(org, deckSlug);

  if (!data) {
    notFound();
  }

  const organization = organizationFromRow(data.organization);
  const deck = deckFromRow(data.deck);

  // Increment view count (in production)
  // await supabase.rpc('increment_deck_view_count', { deck_slug: deckSlug });

  // Use the faithful original viewer for Sea Cadets thank you deck
  // This shows the exact HTML/CSS/animations from the original prototype
  // On desktop, it displays inside a phone frame mockup
  if (org === 'sea-cadets' && deckSlug === 'thank-you-john') {
    const donorName = deck.personalizationData?.donor?.firstName || 'Friend';
    return (
      <ResponsiveDeckViewer
        donorName={donorName}
        orgName={organization.name}
        logoUrl={organization.logoUrl || '/images/sea-cadets/logo.png'}
      />
    );
  }

  // For other decks, use the generic DeckViewer
  return (
    <main className="h-screen overflow-hidden">
      <DeckViewer
        slides={deck.resolvedSlides}
        theme={organization.theme}
        logoUrl={organization.logoUrl}
      />
    </main>
  );
}
