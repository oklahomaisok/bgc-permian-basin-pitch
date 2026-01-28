import { notFound } from 'next/navigation';
import { getDeck } from '@/lib/deck-store';
import { PreviewDeckViewer } from '@/components/deck-viewer/PreviewDeckViewer';

interface PreviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;

  const deck = getDeck(slug);

  if (!deck) {
    notFound();
  }

  return (
    <PreviewDeckViewer
      orgName={deck.orgName}
      logoUrl={deck.logoUrl}
      primaryColor={deck.primaryColor}
      secondaryColor={deck.secondaryColor}
      accentColor={deck.accentColor}
      donorFirstName={deck.donorFirstName}
      donorLastName={deck.donorLastName}
      giftAmount={deck.giftAmount}
      impactHeadline={deck.impactHeadline}
      impactStory={deck.impactStory}
    />
  );
}
