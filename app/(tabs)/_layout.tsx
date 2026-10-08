import { Tabs } from "expo-router";
import { Host, Icon } from "@expo/ui";

import { useTheme } from "@/theme/hooks/useTheme";

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
    <Host colorScheme={isDark ? "dark" : "light"} matchContents>
      <Icon name={name} size={24} />
    </Host>
  );
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab 1",
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? HOME_ICON_SELECTED : HOME_ICON} />,
        }}
      />
      <Tabs.Screen
        name="tab-two"
        options={{
          title: "Tab 2",
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? TAB2_ICON_SELECTED : TAB2_ICON} />,
        }}
      />
    </Tabs>
  );
}
