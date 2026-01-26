import type { Slide } from './slide';
import type { Theme } from './theme';

// Organization - the nonprofit using DonorSpark
export interface Organization {
  id: string;
  name: string;
  slug: string;
  websiteUrl?: string;
  logoUrl?: string;
  theme: Theme;
  createdAt: Date;
}

// Donor - individual donors for personalization
export interface Donor {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email?: string;
  customFields: Record<string, string | number>;
}

// Template - reusable deck structure
export interface Template {
  id: string;
  organizationId: string;
  name: string;
  templateType: TemplateType;
  slides: Slide[];
  isSystemTemplate: boolean;
  createdAt: Date;
}

export type TemplateType = 'thank_you' | 'impact_story' | 'annual_report' | 'campaign';

// Deck - generated instance with resolved personalization
export interface Deck {
  id: string;
  organizationId: string;
  donorId?: string;
  templateId: string;
  accessSlug: string;
  resolvedSlides: Slide[];
  personalizationData: PersonalizationData;
  status: DeckStatus;
  viewCount: number;
  createdAt: Date;
  lastViewedAt?: Date;
}

export type DeckStatus = 'draft' | 'published' | 'archived';

// Personalization context for merge tag resolution
export interface PersonalizationData {
  donor?: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    [key: string]: string | number | undefined;
  };
  donation?: {
    amount?: number;
    formattedAmount?: string;
    date?: string;
    campaign?: string;
  };
  organization?: {
    name?: string;
    shortName?: string;
  };
  custom?: Record<string, string | number>;
}

// Merge tag pattern for personalization
export const MERGE_TAG_PATTERN = /\{\{(\w+)\}\}/g;

// Common merge tags
export type MergeTag =
  | 'donor_first_name'
  | 'donor_last_name'
  | 'donor_full_name'
  | 'donor_email'
  | 'donation_amount'
  | 'donation_date'
  | 'campaign_name'
  | 'organization_name';

// Database row types (for Supabase)
export interface OrganizationRow {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  logo_url: string | null;
  theme: Theme;
  created_at: string;
}

export interface DonorRow {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  custom_fields: Record<string, string | number>;
}

export interface TemplateRow {
  id: string;
  organization_id: string;
  name: string;
  template_type: TemplateType;
  slides: Slide[];
  is_system_template: boolean;
  created_at: string;
}

export interface DeckRow {
  id: string;
  organization_id: string;
  donor_id: string | null;
  template_id: string;
  access_slug: string;
  resolved_slides: Slide[];
  personalization_data: PersonalizationData;
  status: DeckStatus;
  view_count: number;
  created_at: string;
  last_viewed_at: string | null;
}

// Convert database rows to domain types
export function organizationFromRow(row: OrganizationRow): Organization {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    websiteUrl: row.website_url ?? undefined,
    logoUrl: row.logo_url ?? undefined,
    theme: row.theme,
    createdAt: new Date(row.created_at),
  };
}

export function donorFromRow(row: DonorRow): Donor {
  return {
    id: row.id,
    organizationId: row.organization_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email ?? undefined,
    customFields: row.custom_fields,
  };
}

export function templateFromRow(row: TemplateRow): Template {
  return {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    templateType: row.template_type,
    slides: row.slides,
    isSystemTemplate: row.is_system_template,
    createdAt: new Date(row.created_at),
  };
}

export function deckFromRow(row: DeckRow): Deck {
  return {
    id: row.id,
    organizationId: row.organization_id,
    donorId: row.donor_id ?? undefined,
    templateId: row.template_id,
    accessSlug: row.access_slug,
    resolvedSlides: row.resolved_slides,
    personalizationData: row.personalization_data,
    status: row.status,
    viewCount: row.view_count,
    createdAt: new Date(row.created_at),
    lastViewedAt: row.last_viewed_at ? new Date(row.last_viewed_at) : undefined,
  };
}
