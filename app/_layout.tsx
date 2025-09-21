import "@/global.css";

import { NAV_THEME } from "@/lib/theme";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme as useDeviceColorScheme } from "nativewind";
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {QueryClient, QueryClientProvider} from  '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const queryClient = new QueryClient();

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const { colorScheme: deviceScheme } = useDeviceColorScheme();
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">(
    "system"
  );

  // Load saved theme preference
  React.useEffect(() => {
    AsyncStorage.getItem("themeMode").then((t) => {
      if (t === "light" || t === "dark" || t === "system") {
        setTheme(t);
      }
    });
  }, []);

  // Determine effective theme
  const effectiveTheme: "light" | "dark" =
    theme === "system"
      ? deviceScheme === "dark"
        ? "dark"
        : "light"
      : theme;

  // Persist user choice
  const changeTheme = React.useCallback((t: "light" | "dark" | "system") => {
    setTheme(t);
    AsyncStorage.setItem("themeMode", t);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache}>
        <ThemeProvider value={NAV_THEME[effectiveTheme] as any}>
          <StatusBar style={effectiveTheme === "dark" ? "light" : "dark"} />
          <Routes />
          <PortalHost />
        </ThemeProvider>
      </ClerkProvider>
    </QueryClientProvider>
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
      {/* Screens shown when user is NOT signed in */}
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

      {/* Screens shown when user IS signed in */}
      {/* <QueryClientProvider client={queryClient}> */}
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(protected)" options={HOME_SCREEN_OPTIONS} />
          <Stack.Screen name="(profile)" options={HOME_SCREEN_OPTIONS} />
          <Stack.Screen name="(chat)" options={HOME_SCREEN_OPTIONS} />
          <Stack.Screen name="(user)" options={HOME_SCREEN_OPTIONS} />
          <Stack.Screen name="(post)" options={HOME_SCREEN_OPTIONS} />
        </Stack.Protected>
      {/* </QueryClientProvider> */}
      
    </Stack>
  );
}

const HOME_SCREEN_OPTIONS = {
  headerShown: false,
  title: "Home",
};

const SIGN_IN_SCREEN_OPTIONS = {
  headerShown: false,
  title: "Sign in",
};

const SIGN_UP_SCREEN_OPTIONS = {
  presentation: "modal",
  title: "",
  headerTransparent: true,
  gestureEnabled: false,
} as const;

const DEFAULT_AUTH_SCREEN_OPTIONS = {
  title: "",
  headerShadowVisible: false,
  headerTransparent: true,
};
