import type { ReactNode } from "react";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ThemeProvider } from "@/theme/ThemeProvider";

interface MainProviderProps {
  children: ReactNode;
}

export function MainProvider({ children }: MainProviderProps) {
  return (
    <ThemeProvider>
      <ErrorBoundary>{children}</ErrorBoundary>
    </ThemeProvider>
  );
}
