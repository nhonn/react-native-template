interface IconSize {
  size: number;
}
interface IconProps {
  xxl: IconSize;
  xl: IconSize;
  lg: IconSize;
  md: IconSize;
  sm: IconSize;
}

export const iconProps: IconProps = {
  xxl: {
    size: 48,
  },
  xl: {
    size: 32,
  },
  lg: {
    size: 28,
  },
  md: {
    size: 24,
  },
  sm: {
    size: 20,
  },
} as const;

export const colors = {
  static: {
    white: "#ffffff",
    black: "#000000",
    gray: {
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    blue: {
      500: "#3b82f6",
      600: "#2563eb",
    },
    green: {
      500: "#10b981",
      600: "#059669",
    },
    red: {
      500: "#ef4444",
      600: "#dc2626",
    },
    yellow: {
      500: "#f59e0b",
      600: "#d97706",
    },
    purple: {
      500: "#8b5cf6",
      600: "#7c3aed",
    },
    gold: "#ffd700",
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;
