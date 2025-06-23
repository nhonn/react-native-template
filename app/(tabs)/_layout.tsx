import { Tabs } from 'expo-router';
import {
  History,
  Home,
} from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName='tab1'
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="tab1"
        options={{
          title: 'Tab 1',
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tab2"
        options={{
          title: 'Tab 2',
          tabBarIcon: ({ color }) => <History size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
