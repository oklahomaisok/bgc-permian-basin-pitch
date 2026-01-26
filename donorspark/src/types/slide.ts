// Base slide interface
export interface BaseSlide {
  id: string;
  type: SlideType;
  order: number;
}

export type SlideType =
  | 'cover'
  | 'text'
  | 'image'
  | 'stats'
  | 'split'
  | 'cta'
  | 'funnel'
  | 'testimonials'
  | 'pricing'
  | 'roadmap';

// Cover slide - title screen with logo, headline, badge
export interface CoverSlide extends BaseSlide {
  type: 'cover';
  content: {
    logoUrl?: string;
    headline: string;
    highlightedText?: string;  // Text to highlight in accent color
    subtitle?: string;
    badge?: string;
    backgroundImage?: string;
    showAuraBackground?: boolean;
    showAmbientGlow?: boolean;
  };
}

// Text slide - quote-style centered text
export interface TextSlide extends BaseSlide {
  type: 'text';
  content: {
    headline?: string;
    highlightedText?: string;
    quote?: string;
    body?: string;
    attribution?: string;
    backgroundImage?: string;
    backgroundOverlay?: 'light' | 'dark' | 'none';
    alignment?: 'left' | 'center' | 'right';
  };
}

// Image slide - full background image with optional overlay content
export interface ImageSlide extends BaseSlide {
  type: 'image';
  content: {
    imageUrl: string;
    headline?: string;
    highlightedText?: string;
    quote?: string;
    attribution?: string;
    stats?: StatItem[];
    overlayPosition?: 'top' | 'center' | 'bottom';
    overlayAlignment?: 'left' | 'center' | 'right';
  };
}

// Stats slide - grid of statistics with animated numbers
export interface StatsSlide extends BaseSlide {
  type: 'stats';
  content: {
    headline: string;
    highlightedText?: string;
    stats: StatItem[];
    description?: string;
    layout?: 'grid' | 'row' | 'column';
  };
}

export interface StatItem {
  value: number | string;
  suffix?: string;  // '+', '%', etc.
  label: string;
  animate?: boolean;
}

// Split slide - two-column layout with image and content
export interface SplitSlide extends BaseSlide {
  type: 'split';
  content: {
    imageUrl: string;
    imagePosition?: 'left' | 'right';
    headline: string;
    highlightedText?: string;
    body?: string;
    stats?: StatItem[];
    listItems?: ListItem[];
    challenges?: ChallengeItem[];
  };
}

export interface ListItem {
  text: string;
  icon?: 'check' | 'bullet' | 'arrow';
}

export interface ChallengeItem {
  title: string;
  description: string;
}

// CTA slide - call to action with buttons
export interface CTASlide extends BaseSlide {
  type: 'cta';
  content: {
    headline: string;
    highlightedText?: string;
    body?: string;
    imageUrl?: string;
    imagePosition?: 'left' | 'right';
    listItems?: ListItem[];
    primaryButton?: CTAButton;
    secondaryButton?: CTAButton;
    showShareModal?: boolean;
  };
}

export interface CTAButton {
  text: string;
  url: string;
  style?: 'primary' | 'secondary' | 'outline';
}

// Funnel slide - marketing funnel visualization
export interface FunnelSlide extends BaseSlide {
  type: 'funnel';
  content: {
    headline: string;
    highlightedText?: string;
    stages: FunnelStage[];
    description?: string;
    packages?: FunnelPackage[];
  };
}

export interface FunnelStage {
  name: string;
  label: string;
  color: string;
}

export interface FunnelPackage {
  name: string;
  stagesIncluded: number;  // 1 = top only, 2 = top + middle, 3 = all
}

// Testimonials slide - client results with quotes
export interface TestimonialsSlide extends BaseSlide {
  type: 'testimonials';
  content: {
    headline: string;
    highlightedText?: string;
    testimonials: Testimonial[];
  };
}

export interface Testimonial {
  clientName: string;
  subtitle?: string;
  stats: {
    value: string;
    description: string;
  }[];
  quote: string;
  attribution: string;
}

// Pricing slide - pricing cards comparison
export interface PricingSlide extends BaseSlide {
  type: 'pricing';
  content: {
    headline: string;
    highlightedText?: string;
    packages: PricingPackage[];
    addOns?: PricingAddOn[];
  };
}

export interface PricingPackage {
  name: string;
  subtitle?: string;
  price: string;
  priceDetail?: string;
  priceNote?: string;
  features: string[];
  footnote?: string;
  highlighted?: boolean;
}

export interface PricingAddOn {
  title: string;
  description: string;
}

// Roadmap slide - phased timeline
export interface RoadmapSlide extends BaseSlide {
  type: 'roadmap';
  content: {
    headline: string;
    highlightedText?: string;
    phases: RoadmapPhase[];
    footnote?: string;
  };
}

export interface RoadmapPhase {
  label: string;
  title: string;
  items: string[];
  color?: string;
}

// Union type of all slide types
export type Slide =
  | CoverSlide
  | TextSlide
  | ImageSlide
  | StatsSlide
  | SplitSlide
  | CTASlide
  | FunnelSlide
  | TestimonialsSlide
  | PricingSlide
  | RoadmapSlide;

// Type guard functions
export function isCoverSlide(slide: Slide): slide is CoverSlide {
  return slide.type === 'cover';
}

export function isTextSlide(slide: Slide): slide is TextSlide {
  return slide.type === 'text';
}

export function isImageSlide(slide: Slide): slide is ImageSlide {
  return slide.type === 'image';
}

export function isStatsSlide(slide: Slide): slide is StatsSlide {
  return slide.type === 'stats';
}

export function isSplitSlide(slide: Slide): slide is SplitSlide {
  return slide.type === 'split';
}

export function isCTASlide(slide: Slide): slide is CTASlide {
  return slide.type === 'cta';
}

export function isFunnelSlide(slide: Slide): slide is FunnelSlide {
  return slide.type === 'funnel';
}

export function isTestimonialsSlide(slide: Slide): slide is TestimonialsSlide {
  return slide.type === 'testimonials';
}

export function isPricingSlide(slide: Slide): slide is PricingSlide {
  return slide.type === 'pricing';
}

export function isRoadmapSlide(slide: Slide): slide is RoadmapSlide {
  return slide.type === 'roadmap';
}
