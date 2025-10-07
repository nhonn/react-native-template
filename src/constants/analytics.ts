// Event Types - Following snake_case convention for analytics platforms
export const EVENT_SCREEN_VIEW = "screen_viewed";
export const EVENT_SHEET_VIEW = "sheet_viewed";
export const EVENT_BUTTON_PRESSED = "button_pressed";

// Screen Names - Consistent snake_case format
export const SCREEN_NAMES = {
  // Tab screens
  HOME: "home",

  // Error screens
  NOT_FOUND: "not_found",
} as const;

// Sheet Names - For modal/bottom sheet tracking
export const SHEET_NAMES = {} as const;

// Button/Element Names - Descriptive and consistent
export const BUTTON_ELEMENTS = {} as const;

export type ButtonElement = (typeof BUTTON_ELEMENTS)[keyof typeof BUTTON_ELEMENTS];
