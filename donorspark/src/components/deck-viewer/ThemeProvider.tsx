'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Theme } from '@/types/theme';
import { defaultTheme, themeToCSSVariables } from '@/types/theme';

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: defaultTheme });

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  theme: Theme;
  children: ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const cssVariables = themeToCSSVariables(theme);

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div
        className="theme-root"
        style={cssVariables as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
