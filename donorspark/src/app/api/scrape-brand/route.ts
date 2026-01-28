import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { Vibrant } from 'node-vibrant/node';

export interface ScrapedBrand {
  logo: string | null;
  favicon: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  orgName: string | null;
  tagline: string | null;
}

// Known nonprofit color schemes (for instant results)
const KNOWN_BRANDS: Record<string, Partial<ScrapedBrand>> = {
  'seacadets.org': {
    logo: '/images/sea-cadets/logo.png',
    primaryColor: '#1D2350',
    secondaryColor: '#FFC303',
    accentColor: '#FFC303',
    orgName: 'US Naval Sea Cadet Corps',
  },
  'habitat.org': {
    primaryColor: '#004F9F',
    secondaryColor: '#F7941D',
    accentColor: '#F7941D',
    orgName: 'Habitat for Humanity',
  },
  'redcross.org': {
    primaryColor: '#ED1B2E',
    secondaryColor: '#FFFFFF',
    accentColor: '#ED1B2E',
    orgName: 'American Red Cross',
  },
  'feedingamerica.org': {
    primaryColor: '#F36E21',
    secondaryColor: '#00A651',
    accentColor: '#F36E21',
    orgName: 'Feeding America',
  },
  'bgca.org': {
    primaryColor: '#003DA5',
    secondaryColor: '#FDB913',
    accentColor: '#FDB913',
    orgName: 'Boys & Girls Clubs of America',
  },
};

