import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Tab 1</Label>
        <Icon sf={{ default: "house", selected: "house.fill" }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tab2">
        <Label>Tab 2</Label>
        <Icon sf={{ default: "clock", selected: "clock.fill" }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
