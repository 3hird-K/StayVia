import ScreenWrapper from "@/components/ScreenWrapper";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import HeaderBtn from "@/components/HeaderBtn";

export default function Setting() {
  const insets = useSafeAreaInsets();
  const systemScheme = useColorScheme(); // "light" | "dark"

  // Theme colors based on device mode
  const theme = useMemo(
    () => ({
      background: systemScheme === "dark" ? "#121212" : "#ffffff",
      card: systemScheme === "dark" ? "#1e1e1e" : "#ffffff",
      text: systemScheme === "dark" ? "#f5f5f5" : "#1c1c1c",
      subText: systemScheme === "dark" ? "#a1a1a1" : "#6b7280",
      border: systemScheme === "dark" ? "#333" : "#e5e7eb",
      icon: systemScheme === "dark" ? "#9ca3af" : "#bcbcbc",
      isDark: systemScheme === "dark",
    }),
    [systemScheme]
  );

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right"]}
      style={{ backgroundColor: theme.background }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView className="px-4 mb-0 pb-0">
          <HeaderBtn title="Account Settings" route="../(protected)/account" />

          {/* Account Security */}
          <View className="py-6">
            <Text
              style={{ color: theme.subText }}
              className="text-xs font-medium uppercase mb-2"
            >
              Account & Security
            </Text>
            <View
              style={{ backgroundColor: theme.card }}
              className="rounded-2xl shadow"
            >
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b"
                style={{ borderColor: theme.border }}
              >
                <Text style={{ color: theme.text }} className="text-base">
                  Change Password
                </Text>
                <View className="flex-1" />
                <Ionicons name="chevron-forward" size={20} color={theme.icon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Help & Support */}
          <View className="py-4">
            <Text
              style={{ color: theme.subText }}
              className="text-xs font-medium uppercase mb-2"
            >
              Help & Support
            </Text>
            <View
              style={{ backgroundColor: theme.card }}
              className="rounded-2xl shadow"
            >
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b"
                style={{ borderColor: theme.border }}
              >
                <Text style={{ color: theme.text }} className="text-base">
                  Help & FAQs
                </Text>
                <View className="flex-1" />
                <Ionicons name="chevron-forward" size={20} color={theme.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b"
                style={{ borderColor: theme.border }}
              >
                <Text style={{ color: theme.text }} className="text-base">
                  Contact Support
                </Text>
                <View className="flex-1" />
                <Ionicons name="chevron-forward" size={20} color={theme.icon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Theme */}
          <View className="py-4">
            <Text
              style={{ color: theme.subText }}
              className="text-xs font-medium uppercase mb-2"
            >
              Theme
            </Text>
            <View
              style={{ backgroundColor: theme.card }}
              className="rounded-2xl shadow"
            >
              <View
                className="flex-row items-center px-4 py-3 border-b"
                style={{ borderColor: theme.border }}
              >
                <Text style={{ color: theme.text }} className="text-base">
                  Dark Mode (follows system)
                </Text>
                <View className="flex-1" />
                <Switch value={theme.isDark} disabled /> 
              </View>
            </View>
          </View>

          {/* About App */}
          <View className="py-4">
            <Text
              style={{ color: theme.subText }}
              className="text-xs font-medium uppercase mb-2"
            >
              About App
            </Text>
            <View
              style={{ backgroundColor: theme.card }}
              className="rounded-2xl shadow"
            >
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b"
                style={{ borderColor: theme.border }}
              >
                <Text style={{ color: theme.text }} className="text-base">
                  Terms & Condition
                </Text>
                <View className="flex-1" />
                <Ionicons name="chevron-forward" size={20} color={theme.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b"
                style={{ borderColor: theme.border }}
              >
                <Text style={{ color: theme.text }} className="text-base">
                  Privacy Policy
                </Text>
                <View className="flex-1" />
                <Ionicons name="chevron-forward" size={20} color={theme.icon} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
