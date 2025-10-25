import React from "react";
import { ScrollView, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PrivacyPolicy() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  // Dynamic colors
  const bgColor = isDark ? "bg-black" : "bg-gray-100";
  const cardColor = isDark ? "bg-neutral-900" : "bg-white";
  const textPrimary = isDark ? "text-white" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const iconColor = isDark ? "#fff" : "#1f2937";

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => router.push("/(profile)/settings")}
            className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? "bg-neutral-800" : "bg-gray-200"} mr-4`}
          >
            <FeatherIcon name="chevron-left" size={24} color={iconColor} />
          </TouchableOpacity>
          <Text className={`text-2xl font-bold ${textPrimary}`}>Privacy Policy</Text>
        </View>

        {/* Privacy Policy Card */}
        <Card className={cardColor}>
          <CardHeader>
            <CardTitle className={textPrimary}>Privacy Policy</CardTitle>
            <CardDescription className={`${textSecondary} dark:text-gray-200`}>
              Your privacy is important to us. Please review how we collect, use, and protect your information.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <Text className={`text-sm ${textSecondary} dark:text-gray-200`}>
              1. <Text className="font-semibold">Information Collection:</Text> We collect personal information such as name, email, and usage data to provide our services.
            </Text>
            <Text className={`text-sm ${textSecondary} dark:text-gray-200`}>
              2. <Text className="font-semibold">Use of Information:</Text> Collected information is used to improve app functionality, provide personalized experiences, and communicate with users.
            </Text>
            <Text className={`text-sm ${textSecondary} dark:text-gray-200`}>
              3. <Text className="font-semibold">Data Sharing:</Text> We do not sell your personal information. We may share information with service providers to operate and improve our services.
            </Text>
            <Text className={`text-sm ${textSecondary} dark:text-gray-200`}>
              4. <Text className="font-semibold">Security:</Text> We implement security measures to protect your data from unauthorized access, disclosure, or destruction.
            </Text>
            <Text className={`text-sm ${textSecondary} dark:text-gray-200`}>
              5. <Text className="font-semibold">Cookies & Tracking:</Text> We may use cookies and similar technologies to understand user behavior and improve app experience.
            </Text>
            <Text className={`text-sm ${textSecondary} dark:text-gray-200`}>
              6. <Text className="font-semibold">User Rights:</Text> You can request access to, correction, or deletion of your personal information by contacting our support team.
            </Text>
            <Text className={`text-sm ${textSecondary} dark:text-gray-200`}>
              7. <Text className="font-semibold">Changes to Privacy Policy:</Text> We may update this policy from time to time. Continued use of the app indicates acceptance of the updated policy.
            </Text>
            <Text className={`text-sm ${textSecondary} dark:text-gray-200`}>
              8. <Text className="font-semibold">Contact:</Text> For any questions regarding this policy, please reach out to our support team via the Contact Support page.
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
