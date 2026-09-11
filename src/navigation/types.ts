import type { NavigatorScreenParams } from "@react-navigation/native";

export type TabsParamList = {
  Home: undefined;
  Tab2: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList> | undefined;
  Stack1: undefined;
  Modal1: undefined;
  NotFound: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
