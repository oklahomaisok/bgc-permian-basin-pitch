import type { OrganizationRow, DonorRow, TemplateRow, DeckRow } from '@/types';
import type { Theme } from '@/types/theme';
import type { Slide } from '@/types/slide';

// Sea Cadets theme (Navy + Gold)
const seaCadetsTheme: Theme = {
  colors: {
    primary: '#1D2350',
    secondary: '#FFC303',
    background: '#15193b',
    text: '#ffffff',
    accent: '#FFC303',
  },
  fonts: {
    display: 'Oswald, sans-serif',
    body: 'Roboto, sans-serif',
    sub: 'Roboto Slab, serif',
  },
  filmGrainOpacity: 0,
  ambientGlowColor: '#1D2350',
};

// Mock organizations
export const mockOrganizations: OrganizationRow[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'US Naval Sea Cadet Corps',
    slug: 'sea-cadets',
    website_url: 'https://seacadets.org',
    logo_url: '/images/sea-cadets/logo.png',
    theme: seaCadetsTheme,
    created_at: '2024-01-01T00:00:00Z',
  },
];

// Mock donors
export const mockDonors: DonorRow[] = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@example.com',
    custom_fields: {
      donorLevel: 'Gold',
    },
  },
];

// Sea Cadets Thank You Deck slides
const seaCadetsThankYouSlides: Slide[] = [
  {
    id: 'slide-1',
    type: 'cover',
    order: 0,
    content: {
      logoUrl: '/images/sea-cadets/logo.png',
      headline: '{{donor_first_name}}, You Just {{highlight}}',
      highlightedText: 'Changed a Life.',
      badge: 'Your Impact',
      backgroundImage: '/images/sea-cadets/cadet-closeup.jpg',
      showAuraBackground: false,
      showAmbientGlow: false,
    },
  },
  {
    id: 'slide-2',
    type: 'text',
    order: 1,
    content: {
      quote: 'A young person had the heart of a leader, but lacked the gear to join the ranks.',
      backgroundImage: '/images/sea-cadets/candidate-civilian.jpg',
      backgroundOverlay: 'dark',
      alignment: 'left',
    },
  },
  {
    id: 'slide-3',
    type: 'stats',
    order: 2,
    content: {
      headline: 'The {{highlight}}',
      highlightedText: 'Barrier',
      description: 'The cost of a complete Sea Bag can prevent promising cadets from joining.',
      stats: [
        { value: '$250', label: 'Average Sea Bag Cost', animate: false },
        { value: '16', label: 'Essential Items Required', animate: false },
      ],
      layout: 'row',
    },
  },
  {
    id: 'slide-4',
    type: 'text',
    order: 3,
    content: {
      headline: 'Then {{highlight}} Stepped In',
      highlightedText: 'You',
      body: 'Your gift removed the barrier. You made it possible for a young leader to take their place in the ranks.',
      alignment: 'center',
    },
  },
  {
    id: 'slide-5',
    type: 'split',
    order: 4,
    content: {
      imageUrl: '/images/sea-cadets/split-uniform.jpg',
      imagePosition: 'right',
      headline: 'Before & {{highlight}}',
      highlightedText: 'After',
      body: 'Because of donors like you, a civilian becomes a cadet. A dream becomes reality.',
    },
  },
  {
    id: 'slide-6',
    type: 'image',
    order: 5,
    content: {
      imageUrl: '/images/sea-cadets/uniform-detail.jpg',
      quote: 'When I put on this uniform, I feel like I can do anything.',
      attribution: 'Cadet Petty Officer, 2nd Class',
      overlayPosition: 'bottom',
      overlayAlignment: 'left',
    },
  },
  {
    id: 'slide-7',
    type: 'text',
    order: 6,
    content: {
      headline: 'You Saw {{highlight}}',
      highlightedText: 'Potential',
      body: 'Where others saw a barrier, you saw an opportunity. Your generosity says: "I believe in you."',
      alignment: 'center',
    },
  },
  {
    id: 'slide-8',
    type: 'stats',
    order: 7,
    content: {
      headline: 'Your Gift {{highlight}}',
      highlightedText: 'Ripples',
      stats: [
        { value: '11,000', suffix: '+', label: 'Active Cadets Nationwide', animate: true },
        { value: '400', suffix: '+', label: 'Units Across America', animate: true },
        { value: '65', suffix: '+', label: 'Years of Service', animate: true },
      ],
      layout: 'grid',
    },
  },
  {
    id: 'slide-9',
    type: 'image',
    order: 8,
    content: {
      imageUrl: '/images/sea-cadets/cadet-horizon.jpg',
      headline: 'The {{highlight}} Continues',
      highlightedText: 'Mission',
      quote: 'Building leaders of character through maritime training and service.',
      overlayPosition: 'center',
      overlayAlignment: 'center',
    },
  },
  {
    id: 'slide-10',
    type: 'cta',
    order: 9,
    content: {
      headline: 'Thank You, {{highlight}}',
      highlightedText: '{{donor_first_name}}',
      body: 'Your support transforms lives. One cadet at a time, you are building the next generation of leaders.',
      primaryButton: {
        text: 'Share Your Impact',
        url: '#share',
        style: 'primary',
      },
      secondaryButton: {
        text: 'Give Again',
        url: 'https://seacadets.org/donate',
        style: 'outline',
      },
      showShareModal: true,
    },
  },
];

