import React, { useState } from "react";
import {
  ScrollView,
//   TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; 
import { Input } from "@/components/ui/input";

export default function ContactSupport() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = () => {
    const { name, email, message } = form;
    if (!name || !email || !message) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    // TODO: handle actual submission
    alert("Your message has been sent! Our support team will contact you shortly.");
    setForm({ name: "", email: "", message: "" });
  };

  // Dynamic colors
  const bgColor = isDark ? "bg-black" : "bg-gray-100";
  const textPrimary = isDark ? "text-white" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const iconColor = isDark ? "#fff" : "#1f2937";

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => router.push("/(profile)/settings")}
              className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? "bg-neutral-800" : "bg-gray-200"} mr-4`}
            >
              <FeatherIcon name="chevron-left" size={24} color={iconColor} />
            </TouchableOpacity>
            <Text className={`text-2xl font-bold ${textPrimary}`}>Contact Support</Text>
          </View>

          {/* Contact Form Card */}
          <Card className={`${isDark ? "bg-neutral-900" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className={textPrimary}>Send us a message</CardTitle>
              <CardDescription className={textSecondary}>
                Fill out the form below and our support team will get back to you.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <Input
                placeholder="Your Name"
                placeholderTextColor="#9ca3af"
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
                className={`border ${borderColor} rounded-md px-3 py-2 dark:text-white`}
              />
              <Input
                placeholder="Your Email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                className={`border ${borderColor} rounded-md px-3 py-2 dark:text-white`}
              />
              <Textarea
                placeholder="Your Message"
                placeholderTextColor="#9ca3af"
                value={form.message}
                onChangeText={(text) => setForm({ ...form, message: text })}
                className={`border ${borderColor} rounded-md px-3 py-2 dark:text-white`}
              />
            </CardContent>

            <CardFooter className="mt-4">
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-blue-600 rounded-xl py-3 flex-1 items-center"
              >
                <Text className="text-white font-semibold text-base">Send Message</Text>
              </TouchableOpacity>
            </CardFooter>
          </Card>

          <Text className={`text-sm mt-6 text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            We'll respond to your inquiry as soon as possible.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
