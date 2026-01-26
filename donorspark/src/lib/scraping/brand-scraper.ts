import puppeteer, { type Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import type { Theme } from '@/types/theme';

export interface BrandAssets {
  logo: string | null;
  favicon: string | null;
  colors: ExtractedColors;
  fonts: ExtractedFonts;
  suggestedTheme: Partial<Theme>;
}

export interface ExtractedColors {
  primary: string[];
  accent: string[];
  background: string[];
  text: string[];
}

export interface ExtractedFonts {
  headings: string[];
  body: string[];
}

// Common logo selectors in order of specificity
const LOGO_SELECTORS = [
  'img[class*="logo"]',
  'img[id*="logo"]',
  'img[alt*="logo" i]',
  'a[class*="logo"] img',
  'header img:first-of-type',
  '.header img:first-of-type',
  'nav img:first-of-type',
  '[class*="brand"] img',
  '[id*="brand"] img',
];

// Favicon selectors
const FAVICON_SELECTORS = [
  'link[rel="icon"]',
  'link[rel="shortcut icon"]',
  'link[rel="apple-touch-icon"]',
  'link[rel="apple-touch-icon-precomposed"]',
];

/**
 * Scrape brand assets from a website URL
 */
export async function scrapeBrandAssets(url: string): Promise<BrandAssets> {
  let browser;

  try {
    // Launch headless browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set a reasonable viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to URL
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Get page HTML content
    const html = await page.content();
    const $ = cheerio.load(html);

    // Extract logo
    const logo = await extractLogo($, page, url);

    // Extract favicon
    const favicon = extractFavicon($, url);

    // Extract colors from computed styles
    const colors = await extractColors(page);

    // Extract fonts from computed styles
    const fonts = await extractFonts(page);

    // Generate suggested theme
    const suggestedTheme = generateSuggestedTheme(colors, fonts);

    return {
      logo,
      favicon,
      colors,
      fonts,
      suggestedTheme,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Extract logo URL from page
 */
async function extractLogo(
  $: cheerio.CheerioAPI,
  page: Page,
  baseUrl: string
): Promise<string | null> {
  // Try each selector in order
  for (const selector of LOGO_SELECTORS) {
    const elements = $(selector);
    if (elements.length > 0) {
      const src = elements.first().attr('src');
      if (src) {
        return resolveUrl(src, baseUrl);
      }
    }
  }

  // Try to find logo via puppeteer if cheerio fails
  for (const selector of LOGO_SELECTORS) {
    try {
      const element = await page.$(selector);
      if (element) {
        const src = await element.evaluate((el) => {
          if (el instanceof HTMLImageElement) return el.src;
          return null;
        });
        if (src) return src;
      }
    } catch {
      // Continue to next selector
    }
  }

  return null;
}

/**
 * Extract favicon URL
 */
function extractFavicon($: cheerio.CheerioAPI, baseUrl: string): string | null {
  for (const selector of FAVICON_SELECTORS) {
    const element = $(selector);
    if (element.length > 0) {
      const href = element.first().attr('href');
      if (href) {
        return resolveUrl(href, baseUrl);
      }
    }
  }

  // Default favicon location
  return resolveUrl('/favicon.ico', baseUrl);
}

/**
 * Extract colors from page CSS
 */
async function extractColors(page: Page): Promise<ExtractedColors> {
  const colors = await page.evaluate(() => {
    const colorMap: Record<string, number> = {};

    // Get all stylesheets
    const styleSheets = Array.from(document.styleSheets);

    for (const sheet of styleSheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          if (rule instanceof CSSStyleRule) {
            const style = rule.style;

            // Extract color-related properties
            const colorProps = [
              'color',
              'background-color',
              'border-color',
              'fill',
            ];

            for (const prop of colorProps) {
              const value = style.getPropertyValue(prop);
              if (value && value !== 'transparent' && value !== 'inherit') {
                // Normalize color value
                const normalized = normalizeColor(value);
                if (normalized) {
                  colorMap[normalized] = (colorMap[normalized] || 0) + 1;
                }
              }
            }
          }
        }
      } catch {
        // Skip cross-origin stylesheets
      }
    }

    // Also sample computed styles from key elements
    const keyElements = [
      document.body,
      document.querySelector('header'),
      document.querySelector('nav'),
      document.querySelector('main'),
      document.querySelector('h1'),
      document.querySelector('a'),
      document.querySelector('button'),
    ].filter(Boolean) as Element[];

    for (const el of keyElements) {
      const computed = window.getComputedStyle(el);
      const bgColor = computed.backgroundColor;
      const textColor = computed.color;

      if (bgColor && bgColor !== 'transparent') {
        const normalized = normalizeColor(bgColor);
        if (normalized) {
          colorMap[normalized] = (colorMap[normalized] || 0) + 5; // Weight computed styles higher
        }
      }

      if (textColor) {
        const normalized = normalizeColor(textColor);
        if (normalized) {
          colorMap[normalized] = (colorMap[normalized] || 0) + 5;
        }
      }
    }

    function normalizeColor(color: string): string | null {
      // Skip common non-colors
      if (!color || color === 'inherit' || color === 'transparent' || color === 'initial') {
        return null;
      }

      // Convert rgb/rgba to hex
      const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);

        // Skip near-white and near-black (too common)
        if ((r > 245 && g > 245 && b > 245) || (r < 10 && g < 10 && b < 10)) {
          return null;
        }

        return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
      }

      // Return hex colors as-is
      if (color.match(/^#[0-9a-fA-F]{3,6}$/)) {
        return color.toLowerCase();
      }

      return null;
    }

    // Sort by frequency and return top colors
    const sortedColors = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => color);

    return sortedColors;
  });

  // Categorize colors
  const categorized: ExtractedColors = {
    primary: [],
    accent: [],
    background: [],
    text: [],
  };

  for (const color of colors.slice(0, 20)) {
    const category = categorizeColor(color);
    if (categorized[category].length < 3) {
      categorized[category].push(color);
    }
  }

  return categorized;
}