// Sea Cadets Impact Story Deck slides
const seaCadetsStorySlides: Slide[] = [
  {
    id: 'story-slide-1',
    type: 'cover',
    order: 0,
    content: {
      logoUrl: '/images/sea-cadets/logo.png',
      headline: 'Uniquely {{highlight}}',
      highlightedText: 'Prepared',
      subtitle: 'Forging the next generation of leaders through the US Naval Sea Cadet Corps.',
      badge: 'Impact Deck',
      backgroundImage: '/images/sea-cadets/cover-girl.jpg',
      showAuraBackground: false,
      showAmbientGlow: false,
    },
  },
  {
    id: 'story-slide-2',
    type: 'split',
    order: 1,
    content: {
      imageUrl: '/images/sea-cadets/tug-of-war.jpg',
      imagePosition: 'left',
      headline: 'Building Leaders of {{highlight}}',
      highlightedText: 'Character',
      body: '"To encourage and aid American youth to develop an interest and skill in basic seamanship and seagoing skills."',
      listItems: [
        { text: 'Honor', icon: 'check' },
        { text: 'Respect', icon: 'check' },
        { text: 'Commitment', icon: 'check' },
        { text: 'Service', icon: 'check' },
      ],
    },
  },
  {
    id: 'story-slide-3',
    type: 'stats',
    order: 2,
    content: {
      headline: 'After the {{highlight}}',
      highlightedText: 'Uniform',
      description: 'Over 62% of graduating cadets pursue service through Enlistment, ROTC, or Military Academies.',
      stats: [
        { value: 27, suffix: '%', label: 'Enlist in Military', animate: true },
        { value: 26, suffix: '%', label: 'Attend College', animate: true },
        { value: 20, suffix: '%', label: 'Join ROTC', animate: true },
        { value: 15, suffix: '%', label: 'Academy Appointments', animate: true },
      ],
      layout: 'grid',
    },
  },
  {
    id: 'story-slide-4',
    type: 'testimonials',
    order: 3,
    content: {
      headline: 'Success {{highlight}}',
      highlightedText: 'Stories',
      testimonials: [
        {
          clientName: 'Navy SEAL Veteran',
          subtitle: 'Former Sea Cadet',
          stats: [
            { value: '8 Years', description: 'Active Duty Service' },
          ],
          quote: 'Sea Cadets gave me the foundation I needed. The discipline, the teamwork, the drive to never quit.',
          attribution: 'Petty Officer Mitchell, USN (Ret.)',
        },
        {
          clientName: 'Naval Academy Graduate',
          subtitle: 'Class of 2022',
          stats: [
            { value: 'USNA', description: 'Appointment' },
          ],
          quote: 'I walked into Annapolis already knowing what it meant to serve. Sea Cadets prepared me for everything.',
          attribution: 'Ensign Sarah Chen, USN',
        },
      ],
    },
  },
  {
    id: 'story-slide-5',
    type: 'stats',
    order: 4,
    content: {
      headline: 'National {{highlight}}',
      highlightedText: 'Impact',
      stats: [
        { value: '11,000', suffix: '+', label: 'Active Cadets', animate: true },
        { value: '400', suffix: '+', label: 'Units Nationwide', animate: true },
        { value: '50', label: 'States Represented', animate: true },
        { value: '1958', label: 'Year Founded', animate: false },
      ],
      layout: 'grid',
    },
  },
  {
    id: 'story-slide-6',
    type: 'image',
    order: 5,
    content: {
      imageUrl: '/images/sea-cadets/squadron-drill.jpg',
      headline: 'Training the {{highlight}}',
      highlightedText: 'Next Generation',
      overlayPosition: 'bottom',
      overlayAlignment: 'left',
    },
  },
  {
    id: 'story-slide-7',
    type: 'image',
    order: 6,
    content: {
      imageUrl: '/images/sea-cadets/helicopter.jpg',
      headline: 'Real World {{highlight}}',
      highlightedText: 'Experience',
      quote: 'From aviation to maritime operations, cadets gain hands-on training with military equipment.',
      overlayPosition: 'center',
      overlayAlignment: 'center',
    },
  },
  {
    id: 'story-slide-8',
    type: 'cta',
    order: 7,
    content: {
      headline: 'Join the {{highlight}}',
      highlightedText: 'Mission',
      body: 'Help us build the next generation of American leaders. Your support makes a lasting difference.',
      imageUrl: '/images/sea-cadets/group-salute.jpg',
      imagePosition: 'left',
      primaryButton: {
        text: 'Support a Cadet',
        url: 'https://seacadets.org/donate',
        style: 'primary',
      },
      secondaryButton: {
        text: 'Learn More',
        url: 'https://seacadets.org',
        style: 'outline',
      },
    },
  },
];

