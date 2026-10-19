import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon, type IconName } from "@/components/common/icon";

function TabBarIcon({ name, color, size }: { name: IconName; color: ColorValue; size: number }) {
  return (
    <Icon
      accessibilityElementsHidden
      color={color}
      importantForAccessibility="no-hide-descendants"
      name={name}
      size={size}
    />
  );
}

export default function TabLayout() {
  const { t } = useTranslation("screens");

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t("tab1.title"),
          tabBarIcon: ({ color, size }) => <TabBarIcon color={color} name="house" size={size} />,
        }}
      />
      <Tabs.Screen
        name="tab-two"
        options={{
          title: t("tab2.title"),
          tabBarIcon: ({ color, size }) => <TabBarIcon color={color} name="clock" size={size} />,
        }}
      />
    </Tabs>
  );
}
