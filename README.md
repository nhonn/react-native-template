# React Native Template

A modern, feature-rich React Native template built with Expo to jumpstart your mobile application development. This template provides a solid foundation with pre-configured essential tools and a well-organized project structure.

## Features

- **Modern React Native**: Built with React Native 0.79 and React 19
- **Expo Workflow**: Leverages Expo SDK 53 for rapid development
- **TypeScript**: Full TypeScript support for type-safe code
- **Navigation**: File-based routing with Expo Router 5 (tabs, stacks, and modals)
- **Styling**: TailwindCSS integration via NativeWind 4
- **Theming**: Complete theme system with light/dark mode and system preference sync
- **State Management**: Zustand for simple and effective state management
- **Internationalization**: i18next integration for multi-language support
- **UI Components**: Customizable common components library
- **Icons**: Integration with Lucide React Native and Expo Vector Icons
- **Animations**: React Native Reanimated for smooth animations
- **Persistence**: AsyncStorage for local data persistence
- **Development Tools**: ESLint configuration for code quality

## Project Structure

```
react-native-template/
├── app/                 # Application screens and navigation (Expo Router)
│   ├── (modals)/        # Modal screens
│   ├── (stacks)/        # Stack navigator screens
│   └── (tabs)/          # Tab navigator screens
├── assets/              # Static assets (images, fonts)
├── components/          # UI components
│   ├── common/          # Shared UI elements
│   └── forms/           # Form-related components
├── constants/           # Application constants
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization setup
│   └── locales/         # Language translation files
├── providers/           # React context providers
├── stores/              # Zustand state stores
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- iOS/Android development environment (Xcode/Android Studio)

### Installation

1. Create a new project using this template:

```bash
npx create-expo-app --template my-template-project
```

2. Navigate to your project and install dependencies:

```bash
cd your-project-name
npm install
```

3. Start the development server:

```bash
npm start
```

### Running on Devices

- **iOS Simulator**: Press `i` in the terminal or run `npm run ios`
- **Android Emulator**: Press `a` in the terminal or run `npm run android`
- **Web**: Press `w` in the terminal or run `npm run web`

## Usage

### Theming

The template comes with a comprehensive theming system:

```tsx
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background.primary }}>
      <Text style={{ color: colors.text.primary }}>
        Current theme: {isDarkMode ? 'Dark' : 'Light'}
      </Text>
      <Button onPress={toggleTheme} title="Toggle Theme" />
    </View>
  );
}
```

### Styling with NativeWind

The template uses TailwindCSS via NativeWind:

```tsx
import { View, Text } from 'react-native';

export default function StyledComponent() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <Text className="text-gray-800 dark:text-white text-lg font-semibold">
        Styled with NativeWind
      </Text>
    </View>
  );
}
```

### Navigation

The template uses Expo Router with file-based routing:

- `/app/index.tsx` - Main entry point
- `/app/(tabs)/` - Tab navigator screens
- `/app/(stacks)/` - Stack navigator screens
- `/app/(modals)/` - Modal screens

### Internationalization

```tsx
import { useTranslation } from 'react-i18next';

function TranslatedComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <View>
      <Text>{t('greeting')}</Text>
      <Button 
        title="Change Language" 
        onPress={() => i18n.changeLanguage('fr')} 
      />
    </View>
  );
}
```

## Customization

### Project Name and Bundle ID

Update the following files with your project details:

1. `app.json` - Change name, slug, scheme, and bundle identifiers
2. `package.json` - Update name and version

### Theme Colors

Modify the color palettes in `/hooks/useTheme.tsx` to match your brand colors.

## Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Start the app on iOS simulator
- `npm run android` - Start the app on Android emulator
- `npm run web` - Start the app in a web browser
- `npm run lint` - Run ESLint to check code quality
- `npm run reset-project` - Reset the project to a clean slate

## License

This template is available under the MIT license. See the LICENSE file for more info.
