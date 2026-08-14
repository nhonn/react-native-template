import { Tabs } from "expo-router";
import { ClockCounterClockwise, House } from "phosphor-react-native";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab 1",
          tabBarIcon: ({ color }) => <House color={String(color)} size={28} />,
        }}
      />
      <Tabs.Screen
        name="tab2"
        options={{
          title: "Tab 2",
          tabBarIcon: ({ color }) => <ClockCounterClockwise color={String(color)} size={28} />,
        }}
      />
    </Tabs>
  );
}
