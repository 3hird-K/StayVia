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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import HeaderBtn from "@/components/HeaderBtn";
import { FeatherIcon } from "lucide-react-native";

export default function Setting() {
  const systemScheme = useColorScheme();

  const theme = useMemo(
    () => ({
      background: systemScheme === "dark" ? "#121212" : "#f2f2f7",
      card: systemScheme === "dark" ? "#1e1e1e" : "#fff",
      text: systemScheme === "dark" ? "#f5f5f5" : "#1c1c1c",
      subText: systemScheme === "dark" ? "#a1a1a1" : "#6b7280",
      border: systemScheme === "dark" ? "#333" : "#e5e7eb",
      icon: systemScheme === "dark" ? "#9ca3af" : "#bcbcbc",
      isDark: systemScheme === "dark",
    }),
    [systemScheme]
  );

  const SettingItem = ({
    title,
    onPress,
    trailing,
  }: {
    title: string;
    onPress?: () => void;
    trailing?: React.ReactNode;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderColor: theme.border }}
    >
      <Text style={{ color: theme.text, fontSize: 16 }}>{title}</Text>
      <View style={{ flex: 1 }} />
      {trailing ?? <Ionicons name="chevron-forward" size={20} color={theme.icon} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          {/* Header */}
          <HeaderBtn title="Account Settings" route="../(protected)/account" />

          {/* Help & Support */}
          <Text style={{ color: theme.subText, marginBottom: 8, fontSize: 12, fontWeight: "600", textTransform: "uppercase", marginTop: 10 }}>
            Help & Support
          </Text>
          <View style={{ backgroundColor: theme.card, borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
            <SettingItem title="Help & FAQs" onPress={() => router.push("/help")} />
            <SettingItem title="Contact Support" onPress={() => router.push("/contact")} />
          </View>

          {/* Theme */}
          <Text style={{ color: theme.subText, marginBottom: 8, fontSize: 12, fontWeight: "600", textTransform: "uppercase" }}>
            Theme
          </Text>
          <View style={{ backgroundColor: theme.card, borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderColor: theme.border }}>
              <Text style={{ color: theme.text, fontSize: 16 }}>Dark Mode (follows system)</Text>
              <View style={{ flex: 1 }} />
              <Switch value={theme.isDark} disabled />
            </View>
          </View>

          {/* About App */}
          <Text style={{ color: theme.subText, marginBottom: 8, fontSize: 12, fontWeight: "600", textTransform: "uppercase" }}>
            About App
          </Text>
          <View style={{ backgroundColor: theme.card, borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
            <SettingItem title="Terms & Conditions" onPress={() => router.push("/terms")} />
            <SettingItem title="Privacy Policy" onPress={() => router.push("/privacy")} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
