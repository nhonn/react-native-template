import { useColorScheme } from "nativewind";
import type { ReactNode } from "react";
import { createContext, useEffect, useRef, useState } from "react";

import { dbLogger } from "@/utils/logger";

export type ThemeType = "light" | "dark";

// Define color themes based on tailwind config and existing usage
const colorThemes = {
  light: {
    theme: "#3F51B5",
    background: "#FAF9F6",
    surface: "#F2F2F2",
    text: {
      primary: "#1D1721",
      secondary: "#6B7280",
    },
  },
  dark: {
    theme: "#3F51B5",
    background: "#1E1E1E",
    surface: "#2F2F2F",
    text: {
      primary: "#FFFFFF",
      secondary: "#9CA3AF",
    },
  },
} as const;

type ColorTheme = typeof colorThemes.light | typeof colorThemes.dark;

export interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  colors: ColorTheme;
  setTheme: (theme: ThemeType) => void;
  isThemeLoaded: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreference] = useState<ThemeType>("light");
  const nativewindColorScheme = useColorScheme();

  const [isLoaded, setIsLoaded] = useState(false);
  const initRef = useRef(false);

  // Simple theme resolution - only light or dark
  const isDark = themePreference === "dark";

  const colors: ColorTheme = isDark ? colorThemes.dark : colorThemes.light;

  // Update NativeWind whenever the theme changes
  useEffect(() => {
    nativewindColorScheme.setColorScheme(themePreference);
    dbLogger.info("NativeWind theme updated:", themePreference);
  }, [themePreference, nativewindColorScheme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemePreference(newTheme);
  };

  // Optimized theme loading with minimal operations
  useEffect(() => {
    if (initRef.current) {
      return;
    }
    initRef.current = true;

    const loadTheme = () => {
      // Set default theme to light
      setThemePreference("light");
      // Save default asynchronously without waiting

      dbLogger.info("Using default theme: light");

      setIsLoaded(true);
    };

    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: themePreference,
        isDark,
        colors,
        setTheme,
        isThemeLoaded: isLoaded,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
