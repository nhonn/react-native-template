import type { Theme } from "../types";

/**
 * Generate theme-aware color classes
 */
export function createColorClasses(theme: Theme) {
  const { colors } = theme;

  return {
    // Background colors
    "bg-primary": { backgroundColor: colors.background.primary },
    "bg-secondary": { backgroundColor: colors.background.secondary },
    "bg-tertiary": { backgroundColor: colors.background.tertiary },
    "bg-inverse": { backgroundColor: colors.background.inverse },

    // Surface colors
    "bg-surface": { backgroundColor: colors.surface.primary },
    "bg-surface-secondary": { backgroundColor: colors.surface.secondary },
    "bg-surface-tertiary": { backgroundColor: colors.surface.tertiary },
    "bg-surface-elevated": { backgroundColor: colors.surface.elevated },

    // Text colors
    "text-primary": { color: colors.text.primary },
    "text-secondary": { color: colors.text.secondary },
    "text-tertiary": { color: colors.text.tertiary },
    "text-inverse": { color: colors.text.inverse },
    "text-disabled": { color: colors.text.disabled },
    "text-placeholder": { color: colors.text.placeholder },

    // Border colors
    "border-primary": { borderColor: colors.border.primary },
    "border-secondary": { borderColor: colors.border.secondary },
    "border-focus": { borderColor: colors.border.focus },
    "border-error": { borderColor: colors.border.error },
    "border-success": { borderColor: colors.border.success },
    "border-warning": { borderColor: colors.border.warning },

    // Interactive colors
    "bg-interactive-primary": { backgroundColor: colors.interactive.primary },
    "bg-interactive-primary-hover": { backgroundColor: colors.interactive.primaryHover },
    "bg-interactive-primary-pressed": { backgroundColor: colors.interactive.primaryPressed },
    "bg-interactive-secondary": { backgroundColor: colors.interactive.secondary },
    "bg-interactive-secondary-hover": { backgroundColor: colors.interactive.secondaryHover },
    "bg-interactive-secondary-pressed": { backgroundColor: colors.interactive.secondaryPressed },
    "bg-interactive-disabled": { backgroundColor: colors.interactive.disabled },

    // Semantic colors
    "bg-success": { backgroundColor: colors.semantic.success },
    "bg-success-background": { backgroundColor: colors.semantic.successBackground },
    "bg-error": { backgroundColor: colors.semantic.error },
    "bg-error-background": { backgroundColor: colors.semantic.errorBackground },
    "bg-warning": { backgroundColor: colors.semantic.warning },
    "bg-warning-background": { backgroundColor: colors.semantic.warningBackground },
    "bg-info": { backgroundColor: colors.semantic.info },
    "bg-info-background": { backgroundColor: colors.semantic.infoBackground },
  };
}

/**
 * Generate spacing classes
 */
export function createSpacingClasses(theme: Theme) {
  const { spacing } = theme;
  const classes: Record<string, Record<string, number>> = {};

  // Margin classes
  for (const [key, value] of Object.entries(spacing)) {
    classes[`m-${key}`] = { margin: value };
    classes[`mt-${key}`] = { marginTop: value };
    classes[`mr-${key}`] = { marginRight: value };
    classes[`mb-${key}`] = { marginBottom: value };
    classes[`ml-${key}`] = { marginLeft: value };
    classes[`mx-${key}`] = { marginHorizontal: value };
    classes[`my-${key}`] = { marginVertical: value };

    // Padding classes
    classes[`p-${key}`] = { padding: value };
    classes[`pt-${key}`] = { paddingTop: value };
    classes[`pr-${key}`] = { paddingRight: value };
    classes[`pb-${key}`] = { paddingBottom: value };
    classes[`pl-${key}`] = { paddingLeft: value };
    classes[`px-${key}`] = { paddingHorizontal: value };
    classes[`py-${key}`] = { paddingVertical: value };
  }

  return classes;
}

/**
 * Generate typography classes
 */
export function createTypographyClasses(theme: Theme) {
  const { typography } = theme;
  const classes: Record<string, Record<string, any>> = {};

  // Font size classes
  for (const [key, value] of Object.entries(typography.fontSize)) {
    classes[`text-${key}`] = { fontSize: value };
  }

  // Font weight classes
  for (const [key, value] of Object.entries(typography.fontWeight)) {
    classes[`font-${key}`] = { fontWeight: value };
  }

  // Line height classes
  for (const [key, value] of Object.entries(typography.lineHeight)) {
    classes[`leading-${key}`] = { lineHeight: value };
  }

  // Letter spacing classes
  for (const [key, value] of Object.entries(typography.letterSpacing)) {
    classes[`tracking-${key}`] = { letterSpacing: value };
  }

  // Font family classes
  for (const [key, value] of Object.entries(typography.fontFamily)) {
    classes[`font-family-${key}`] = { fontFamily: value };
  }

  return classes;
}

/**
 * Generate utility classes for common patterns
 */
export function createUtilityClasses(theme: Theme) {
  const { borderRadius, shadows } = theme;

  return {
    // Border radius classes
    ...Object.fromEntries(
      Object.entries(borderRadius).map(([key, value]) => [`rounded-${key}`, { borderRadius: value }]),
    ),

    // Shadow classes
    ...Object.fromEntries(Object.entries(shadows).map(([key, value]) => [`shadow-${key}`, value])),

    // Common utility classes
    flex: { display: "flex" },
    "flex-row": { flexDirection: "row" },
    "flex-col": { flexDirection: "column" },
    "items-center": { alignItems: "center" },
    "items-start": { alignItems: "flex-start" },
    "items-end": { alignItems: "flex-end" },
    "justify-center": { justifyContent: "center" },
    "justify-start": { justifyContent: "flex-start" },
    "justify-end": { justifyContent: "flex-end" },
    "justify-between": { justifyContent: "space-between" },
    "justify-around": { justifyContent: "space-around" },
    absolute: { position: "absolute" },
    relative: { position: "relative" },
    hidden: { display: "none" },
    "w-full": { width: "100%" },
    "h-full": { height: "100%" },
  };
}