/**
 * Extract fonts from page
 */
async function extractFonts(page: Page): Promise<ExtractedFonts> {
  const fonts = await page.evaluate(() => {
    const fontMap: Record<string, { type: 'heading' | 'body'; count: number }> = {};

    // Sample key elements
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const bodyElements = document.querySelectorAll('p, li, span, div');

    for (const el of headingElements) {
      const computed = window.getComputedStyle(el);
      const fontFamily = computed.fontFamily.split(',')[0].trim().replace(/["']/g, '');
      if (fontFamily) {
        if (!fontMap[fontFamily]) {
          fontMap[fontFamily] = { type: 'heading', count: 0 };
        }
        fontMap[fontFamily].count++;
      }
    }

    for (const el of Array.from(bodyElements).slice(0, 20)) {
      const computed = window.getComputedStyle(el);
      const fontFamily = computed.fontFamily.split(',')[0].trim().replace(/["']/g, '');
      if (fontFamily) {
        if (!fontMap[fontFamily]) {
          fontMap[fontFamily] = { type: 'body', count: 0 };
        }
        fontMap[fontFamily].count++;
      }
    }

    return fontMap;
  });

  const headings: string[] = [];
  const body: string[] = [];

  for (const [font, data] of Object.entries(fonts)) {
    if (data.type === 'heading' && headings.length < 3) {
      headings.push(font);
    } else if (data.type === 'body' && body.length < 3) {
      body.push(font);
    }
  }

  return { headings, body };
}

/**
 * Categorize a color as primary, accent, background, or text
 */
function categorizeColor(hex: string): keyof ExtractedColors {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Very light colors are likely backgrounds
  if (luminance > 0.9) {
    return 'background';
  }

  // Very dark colors are likely text
  if (luminance < 0.2) {
    return 'text';
  }

  // Calculate saturation to distinguish between primary and accent
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;

  // High saturation suggests accent color
  if (saturation > 0.5) {
    return 'accent';
  }

  return 'primary';
}

/**
 * Resolve relative URLs to absolute
 */
function resolveUrl(path: string, baseUrl: string): string {
  try {
    return new URL(path, baseUrl).href;
  } catch {
    return path;
  }
}

/**
 * Generate a suggested theme from extracted colors and fonts
 */
function generateSuggestedTheme(
  colors: ExtractedColors,
  fonts: ExtractedFonts
): Partial<Theme> {
  return {
    colors: {
      primary: colors.primary[0] || '#1D2350',
      secondary: colors.accent[1] || colors.primary[1] || '#FFC303',
      background: colors.background[0] || '#FFFFFF',
      text: colors.text[0] || '#020202',
      accent: colors.accent[0] || '#C54E32',
    },
    fonts: {
      display: fonts.headings[0] || 'system-ui',
      body: fonts.body[0] || 'system-ui',
      sub: fonts.body[0] || 'system-ui',
    },
  };
}
