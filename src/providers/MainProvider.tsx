import { DatabaseProvider } from "@nozbe/watermelondb/react";
import type { ReactNode } from "react";

import { ErrorBoundary } from "@/components/common/error-boundary";
import { database } from "@/data";
import { useSystemThemeTracking } from "@/theme/stores/useThemeStore";

interface MainProviderProps {
  children: ReactNode;
}

export function MainProvider({ children }: MainProviderProps) {
  useSystemThemeTracking();
  return (
    <ErrorBoundary>
      <DatabaseProvider database={database}>{children}</DatabaseProvider>
    </ErrorBoundary>
  );
}
