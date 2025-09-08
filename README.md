# React Native Template

A modern, feature-rich React Native template built with Expo to jumpstart your mobile application development. This template provides a solid foundation with pre-configured essential tools, comprehensive UI components, and a well-organized project structure.

## Features

### Core Technologies
- **Modern React Native**: Built with React Native 0.79 and React 19
- **Expo Workflow**: Leverages Expo SDK 53 for rapid development
- **TypeScript**: Full TypeScript support for type-safe code
- **Navigation**: File-based routing with Expo Router 5 (tabs, stacks, and modals)
- **Package Manager**: Bun for fast package management and script execution

### Styling & Design System
- **Styling**: TailwindCSS integration via NativeWind 4 with design tokens
- **Theming**: Complete theme system with light/dark mode and system preference sync
- **Typography**: Comprehensive typography system with variants and convenience components
- **Design Tokens**: Centralized design system with colors, spacing, typography, and more

### UI Component Library
- **Button Components**: Primary, secondary, ghost, and danger variants with loading states
- **Input Components**: Text, password, search inputs, and textarea with validation
- **Modal & Sheet**: Bottom sheets and modals with smooth animations
- **Loading States**: Spinner, dots, pulse loaders, and skeleton components
- **Toast System**: Notification system with queue management and animations
- **Typography**: H1-H6 headings, body text, captions with consistent styling

### State & Data Management
- **State Management**: Zustand with persistence and feature-based slices
- **Forms**: React Hook Form with Valibot validation
- **Data Fetching**: React Query with persistent cache and offline support
- **Storage**: MMKV for high-performance local storage

### Developer Experience
- **Internationalization**: i18next with 8 languages (en, es, fr, vi, zh, ja, ko, ms)
- **Icons**: Integration with Lucide React Native
- **Animations**: React Native Reanimated for smooth UI animations
- **Code Quality**: Biome for linting and formatting
- **Git Hooks**: Lefthook for pre-commit validation
- **Configuration Validation**: Automated validation for app identifiers and bundle IDs

## Project Structure

```
react-native-template/
├── src/
│   ├── app/                    # Application screens (Expo Router)
│   │   ├── (modals)/           # Modal screens
│   │   ├── (stacks)/           # Stack navigator screens
│   │   ├── (tabs)/             # Tab navigator screens
│   │   ├── +not-found.tsx      # 404 screen
│   │   └── _layout.tsx         # Root layout
│   ├── components/
│   │   ├── common/             # UI component library
│   │   │   ├── Button.tsx      # Button variants
│   │   │   ├── Input.tsx       # Input components
│   │   │   ├── Modal.tsx       # Modal component
│   │   │   ├── Sheet.tsx       # Bottom sheet
│   │   │   ├── Loading.tsx     # Loading states
│   │   │   ├── Toast.tsx       # Toast notifications
│   │   │   ├── Typography.tsx  # Typography system
│   │   │   └── index.ts        # Component exports
│   │   └── layouts/            # Layout components
│   ├── constants/              # Application constants
│   ├── hooks/                  # Custom React hooks
│   │   ├── useDebounce.ts      # Debounce hook
│   │   ├── useRefreshControl.ts # Pull-to-refresh
│   │   ├── useTheme.ts         # Theme management
│   │   └── useThrottle.ts      # Throttle hook
│   ├── i18n/                   # Internationalization
│   │   ├── locales/            # Translation files (8 languages)
│   │   └── index.ts            # i18n configuration
│   ├── providers/              # React context providers
│   │   └── MainProvider.tsx    # Main app provider
│   ├── stores/                 # Zustand state stores
│   │   └── theme.ts            # Theme store
│   ├── theme/                  # Design system
│   │   ├── ThemeProvider.tsx   # Theme provider
│   │   ├── tokens.ts           # Design tokens
│   │   └── index.ts            # Theme exports
│   └── utils/                  # Utility functions
│       ├── classname.ts        # Class name utilities
│       ├── date.ts             # Date utilities
│       ├── logger.ts           # Logging utilities
│       ├── mmkv.ts             # MMKV storage
│       └── storage.ts          # Storage abstraction
├── scripts/                    # Build and utility scripts
│   └── validate-config.js      # Configuration validation
├── app.json                    # Expo configuration
├── biome.json                  # Biome configuration
├── lefthook.yml               # Git hooks configuration
├── template.config.js         # Template configuration
├── TEMPLATE_USAGE.md          # Template usage guide
└── package.json               # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm/yarn
- iOS/Android development environment (Xcode/Android Studio)
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Create a new project using this template:

```bash
npx create-expo-app --template github:nhonn/react-native-template MyAwesomeApp

# Or using bun (recommended)
bun create expo --template github:nhonn/react-native-template MyAwesomeApp
```

2. Navigate to your project and install dependencies:

```bash
cd MyAwesomeApp
bun install  # or npm install
```

3. Validate your project configuration:

```bash
bun run validate-config
```

4. Start the development server:

```bash
bun start  # or npm start
```

### Running on Devices

- **iOS Simulator**: Press `i` in the terminal or run `bun run ios`
- **Android Emulator**: Press `a` in the terminal or run `bun run android`
- **Development Build**: Use Expo Development Build for full native features

## Usage

### UI Components

The template includes a comprehensive UI component library:

```tsx
import {
  Button,
  Input,
  PasswordInput,
  Modal,
  Sheet,
  Toast,
  Loading,
  H1,
  Body,
  Caption
} from '@/components/common';

