import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center w-full mb-8">
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#4B5563" />
      </TouchableOpacity>
      <Text className="text-lg font-semibold text-gray-800 ml-2">
        {title}
      </Text>
    </View>
  );
}
