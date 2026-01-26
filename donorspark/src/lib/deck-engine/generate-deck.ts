import { nanoid } from 'nanoid';
import type { Slide } from '@/types/slide';
import type { Template, Donor, Organization, Deck, PersonalizationData } from '@/types/template';
import { flattenPersonalizationData, resolveValue } from './resolve-merge-tags';

interface GenerateDeckParams {
  template: Template;
  donor?: Donor;
  organization: Organization;
  customData?: Record<string, string | number>;
}

interface GenerateDeckResult {
  accessSlug: string;
  resolvedSlides: Slide[];
  personalizationData: PersonalizationData;
}

/**
 * Generate a personalized deck from a template
 *
 * Flow:
 * 1. Build personalization context from donor, organization, and custom data
 * 2. Resolve all merge tags in template slides
 * 3. Generate unique access slug
 * 4. Return deck data ready for database insertion
 */
export function generateDeck({
  template,
  donor,
  organization,
  customData,
}: GenerateDeckParams): GenerateDeckResult {
  // Build personalization data
  const personalizationData: PersonalizationData = {
    organization: {
      name: organization.name,
    },
  };

  if (donor) {
    personalizationData.donor = {
      firstName: donor.firstName,
      lastName: donor.lastName,
      fullName: `${donor.firstName} ${donor.lastName}`,
      email: donor.email,
      ...donor.customFields,
    };
  }

  if (customData) {
    personalizationData.custom = customData;
  }

  // Flatten for merge tag resolution
  const context = flattenPersonalizationData(personalizationData);

  // Resolve merge tags in all slides
  const resolvedSlides = template.slides.map((slide) =>
    resolveValue(slide, context)
  );

  // Generate unique access slug
  const accessSlug = generateAccessSlug(donor, template);

  return {
    accessSlug,
    resolvedSlides,
    personalizationData,
  };
}

/**
 * Generate a unique, readable access slug for a deck
 */
function generateAccessSlug(donor?: Donor, template?: Template): string {
  const parts: string[] = [];

  // Add donor name if available
  if (donor) {
    const firstName = donor.firstName.toLowerCase().replace(/[^a-z]/g, '');
    const lastName = donor.lastName.toLowerCase().replace(/[^a-z]/g, '');
    if (firstName) parts.push(firstName);
    if (lastName) parts.push(lastName);
  }

  // Add template type hint if no donor name
  if (parts.length === 0 && template) {
    parts.push(template.templateType.replace(/_/g, '-'));
  }

  // Always add unique ID
  parts.push(nanoid(8));

  return parts.join('-');
}

/**
 * Create a full Deck object ready for database insertion
 */
export function createDeckRecord({
  organizationId,
  donorId,
  templateId,
  generatedDeck,
}: {
  organizationId: string;
  donorId?: string;
  templateId: string;
  generatedDeck: GenerateDeckResult;
}): Omit<Deck, 'id' | 'createdAt'> {
  return {
    organizationId,
    donorId,
    templateId,
    accessSlug: generatedDeck.accessSlug,
    resolvedSlides: generatedDeck.resolvedSlides,
    personalizationData: generatedDeck.personalizationData,
    status: 'published',
    viewCount: 0,
  };
}

/**
 * Batch generate decks for multiple donors
 */
export function batchGenerateDecks({
  template,
  donors,
  organization,
}: {
  template: Template;
  donors: Donor[];
  organization: Organization;
}): GenerateDeckResult[] {
  return donors.map((donor) =>
    generateDeck({
      template,
      donor,
      organization,
    })
  );
}
