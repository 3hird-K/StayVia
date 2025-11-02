import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "@expo/vector-icons/Feather";

export default function AboutUs() {
  const router = useRouter();
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const isDark = colorScheme === "dark";

  // Define dynamic colors
  const bgColor = isDark ? "bg-black" : "bg-gray-100";
  const cardColor = isDark ? "bg-neutral-800" : "bg-gray-200";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const iconColor = isDark ? "#fff" : "#1f2937";

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`} edges={["top", "bottom"]}>
      <ScrollView className="px-5 py-6">

        {/* Header: Back Button + Title */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => router.push("/account")}
            className={`w-10 h-10 rounded-full items-center justify-center ${cardColor} mr-4 dark:text-white`}
          >
            <FeatherIcon name="chevron-left" size={24} color={iconColor} />
          </TouchableOpacity>
          <Text className={`text-2xl font-bold ${textColor}`}>
            About Us
          </Text>
        </View>

        {/* Description */}
        <Text className={`text-base ${textSecondary} mb-4 leading-7 dark:text-white`}>
          Welcome to <Text className="font-semibold">StayVia</Text>, your go-to platform for finding student-friendly accommodations! Whether you're looking for boarding houses, dormitories, or apartments, we make the search easier, faster, and more reliable.
        </Text>

        <Text className={`text-base ${textSecondary} mb-4 leading-7 dark:text-white`}>
          Our mission is to connect students with safe, affordable, and convenient places to stay near their schools or universities. We focus on providing a smooth browsing experience with clear listings, real-time availability, and trustworthy host information.
        </Text>

        <Text className={`text-base ${textSecondary} mb-4 leading-7 dark:text-white`}>
          With StayVia, you can explore listings, view photos, check amenities, and even contact landlords directly. Our team is committed to creating a platform that is intuitive, secure, and designed to make your search hassle-free.
        </Text>
        <Text className={`text-base ${textSecondary} mb-4 leading-7 dark:text-white`}>
          <Text className="font-semibold">StayVia</Text> is a platform designed for USTP students to find verified rental accommodations. We provide tools such as listings, basic mapping,  messaging and due reminder. StayVia does not own or manage any rental properties.
        </Text>

        {/* Contact */}
        <Text className={`text-base ${textSecondary} mb-2 font-semibold dark:text-white`}>
          Get in Touch
        </Text>
        <Text className={`text-base ${textSecondary} mb-1 dark:text-white`}>
          Email: support@stayvia.com
        </Text>
        <Text className={`text-base ${textSecondary} dark:text-white`}>
          Phone: +63 912 345 6789
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
