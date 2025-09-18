import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme as useDeviceColorScheme } from 'nativewind';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export { ErrorBoundary } from 'expo-router';

// 👇 Theme context
type ThemeMode = 'light' | 'dark' | 'system';
const ThemeContext = React.createContext<{
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
}>({ theme: 'system', setTheme: () => {} });

export function useThemeMode() {
  return React.useContext(ThemeContext);
}

export default function RootLayout() {
  const { colorScheme: deviceScheme } = useDeviceColorScheme();
  const [theme, setTheme] = React.useState<ThemeMode>('system');

  // load saved theme from storage
  React.useEffect(() => {
    AsyncStorage.getItem('themeMode').then((t) => {
      if (t === 'light' || t === 'dark' || t === 'system') {
        setTheme(t);
      }
    });
  }, []);

  // determine effective theme
  const effectiveTheme: 'light' | 'dark' =
    theme === 'system'
      ? deviceScheme === 'dark'
        ? 'dark'
        : 'light'
      : theme;

  // persist theme on change
  const changeTheme = React.useCallback((t: ThemeMode) => {
    setTheme(t);
    AsyncStorage.setItem('themeMode', t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      <ClerkProvider tokenCache={tokenCache}>
        {/* Cast to 'any' to allow custom theme colors like 'foreground' */}
        <ThemeProvider value={NAV_THEME[effectiveTheme] as any}>
          <StatusBar style={effectiveTheme === 'dark' ? 'light' : 'dark'} />
          <Routes />
          <PortalHost />
        </ThemeProvider>
      </ClerkProvider>
    </ThemeContext.Provider>
  );
}

SplashScreen.preventAutoHideAsync();

function Routes() {
  const { isSignedIn, isLoaded } = useAuth();

  React.useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <Stack>
      {/* Screens only shown when the user is NOT signed in */}
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)/sign-in" options={SIGN_IN_SCREEN_OPTIONS} />
        <Stack.Screen name="(auth)/sign-up" options={SIGN_UP_SCREEN_OPTIONS} />
        <Stack.Screen
          name="(auth)/reset-password"
          options={DEFAULT_AUTH_SCREEN_OPTIONS}
        />
        <Stack.Screen
          name="(auth)/forgot-password"
          options={DEFAULT_AUTH_SCREEN_OPTIONS}
        />
      </Stack.Protected>

      {/* Screens only shown when the user IS signed in */}
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(protected)" options={HOME_SCREEN_OPTIONS} />
        <Stack.Screen name="(profile)" options={HOME_SCREEN_OPTIONS} />
        <Stack.Screen name="(chat)" options={HOME_SCREEN_OPTIONS} />
        <Stack.Screen name="(user)" options={HOME_SCREEN_OPTIONS} />
      </Stack.Protected>
    </Stack>
  );
}

const HOME_SCREEN_OPTIONS = {
  headerShown: false,
  title: 'Home',
};

const SIGN_IN_SCREEN_OPTIONS = {
  headerShown: false,
  title: 'Sign in',
};

const SIGN_UP_SCREEN_OPTIONS = {
  presentation: 'modal',
  title: '',
  headerTransparent: true,
  gestureEnabled: false,
} as const;

const DEFAULT_AUTH_SCREEN_OPTIONS = {
  title: '',
  headerShadowVisible: false,
  headerTransparent: true,
};
