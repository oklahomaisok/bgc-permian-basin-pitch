-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations - the nonprofits using DonorSpark
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  website_url TEXT,
  logo_url TEXT,
  theme JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster slug lookups
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- Donors - individual donors for personalization
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster donor lookups by organization
CREATE INDEX idx_donors_organization ON donors(organization_id);
CREATE INDEX idx_donors_email ON donors(email);

-- Templates - reusable deck structures
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('thank_you', 'impact_story', 'annual_report', 'campaign')),
  slides JSONB NOT NULL DEFAULT '[]',
  is_system_template BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for template lookups
CREATE INDEX idx_templates_organization ON templates(organization_id);
CREATE INDEX idx_templates_type ON templates(template_type);

-- Decks - generated instances with resolved personalization
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES donors(id) ON DELETE SET NULL,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  access_slug TEXT NOT NULL UNIQUE,
  resolved_slides JSONB NOT NULL,
  personalization_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_viewed_at TIMESTAMPTZ
);

-- Indexes for deck lookups
CREATE INDEX idx_decks_access_slug ON decks(access_slug);
CREATE INDEX idx_decks_organization ON decks(organization_id);
CREATE INDEX idx_decks_donor ON decks(donor_id);
CREATE INDEX idx_decks_status ON decks(status);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_deck_view_count(deck_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE decks
  SET view_count = view_count + 1,
      last_viewed_at = NOW()
  WHERE access_slug = deck_slug;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security policies (for future auth implementation)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

-- Public read access for published decks (for deck viewer)
CREATE POLICY "Public can view published decks" ON decks
  FOR SELECT
  USING (status = 'published');

-- Public read access for organizations (needed for deck viewing)
CREATE POLICY "Public can view organizations" ON organizations
  FOR SELECT
  USING (true);

-- Public read access for templates (needed for system templates)
CREATE POLICY "Public can view system templates" ON templates
  FOR SELECT
  USING (is_system_template = true);
