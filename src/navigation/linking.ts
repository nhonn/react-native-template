import type { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import type { RootStackParamList } from "./types";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/"), "mytemplateproject://"],
  config: {
    screens: {
      Tabs: {
        path: "",
        screens: {
          Home: "",
          Tab2: "tab2",
        },
      },
      Stack1: "stack1",
      Modal1: "modal1",
      NotFound: "*",
    },
  },
};
