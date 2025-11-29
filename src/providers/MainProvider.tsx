import type { ReactNode } from "react";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DatabaseProvider } from "@/providers/DatabaseProvider";

interface MainProviderProps {
  children: ReactNode;
}

export function MainProvider({ children }: MainProviderProps) {
  return (
    <ErrorBoundary>
      <DatabaseProvider>{children}</DatabaseProvider>
    </ErrorBoundary>
  );
}
