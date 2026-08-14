import { NativeTabs } from "expo-router/unstable-native-tabs";

export const unstable_settings = {
  anchor: "(home)",
};

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>Tab 1</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tab2">
        <NativeTabs.Trigger.Label>Tab 2</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "clock", selected: "clock.fill" }} md="history" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