function MyScreen() {
  return (
    <View className="flex-1 p-4">
      <H1>Welcome to My App</H1>
      <Body className="mb-4">Enter your details below</Body>
      
      <Input
        placeholder="Enter your name"
        className="mb-4"
      />
      
      <PasswordInput
        placeholder="Enter password"
        className="mb-4"
      />
      
      <Button variant="primary" size="lg">
        Sign In
      </Button>
      
      <Loading className="mt-4" />
    </View>
  );
}
```

### Theming

The template comes with a comprehensive theming system:

```tsx
import { useTheme } from '@/hooks/useTheme';

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

The template uses TailwindCSS via NativeWind with design tokens:

```tsx
import { View } from 'react-native';
import { H2, Body } from '@/components/common';

export default function StyledComponent() {
  return (
    <View className="flex-1 items-center justify-center bg-background-primary">
      <H2 className="text-text-primary mb-4">
        Styled with Design Tokens
      </H2>
      <Body className="text-text-secondary">
        Consistent theming across light and dark modes
      </Body>
    </View>
  );
}
```

### Navigation

The template uses Expo Router with file-based routing:

- `/src/app/index.tsx` - Main entry point
- `/src/app/(tabs)/` - Tab navigator screens
- `/src/app/(stacks)/` - Stack navigator screens
- `/src/app/(modals)/` - Modal screens
- `/src/app/_layout.tsx` - Root layout with providers

### Internationalization

Supports 8 languages with automatic fallback:

```tsx
import { useTranslation } from 'react-i18next';
import { Button, Body } from '@/components/common';

function TranslatedComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <View>
      <Body>{t('greeting')}</Body>
      <Button 
        variant="secondary"
        onPress={() => i18n.changeLanguage('fr')}
      >
        {t('changeLanguage')}
      </Button>
    </View>
  );
}
```

### State Management

Using Zustand with persistence:

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '@/utils/storage';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(persist(
  (set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
  }),
  {
    name: 'user-store',
    storage,
  }
));
```

### Forms with Validation

```tsx
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import { Input, Button } from '@/components/common';

const schema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

function LoginForm() {
  const { control, handleSubmit } = useForm({
    resolver: valibotResolver(schema),
  });
  
  return (
    <View>
      <Input
        control={control}
        name="email"
        placeholder="Email"
        keyboardType="email-address"
      />
      <PasswordInput
        control={control}
        name="password"
        placeholder="Password"
      />
      <Button onPress={handleSubmit(onSubmit)}>
        Sign In
      </Button>
    </View>
  );
}
```

## Customization

### Project Configuration

The template includes automatic validation for project configuration:

1. **App Identifiers**: Update `app.json` with your app name, slug, scheme, and bundle identifiers
2. **Validation**: Run `bun run validate-config` to ensure all identifiers are synchronized
3. **Package Info**: Update `package.json` name and version

### Design System

Customize your brand identity through the design system:

```tsx
// src/theme/tokens.ts
export const tokens = {
  colors: {
    brand: {
      primary: '#your-brand-color',
      secondary: '#your-secondary-color',
    },
    // ... other colors
  },
  typography: {
    fontFamily: {
      heading: 'YourCustomFont-Bold',
      body: 'YourCustomFont-Regular',
    },
  },
};
```

### Component Customization

Extend or modify existing components:

```tsx
// Create custom button variant
import { Button } from '@/components/common';

const CustomButton = ({ children, ...props }) => (
  <Button 
    variant="primary" 
    className="bg-brand-primary border-brand-primary"
    {...props}
  >
    {children}
  </Button>
);
```

## Scripts

- `bun start` - Start the Expo development server
- `bun run ios` - Start the app on iOS simulator
- `bun run android` - Start the app on Android emulator
- `bun run lint` - Run Expo lint to check code quality
- `bun run format` - Format code with Biome
- `bun run format:write` - Format and write changes
- `bun run check` - Run Biome checks (lint + format)
- `bun run validate-config` - Validate project configuration
- `bun run reset-project` - Reset the project to a clean slate

## Dependencies

### Core Dependencies
- **React Native 0.79** with **React 19**
- **Expo SDK 53** with Expo Router 5
- **TypeScript** for type safety
- **Bun** for package management

### UI & Styling
- **NativeWind 4** - TailwindCSS for React Native
- **class-variance-authority** - Component variant management
- **clsx** & **tailwind-merge** - Conditional class names
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch interactions
- **Lucide React Native** - Icon library

### State & Data
- **Zustand 5** - State management
- **React Hook Form** - Form handling
- **Valibot** - Schema validation
- **React Query** - Data fetching (if needed)
- **React Native MMKV** - High-performance storage

### Internationalization
- **i18next** & **react-i18next** - Translation framework
- **8 supported languages**: English, Spanish, French, Vietnamese, Chinese, Japanese, Korean, Malay

### Development Tools
- **Biome** - Fast linting and formatting
- **Lefthook** - Git hooks management
- **TypeScript** - Static type checking

## License

This template is available under the MIT license. See the LICENSE file for more info.
