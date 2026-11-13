import { Theme, TamaguiProvider } from "tamagui";
import { DatabaseProvider } from "react-native-watermelondb/react";
import type { ReactNode } from "react";

import { ErrorBoundary } from "@/components/common/error-boundary";
import { database } from "@/data";
import { useThemeMode } from "@/theme/hooks/useTheme";
import { useSystemThemeTracking } from "@/theme/stores/useThemeStore";

import tamaguiConfig from "../../tamagui.config";

interface MainProviderProps {
  children: ReactNode;
}

export function MainProvider({ children }: MainProviderProps) {
  useSystemThemeTracking();
  const mode = useThemeMode();
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={mode}>
      <Theme name={mode}>
        <ErrorBoundary>
          <DatabaseProvider database={database}>{children}</DatabaseProvider>
        </ErrorBoundary>
      </Theme>
    </TamaguiProvider>
  );
}
