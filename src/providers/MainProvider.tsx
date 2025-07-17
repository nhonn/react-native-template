import type { ReactNode } from "react";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ThemeProvider } from "./ThemeProvider";

interface MainProviderProps {
  children: ReactNode;
}

export function MainProvider({ children }: MainProviderProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>{children}</ThemeProvider>
    </ErrorBoundary>
  );
}
