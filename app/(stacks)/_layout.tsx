import { Stack } from 'expo-router';
import React from 'react';

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="stack1" />
    </Stack>
  );
}
