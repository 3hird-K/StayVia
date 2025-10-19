import "@/global.css";
import { NAV_THEME } from "@/lib/theme";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme as useDeviceColorScheme } from "nativewind";
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/lib/supabase";
import { getUserById } from "@/services/userService";

const queryClient = new QueryClient();

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const { colorScheme: deviceScheme } = useDeviceColorScheme();
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system");

  React.useEffect(() => {
    AsyncStorage.getItem("themeMode").then((t) => {
      if (t === "light" || t === "dark" || t === "system") setTheme(t);
    });
  }, []);

  const effectiveTheme: "light" | "dark" =
    theme === "system" ? (deviceScheme === "dark" ? "dark" : "light") : theme;

  const changeTheme = React.useCallback((t: "light" | "dark" | "system") => {
    setTheme(t);
    AsyncStorage.setItem("themeMode", t);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache} telemetry={false}>
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
  const { user } = useUser();
  const supabase = useSupabase();
  const [userExists, setUserExists] = React.useState<boolean | null>(null);

  // Hide splash once Clerk is ready
  React.useEffect(() => {
    if (isLoaded) SplashScreen.hideAsync();
  }, [isLoaded]);

  const id = user?.id;

  // Fetch user from Supabase
  const { data, error, isLoading } = useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id as string, supabase),
    enabled: !!id,
  });

  // Set userExists safely inside useEffect
  React.useEffect(() => {
    if (!isLoading) {
      setUserExists(!!data);
    }
  }, [data, isLoading]);

  if (!isLoaded || (isSignedIn && userExists === null)) {
    return null; // wait until checks are done
  }

  return (
    <Stack>
      {/* Auth routes */}
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)/sign-in" options={SIGN_IN_SCREEN_OPTIONS} />
        <Stack.Screen name="(auth)/sign-up" options={SIGN_UP_SCREEN_OPTIONS} />
        <Stack.Screen name="(auth)/reset-password" options={DEFAULT_AUTH_SCREEN_OPTIONS} />
        <Stack.Screen name="(auth)/forgot-password" options={DEFAULT_AUTH_SCREEN_OPTIONS} />
      </Stack.Protected>


      {/* Main app routes */}
      <Stack.Protected guard={isSignedIn && !!userExists}>
        <Stack.Screen name="(protected)" options={HOME_SCREEN_OPTIONS} />
        <Stack.Screen name="(profile)" options={HOME_SCREEN_OPTIONS} />
        <Stack.Screen name="(chat)" options={HOME_SCREEN_OPTIONS} />
        <Stack.Screen name="(channel)" options={HOME_SCREEN_OPTIONS} />
        <Stack.Screen name="(user)" options={HOME_SCREEN_OPTIONS} />
        <Stack.Screen name="(conversation)" options={HOME_SCREEN_OPTIONS} />
        <Stack.Screen name="(post)" options={HOME_SCREEN_OPTIONS} />
      </Stack.Protected>
      {/* CreateUser route */}
      <Stack.Protected guard={isSignedIn && !userExists}>
        <Stack.Screen name="(createUser)" options={HOME_SCREEN_OPTIONS} />
      </Stack.Protected>
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
