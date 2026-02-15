import type { ReactNode } from "react";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useSystemThemeTracking } from "@/theme/stores/useThemeStore";

interface MainProviderProps {
  children: ReactNode;
}

export function MainProvider({ children }: MainProviderProps) {
  useSystemThemeTracking();
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