function resolveUrl(path: string, baseUrl: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('//')) return 'https:' + path;
  try {
    return new URL(path, baseUrl).href;
  } catch {
    return path;
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  let browser = null;

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Normalize URL
    let normalizedUrl = url;
    if (!url.startsWith('http')) {
      normalizedUrl = 'https://' + url;
    }

    // Check for known brands first (instant results)
    const domain = new URL(normalizedUrl).hostname.replace('www.', '');
    const knownBrand = KNOWN_BRANDS[domain];

    if (knownBrand) {
      return NextResponse.json({
        logo: knownBrand.logo || null,
        favicon: `https://${domain}/favicon.ico`,
        primaryColor: knownBrand.primaryColor || '#1D2350',
        secondaryColor: knownBrand.secondaryColor || '#FFC303',
        accentColor: knownBrand.accentColor || '#FFC303',
        orgName: knownBrand.orgName || null,
        tagline: null,
        source: 'known_brand',
      });
    }

    // Launch headless browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set viewport to capture above-the-fold content
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to the page
    await page.goto(normalizedUrl, {
      waitUntil: 'networkidle2',
      timeout: 15000,
    });

    // Extract logo URL from the page
    const logoUrl = await page.evaluate(() => {
      const selectors = [
        'img[class*="logo"]',
        'img[id*="logo"]',
        'img[alt*="logo" i]',
        'a[class*="logo"] img',
        'header img:first-of-type',
        '.header img:first-of-type',
        'nav img:first-of-type',
        '[class*="brand"] img',
        '.site-logo img',
        '#logo img',
        '.logo img',
      ];

      for (const selector of selectors) {
        const el = document.querySelector(selector) as HTMLImageElement;
        if (el && el.src) {
          return el.src;
        }
      }
      return null;
    });

    // Extract favicon
    const faviconUrl = await page.evaluate(() => {
      const link = document.querySelector('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]') as HTMLLinkElement;
      return link?.href || null;
    }) || `https://${domain}/favicon.ico`;

    // Extract org name and tagline
    const { orgName, tagline } = await page.evaluate(() => {
      const name = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
                   document.querySelector('meta[name="application-name"]')?.getAttribute('content') ||
                   document.title.split('|')[0].split('-')[0].trim() ||
                   null;

      const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') ||
                   document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                   null;

      return { orgName: name, tagline: desc };
    });

    // Extract colors from specific UI elements (buttons, links, headers)
    const elementColors = await page.evaluate(() => {
      const colors: { color: string; source: string; count: number }[] = [];

      const rgbToHex = (r: number, g: number, b: number) => {
        return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
      };

      const parseColor = (colorStr: string): string | null => {
        if (!colorStr || colorStr === 'transparent' || colorStr === 'rgba(0, 0, 0, 0)') return null;

        // Parse rgb/rgba
        const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1]);
          const g = parseInt(rgbMatch[2]);
          const b = parseInt(rgbMatch[3]);
          // Skip near-white, near-black, and grays
          if (r > 240 && g > 240 && b > 240) return null;
          if (r < 15 && g < 15 && b < 15) return null;
          if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10) return null;
          return rgbToHex(r, g, b);
        }
        return null;
      };

      // Get CTA button colors (highest priority for accent)
      const buttons = document.querySelectorAll('button, .btn, [class*="button"], [class*="btn"], a[class*="btn"], input[type="submit"]');
      buttons.forEach(btn => {
        const style = window.getComputedStyle(btn);
        const bg = parseColor(style.backgroundColor);
        if (bg) {
          const existing = colors.find(c => c.color === bg && c.source === 'button');
          if (existing) existing.count++;
          else colors.push({ color: bg, source: 'button', count: 1 });
        }
      });

      // Get link colors
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        const style = window.getComputedStyle(link);
        const color = parseColor(style.color);
        if (color) {
          const existing = colors.find(c => c.color === color && c.source === 'link');
          if (existing) existing.count++;
          else colors.push({ color: color, source: 'link', count: 1 });
        }
      });

      // Get header/nav background
      const headers = document.querySelectorAll('header, nav, .header, .nav, .navbar');
      headers.forEach(header => {
        const style = window.getComputedStyle(header);
        const bg = parseColor(style.backgroundColor);
        if (bg) {
          colors.push({ color: bg, source: 'header', count: 5 }); // High weight for headers
        }
      });

      // Get heading colors (h1, h2)
      const headings = document.querySelectorAll('h1, h2');
      headings.forEach(heading => {
        const style = window.getComputedStyle(heading);
        const color = parseColor(style.color);
        if (color) {
          const existing = colors.find(c => c.color === color && c.source === 'heading');
          if (existing) existing.count++;
          else colors.push({ color: color, source: 'heading', count: 1 });
        }
      });

      return colors;
    });

    // Take screenshot for color extraction
    const screenshot = await page.screenshot({
      type: 'png',
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 800,
      },
    });

    await browser.close();
    browser = null;

    // Extract colors from screenshot using Vibrant
    const palette = await Vibrant.from(screenshot as Buffer).getPalette();

    // Helper to calculate color distance (simple RGB distance)
    const colorDistance = (hex1: string, hex2: string): number => {
      const r1 = parseInt(hex1.slice(1, 3), 16);
      const g1 = parseInt(hex1.slice(3, 5), 16);
      const b1 = parseInt(hex1.slice(5, 7), 16);
      const r2 = parseInt(hex2.slice(1, 3), 16);
      const g2 = parseInt(hex2.slice(3, 5), 16);
      const b2 = parseInt(hex2.slice(5, 7), 16);
      return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
    };

    // Build colors found array
    const colorsFound: string[] = [];

    // Add Vibrant palette colors
    const vibrantColors: { hex: string; label: string }[] = [];
    if (palette.DarkVibrant) vibrantColors.push({ hex: rgbToHex(...palette.DarkVibrant.rgb as [number, number, number]), label: 'DarkVibrant' });
    if (palette.Vibrant) vibrantColors.push({ hex: rgbToHex(...palette.Vibrant.rgb as [number, number, number]), label: 'Vibrant' });
    if (palette.Muted) vibrantColors.push({ hex: rgbToHex(...palette.Muted.rgb as [number, number, number]), label: 'Muted' });
    if (palette.DarkMuted) vibrantColors.push({ hex: rgbToHex(...palette.DarkMuted.rgb as [number, number, number]), label: 'DarkMuted' });
    if (palette.LightVibrant) vibrantColors.push({ hex: rgbToHex(...palette.LightVibrant.rgb as [number, number, number]), label: 'LightVibrant' });
    if (palette.LightMuted) vibrantColors.push({ hex: rgbToHex(...palette.LightMuted.rgb as [number, number, number]), label: 'LightMuted' });

    // Add element colors to colorsFound
    const sortedElementColors = elementColors.sort((a, b) => b.count - a.count);
    sortedElementColors.forEach(c => {
      colorsFound.push(`${c.color} (${c.source})`);
    });
    vibrantColors.forEach(c => {
      colorsFound.push(`${c.hex} (${c.label})`);
    });

    // Determine primary color (prefer header bg or dark vibrant)
    let primaryColor = '#1D2350';
    const headerColor = elementColors.find(c => c.source === 'header');
    if (headerColor) {
      primaryColor = headerColor.color;
    } else if (palette.DarkVibrant) {
      primaryColor = rgbToHex(...palette.DarkVibrant.rgb as [number, number, number]);
    } else if (palette.DarkMuted) {
      primaryColor = rgbToHex(...palette.DarkMuted.rgb as [number, number, number]);
    }

    // Determine accent color (prefer button colors that contrast with primary)
    let accentColor = '#FFC303';
    const buttonColors = elementColors.filter(c => c.source === 'button').sort((a, b) => b.count - a.count);
    for (const btn of buttonColors) {
      if (colorDistance(btn.color, primaryColor) > 100) {
        accentColor = btn.color;
        break;
      }
    }
    // Fallback to Vibrant if no good button color
    if (accentColor === '#FFC303' && palette.Vibrant) {
      const vibrantHex = rgbToHex(...palette.Vibrant.rgb as [number, number, number]);
      if (colorDistance(vibrantHex, primaryColor) > 80) {
        accentColor = vibrantHex;
      }
    }
    // Try LightVibrant if Vibrant is too similar
    if (accentColor === '#FFC303' && palette.LightVibrant) {
      const lightVibrantHex = rgbToHex(...palette.LightVibrant.rgb as [number, number, number]);
      if (colorDistance(lightVibrantHex, primaryColor) > 80) {
        accentColor = lightVibrantHex;
      }
    }

    // Determine secondary color (link colors or contrasting vibrant color)
    let secondaryColor = accentColor;
    const linkColors = elementColors.filter(c => c.source === 'link').sort((a, b) => b.count - a.count);
    for (const link of linkColors) {
      if (colorDistance(link.color, primaryColor) > 50 && colorDistance(link.color, accentColor) > 50) {
        secondaryColor = link.color;
        break;
      }
    }
    // If secondary is same as accent, try to find a different vibrant color
    if (secondaryColor === accentColor) {
      for (const vc of vibrantColors) {
        if (colorDistance(vc.hex, primaryColor) > 50 && colorDistance(vc.hex, accentColor) > 50) {
          secondaryColor = vc.hex;
          break;
        }
      }
    }

    return NextResponse.json({
      logo: logoUrl,
      favicon: faviconUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      orgName,
      tagline,
      source: 'visual',
      colorsFound,
    });
  } catch (error) {
    console.error('Scraping error:', error);

    if (browser) {
      await browser.close();
    }

    // Return defaults on error
    return NextResponse.json({
      logo: null,
      favicon: null,
      primaryColor: '#1D2350',
      secondaryColor: '#FFC303',
      accentColor: '#FFC303',
      orgName: null,
      tagline: null,
      source: 'default',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
