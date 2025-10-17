import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Animated, useColorScheme } from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccountType } from "@/hooks/useAccountType"; 

function BouncyIcon({
  name,
  focusedName,
  size,
  color,
  focused,
  bounceAnim,
}: any) {
  return (
    <Animated.View
      style={{
        transform: [{ scale: bounceAnim }],
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name={focused ? focusedName : name} size={size} color={color} />
    </Animated.View>
  );
}

export default function ProtectedTabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // const { isUser, error, isLoading } = useAccountType();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

  // if (error) console.log("Error fetching user:", error);

  // if (isLoading) {
  //   return (
  //     <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-black">
  //       <Skeleton className="w-32 h-32 rounded-full mb-4" />
  //       <Skeleton className="w-1/3 h-6 rounded-full mb-2" />
  //       <Skeleton className="w-1/2 h-4 rounded-full mb-2" />
  //       <Skeleton className="w-2/3 h-4" />
  //     </SafeAreaView>
  //   );
  // }

  const animations = {
    home: useRef(new Animated.Value(1)).current,
    notification: useRef(new Animated.Value(1)).current,
    chat: useRef(new Animated.Value(1)).current,
    account: useRef(new Animated.Value(1)).current,
  };

  const bounce = (key: keyof typeof animations) => {
    Animated.sequence([
      Animated.spring(animations[key], { toValue: 1.15, useNativeDriver: true, friction: 3 }),
      Animated.spring(animations[key], { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
  };

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: isDark ? "#a1a1aa" : "#6b7280",
        tabBarStyle: {
          backgroundColor: isDark ? "#18181b" : "#ffffff",
          borderTopWidth: 0,
          elevation: 24,
          shadowColor: "#000",
          shadowOpacity: isDark ? 0.4 : 0.05,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 6,
          paddingBottom: 6,
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <BouncyIcon
              name="home-outline"
              focusedName="home"
              size={size}
              color={color}
              focused={focused}
              bounceAnim={animations.home}
            />
          ),
        }}
        listeners={{ tabPress: () => bounce("home") }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, size, focused }) => (
            <BouncyIcon
              name="chatbubble-ellipses-outline"
              focusedName="chatbubble-ellipses"
              size={size}
              color={color}
              focused={focused}
              bounceAnim={animations.notification}
            />
          ),
        }}
        listeners={{ tabPress: () => bounce("notification") }}
      />
      {/* <Tabs.Screen
      name="post"
      options={{
        title: "Create",
        tabBarButton: isUser ? () => null : undefined, 
        tabBarIcon: ({ color, size, focused }) =>
          isUser ? (
            <BouncyIcon
              name="add-circle-outline"
              focusedName="add-circle"
              size={size}
              color={color}
              focused={focused}
              bounceAnim={animations.notification}
            />
          ) : null,
        headerShown: false,
      }}
      listeners={{
        tabPress: (e) => {
          if (isUser) e.preventDefault(); // 👈 disables tab press
          else bounce("notification");
        },
      }}
    /> */}

        <Tabs.Screen
          name="post"
          options={{
            title: "Create",
            tabBarIcon: ({ color, size, focused }) => (
              <BouncyIcon
                name="add-circle-outline" 
                focusedName="add-circle"
                size={size}
                color={color}
                focused={focused}
                bounceAnim={animations.notification}
              />
            ),
            tabBarStyle: { display: "none" },
            headerShown: false,
          }}
          listeners={{ tabPress: () => bounce("notification") }}
        />
      

      <Tabs.Screen
        name="notification"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, size, focused }) => (
            <BouncyIcon
              name="notifications-outline"
              focusedName="notifications"
              size={size}
              color={color}
              focused={focused}
              bounceAnim={animations.chat}
            />
          ),
        }}
        listeners={{ tabPress: () => bounce("chat") }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Me",
          tabBarIcon: ({ color, size, focused }) => (
            <BouncyIcon
              name="person-outline"
              focusedName="person"
              size={size}
              color={color}
              focused={focused}
              bounceAnim={animations.account}
            />
          ),
        }}
        listeners={{ tabPress: () => bounce("account") }}
      />
    </Tabs>
  );
}
