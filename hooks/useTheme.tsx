import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from "nativewind";
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme as _useColorScheme } from 'react-native';

// Type definitions
export type ThemeType = 'light' | 'dark' | 'system';
export type ColorMode = 'light' | 'dark';

export interface ColorPalette {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  success: string;
  warning: string;
  error: string;
  info: string;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  feature: {
    scan: { background: string; icon: string };
    generate: { background: string; icon: string };
    history: { background: string; icon: string };
    share: { background: string; icon: string };
    settings: { background: string; icon: string };
  };
}

// Storage key for persisting theme preference
const STORAGE_KEY = 'theme-preference';

// Light mode color palette
export const lightPalette: ColorPalette = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#0ea5e9',
  background: {
    primary: '#ffffff',
    secondary: '#f3f4f6',
    tertiary: '#e5e7eb',
  },
  text: {
    primary: '#1f2937',
    secondary: '#4b5563',
    tertiary: '#6b7280',
    inverse: '#ffffff',
  },
  feature: {
    scan: { background: '#e0f2fe', icon: '#0ea5e9' },
    generate: { background: '#ecfdf5', icon: '#10b981' },
    history: { background: '#f3e8ff', icon: '#8b5cf6' },
    share: { background: '#fef3c7', icon: '#f59e0b' },
    settings: { background: '#f3f4f6', icon: '#4b5563' },
  },
};

// Dark mode color palette
export const darkPalette: ColorPalette = {
  primary: {
    50: '#eff6ff', // Keep the lightest shade the same
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#0ea5e9',
  background: {
    primary: '#111827',
    secondary: '#1f2937',
    tertiary: '#374151',
  },
  text: {
    primary: '#f9fafb',
    secondary: '#e5e7eb',
    tertiary: '#9ca3af',
    inverse: '#111827',
  },
  feature: {
    scan: { background: '#0c4a6e', icon: '#38bdf8' },
    generate: { background: '#065f46', icon: '#34d399' },
    history: { background: '#4c1d95', icon: '#c4b5fd' },
    share: { background: '#78350f', icon: '#fbbf24' },
    settings: { background: '#1f2937', icon: '#d1d5db' },
  },
};

// Theme context type
interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colorMode: ColorMode;
  colors: ColorPalette;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Create the context with undefined default
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * Provider component that makes theme data available to all children
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemColorScheme = _useColorScheme() as ColorSchemeName;
  const [theme, setTheme] = useState<ThemeType>('system');
  const [isLoaded, setIsLoaded] = useState(false);
  const { setColorScheme } = useColorScheme();

  // Load saved theme preference
  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTheme !== null) {
          setTheme(savedTheme as ThemeType);
          setColorScheme(savedTheme as ThemeType);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        setIsLoaded(true);
      }
    }

    loadTheme();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    if (isLoaded) {
      setColorScheme(theme);
      AsyncStorage.setItem(STORAGE_KEY, theme).catch(error => {
        console.error('Failed to save theme preference:', error);
      });
    }
  }, [theme, isLoaded]);

  // Determine actual color mode based on theme setting and system preference
  const colorMode = useMemo((): ColorMode => {
    if (theme === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return theme;
  }, [systemColorScheme, theme]);

  const isDarkMode = colorMode === 'dark';
  const colors = isDarkMode ? darkPalette : lightPalette;

  // Toggle between light and dark mode
  const toggleTheme = useCallback((newTheme?: ThemeType) => {
    if (!newTheme) {
      const nextTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(nextTheme);
      return;
    }
    console.log({ newTheme })
    setTheme(newTheme);
  }, []);

  // Create the context value object
  const contextValue = useMemo((): ThemeContextProps => {
    return {
      theme,
      setTheme,
      colorMode,
      colors,
      isDarkMode,
      toggleTheme,
    };
  }, [theme, colorMode, colors, isDarkMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access the theme context
 * @returns Theme context values including current theme, colors, and functions to change theme
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
