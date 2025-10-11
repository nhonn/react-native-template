/**
 * Theme Hooks (Zustand)
 * Hooks for accessing theme state from Zustand store
 */

import { useSystemThemeTracking, useThemeStore } from "../stores/useThemeStore";

/**
 * Main theme hook - replaces the context-based useTheme
 * @returns Theme store state and actions
 */
export function useTheme() {
  const store = useThemeStore();

  // Initialize system theme tracking
  useSystemThemeTracking();

  return {
    theme: store.theme,
    mode: store.mode,
    isDark: store.mode === "dark",
    setMode: store.setMode,
    toggleMode: store.toggleMode,
    resetMode: store.resetMode,
    setConfig: store.setConfig,
  };
}

// Separate hooks for specific theme aspects
export function useThemeColors() {
  return useThemeStore((state) => state.theme.colors);
}

export function useThemeTypography() {
  return useThemeStore((state) => state.theme.typography);
}

export function useThemeSpacing() {
  return useThemeStore((state) => state.theme.spacing);
}

export function useThemeBorderRadius() {
  return useThemeStore((state) => state.theme.borderRadius);
}

export function useThemeShadows() {
  return useThemeStore((state) => state.theme.shadows);
}

export function useThemeOpacity() {
  return useThemeStore((state) => state.theme.opacity);
}

/**
 * Hook for accessing theme mode only
 */
export function useThemeMode() {
  return useThemeStore((state) => state.mode);
}

/**
 * Hook for checking if current theme is dark
 */
export function useIsDarkTheme() {
  const mode = useThemeStore((state) => state.mode);
  return mode === "dark";
}

/**
 * Hook for theme configuration
 */
export function useThemeConfig() {
  return useThemeStore((state) => ({
    followSystemTheme: state.followSystemTheme,
    defaultMode: state.defaultMode,
    setConfig: state.setConfig,
  }));
}
