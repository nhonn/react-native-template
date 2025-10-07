import { createContext, type ReactNode, useContext } from "react";

const AnalyticsScreenContext = createContext<string | undefined>(undefined);

interface AnalyticsScreenProviderProps {
  screenName?: string;
  children: ReactNode;
}

export const AnalyticsScreenProvider = ({ screenName, children }: AnalyticsScreenProviderProps) => {
  return <AnalyticsScreenContext.Provider value={screenName}>{children}</AnalyticsScreenContext.Provider>;
};

export const useAnalyticsScreen = () => {
  return useContext(AnalyticsScreenContext);
};
