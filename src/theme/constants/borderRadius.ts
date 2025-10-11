/**
 * Border Radius Constants
 * Consistent border radius values for rounded corners
 */

export const BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  base: 6,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  full: 9999,
} as const;

export type BorderRadiusValue = keyof typeof BorderRadius;
