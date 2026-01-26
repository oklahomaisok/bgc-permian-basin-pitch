import type { PersonalizationData, MERGE_TAG_PATTERN } from '@/types/template';

// Pattern to match merge tags like {{donor_first_name}}
const MERGE_TAG_REGEX = /\{\{(\w+)\}\}/g;

/**
 * Flatten personalization data into a simple key-value map
 * Supports nested paths like donor.firstName -> donor_first_name
 */
export function flattenPersonalizationData(
  data: PersonalizationData
): Record<string, string> {
  const result: Record<string, string> = {};

  // Donor fields
  if (data.donor) {
    if (data.donor.firstName) result['donor_first_name'] = data.donor.firstName;
    if (data.donor.lastName) result['donor_last_name'] = data.donor.lastName;
    if (data.donor.fullName) result['donor_full_name'] = data.donor.fullName;
    if (data.donor.email) result['donor_email'] = data.donor.email;

    // Additional donor fields
    Object.entries(data.donor).forEach(([key, value]) => {
      if (value !== undefined && !['firstName', 'lastName', 'fullName', 'email'].includes(key)) {
        result[`donor_${key}`] = String(value);
      }
    });
  }

  // Donation fields
  if (data.donation) {
    if (data.donation.amount !== undefined) {
      result['donation_amount'] = String(data.donation.amount);
    }
    if (data.donation.formattedAmount) {
      result['donation_formatted_amount'] = data.donation.formattedAmount;
    }
    if (data.donation.date) result['donation_date'] = data.donation.date;
    if (data.donation.campaign) result['campaign_name'] = data.donation.campaign;
  }

  // Organization fields
  if (data.organization) {
    if (data.organization.name) result['organization_name'] = data.organization.name;
    if (data.organization.shortName) result['organization_short_name'] = data.organization.shortName;
  }

  // Custom fields
  if (data.custom) {
    Object.entries(data.custom).forEach(([key, value]) => {
      result[key] = String(value);
    });
  }

  return result;
}

/**
 * Resolve merge tags in a string
 * @param text - Text containing merge tags like {{donor_first_name}}
 * @param context - Flattened personalization data
 * @returns Text with merge tags replaced by values
 */
export function resolveMergeTags(
  text: string,
  context: Record<string, string>
): string {
  return text.replace(MERGE_TAG_REGEX, (match, tag) => {
    return context[tag] ?? match; // Keep original if no value found
  });
}

/**
 * Resolve merge tags in any value (string, object, or array)
 * Recursively processes nested structures
 */
export function resolveValue<T>(value: T, context: Record<string, string>): T {
  if (typeof value === 'string') {
    return resolveMergeTags(value, context) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveValue(item, context)) as T;
  }

  if (typeof value === 'object' && value !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = resolveValue(val, context);
    }
    return result as T;
  }

  return value;
}

/**
 * Check if a string contains any merge tags
 */
export function containsMergeTags(text: string): boolean {
  return MERGE_TAG_REGEX.test(text);
}

/**
 * Extract all merge tags from a string
 */
export function extractMergeTags(text: string): string[] {
  const matches = text.matchAll(MERGE_TAG_REGEX);
  return Array.from(matches, (m) => m[1]);
}

/**
 * Get list of available merge tags for documentation/validation
 */
export function getAvailableMergeTags(): string[] {
  return [
    'donor_first_name',
    'donor_last_name',
    'donor_full_name',
    'donor_email',
    'donation_amount',
    'donation_formatted_amount',
    'donation_date',
    'campaign_name',
    'organization_name',
    'organization_short_name',
  ];
}
