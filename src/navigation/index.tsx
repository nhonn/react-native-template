import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNavigationContainerRef, type LinkingOptions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Host, Icon } from "@expo/ui";
import * as Linking from "expo-linking";

import { ModalOneScreen } from "@/screens/modal-one";
import { NotFoundScreen } from "@/screens/not-found";
import { StackOneScreen } from "@/screens/stack-one";
import { TabOneScreen } from "@/screens/tab-one";
import { TabTwoScreen } from "@/screens/tab-two";
import { useTheme } from "@/theme/hooks/useTheme";

import type { RootStackParamList, TabsParamList } from "./types";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function resetToTabs() {
  if (!navigationRef.isReady()) return;
  navigationRef.reset({ index: 0, routes: [{ name: "Tabs" }] });
}

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

const HOME_ICON = Icon.select({
  ios: "house",
  android: import("@expo/material-symbols/home.xml"),
});
const HOME_ICON_SELECTED = Icon.select({
  ios: "house.fill",
  android: import("@expo/material-symbols/home.xml"),
});
const TAB2_ICON = Icon.select({
  ios: "clock",
  android: import("@expo/material-symbols/history.xml"),
});
const TAB2_ICON_SELECTED = Icon.select({
  ios: "clock.fill",
  android: import("@expo/material-symbols/history.xml"),
});

function TabBarIcon({
  name,
}: {
  name: typeof HOME_ICON | typeof HOME_ICON_SELECTED | typeof TAB2_ICON | typeof TAB2_ICON_SELECTED;
}) {
  const { isDark } = useTheme();

  return (
    <Host matchContents colorScheme={isDark ? "dark" : "light"}>
      <Icon name={name} size={24} />
    </Host>
  );
}

const Tab = createBottomTabNavigator<TabsParamList>();

function TabsNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={TabOneScreen}
        options={{
          title: "Tab 1",
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? HOME_ICON_SELECTED : HOME_ICON} />,
        }}
      />
      <Tab.Screen
        name="Tab2"
        component={TabTwoScreen}
        options={{
          title: "Tab 2",
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? TAB2_ICON_SELECTED : TAB2_ICON} />,
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="Stack1"
        component={StackOneScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Modal1"
        component={ModalOneScreen}
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: "Oops!" }} />
    </Stack.Navigator>
  );
}
