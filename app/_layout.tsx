// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ThemeProvider } from '@/hooks/useTheme';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

export default function RootLayout() {  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SQLiteProvider databaseName="qrwallet.db">
      <ThemeProvider>
        {/* Wrap stack to provide language context */}
        <LanguageProvider>
          <Stack initialRouteName='(tabs)'>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(stacks)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </LanguageProvider>
      </ThemeProvider>
    </SQLiteProvider>
  );
}
