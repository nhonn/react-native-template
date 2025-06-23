// Storage helper using AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper functions using AsyncStorage instead of MMKV
export const storage = {
  // App settings
  setLanguage: async (language: string) => {
    await AsyncStorage.setItem('language', language);
  },
  getLanguage: async () => {
    return (await AsyncStorage.getItem('language')) ?? 'en';
  },

  // Theme settings
  setTheme: async (theme: string) => {
    await AsyncStorage.setItem('theme', theme);
  },
  getTheme: async () => {
    return (await AsyncStorage.getItem('theme')) ?? 'system';
  },

  // First launch
  setFirstLaunch: async (isFirstLaunch: boolean) => {
    await AsyncStorage.setItem('isFirstLaunch', String(isFirstLaunch));
  },
  getFirstLaunch: async () => {
    return (await AsyncStorage.getItem('isFirstLaunch')) === 'true';
  },

  // Notifications
  setNotificationsEnabled: async (enabled: boolean) => {
    await AsyncStorage.setItem('notificationsEnabled', String(enabled));
  },
  getNotificationsEnabled: async () => {
    return (await AsyncStorage.getItem('notificationsEnabled')) === 'true';
  },

  // Biometric
  setBiometricEnabled: async (enabled: boolean) => {
    await AsyncStorage.setItem('biometricEnabled', String(enabled));
  },
  getBiometricEnabled: async () => {
    return (await AsyncStorage.getItem('biometricEnabled')) === 'true';
  },

  // Clear all storage
  clearAll: async () => {
    await AsyncStorage.clear();
  },
};

export const StorageKeys = {
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

export const getItem = async <T>(key: string): Promise<T | null> => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const setItem = async <T>(key: string, value: T): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};
