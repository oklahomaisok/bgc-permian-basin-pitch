export interface ThemeColors {
  primary: string;      // Navy: #1D2350
  secondary: string;    // Gold: #FFC303
  background: string;   // White/cream
  text: string;         // Dark text
  accent: string;       // Highlight color
}

export interface ThemeFonts {
  display: string;      // Liberator/Oswald for headers
  body: string;         // Roboto for body text
  sub: string;          // Roboto Slab for subheadings
}

export interface Theme {
  colors: ThemeColors;
  fonts: ThemeFonts;
  logoUrl?: string;
  filmGrainOpacity?: number;
  ambientGlowColor?: string;
}

export const defaultTheme: Theme = {
  colors: {
    primary: '#1D2350',
    secondary: '#FFC303',
    background: '#F6F3DF',
    text: '#020202',
    accent: '#C54E32',
  },
  fonts: {
    display: 'Funnel Display, sans-serif',
    body: 'Libre Caslon Text, serif',
    sub: 'Libre Caslon Text, serif',
  },
  filmGrainOpacity: 0.12,
  ambientGlowColor: '#EACBB5',
};

export function themeToCSSVariables(theme: Theme): Record<string, string> {
  return {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-background': theme.colors.background,
    '--color-text': theme.colors.text,
    '--color-accent': theme.colors.accent,
    '--font-display': theme.fonts.display,
    '--font-body': theme.fonts.body,
    '--font-sub': theme.fonts.sub,
    '--film-grain-opacity': String(theme.filmGrainOpacity ?? 0.12),
    '--ambient-glow-color': theme.ambientGlowColor ?? '#EACBB5',
  };
}
