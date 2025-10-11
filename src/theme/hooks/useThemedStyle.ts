/**
 * Themed Style Hook
 * Hook for creating styles that respond to theme changes
 */

import { useCallback } from "react";
import { StyleSheet } from "react-native";

import { useThemeStore } from "../stores/useThemeStore";
import type { Theme } from "../types";

type StyleFunction<T = Record<string, unknown>> = (theme: Theme) => T;

/**
 * Hook for creating theme-aware styles
 * @param styleFn Function that receives theme and returns style object
 * @returns StyleSheet created with theme tokens
 */
export function useThemedStyle<T = Record<string, unknown>>(styleFn: StyleFunction<T>) {
  const theme = useThemeStore((state) => state.theme);

  return useCallback(() => {
    const styles = styleFn(theme);
    return StyleSheet.create(styles as Record<string, any>);
  }, [theme, styleFn])();
}

/**
 * Hook for creating a single theme-aware style
 * @param styleFn Function that receives theme and returns style object
 * @returns Style object
 */
export function useThemedValue<T>(styleFn: StyleFunction<T>) {
  const theme = useThemeStore((state) => state.theme);

  return useCallback(() => styleFn(theme), [theme, styleFn])();
}