// Mock templates
export const mockTemplates: TemplateRow[] = [
  {
    id: '770e8400-e29b-41d4-a716-446655440002',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Donor Thank You',
    template_type: 'thank_you',
    slides: seaCadetsThankYouSlides,
    is_system_template: false,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440003',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Impact Story',
    template_type: 'impact_story',
    slides: seaCadetsStorySlides,
    is_system_template: false,
    created_at: '2024-01-01T00:00:00Z',
  },
];

// Mock decks - personalized instances
export const mockDecks: DeckRow[] = [
  {
    id: '880e8400-e29b-41d4-a716-446655440003',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    donor_id: '660e8400-e29b-41d4-a716-446655440001',
    template_id: '770e8400-e29b-41d4-a716-446655440002',
    access_slug: 'thank-you-john',
    resolved_slides: seaCadetsThankYouSlides.map(slide => {
      // Resolve merge tags for John
      const resolveText = (text: string) =>
        text.replace(/\{\{donor_first_name\}\}/g, 'John');

      if (slide.type === 'cover') {
        return {
          ...slide,
          content: {
            ...slide.content,
            headline: resolveText(slide.content.headline),
          },
        };
      }
      if (slide.type === 'cta') {
        return {
          ...slide,
          content: {
            ...slide.content,
            headline: resolveText(slide.content.headline),
            highlightedText: resolveText(slide.content.highlightedText || ''),
          },
        };
      }
      return slide;
    }),
    personalization_data: {
      donor: {
        firstName: 'John',
        lastName: 'Smith',
        fullName: 'John Smith',
      },
    },
    status: 'published',
    view_count: 0,
    created_at: '2024-01-15T00:00:00Z',
    last_viewed_at: null,
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440004',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    donor_id: null,
    template_id: '770e8400-e29b-41d4-a716-446655440003',
    access_slug: 'impact-story',
    resolved_slides: seaCadetsStorySlides,
    personalization_data: {},
    status: 'published',
    view_count: 0,
    created_at: '2024-01-15T00:00:00Z',
    last_viewed_at: null,
  },
];

// Helper functions to fetch mock data
export function getMockOrganization(slug: string): OrganizationRow | undefined {
  return mockOrganizations.find((org) => org.slug === slug);
}

export function getMockDeck(orgSlug: string, deckSlug: string): DeckRow | undefined {
  const org = getMockOrganization(orgSlug);
  if (!org) return undefined;
  return mockDecks.find(
    (deck) => deck.organization_id === org.id && deck.access_slug === deckSlug
  );
}

export function getMockDeckWithOrg(
  orgSlug: string,
  deckSlug: string
): { deck: DeckRow; organization: OrganizationRow } | undefined {
  const org = getMockOrganization(orgSlug);
  if (!org) return undefined;
  const deck = mockDecks.find(
    (d) => d.organization_id === org.id && d.access_slug === deckSlug
  );
  if (!deck) return undefined;
  return { deck, organization: org };
}
