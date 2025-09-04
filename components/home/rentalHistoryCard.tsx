import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LoadingButton from "@/components/loadingButton";

type RentalHistoryCardProps = {
  title: string;
  address: string;
  stayed: string;
  rent: string;
  rating: string;
  loading?: boolean;
  onPress: () => void;
};

export default function RentalHistoryCard({
  title,
  address,
  stayed,
  rent,
  rating,
  loading = false,
  onPress,
}: RentalHistoryCardProps) {
  return (
    <View className="bg-white shadow-md rounded-xl p-4 mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name="home" size={24} color="#2563EB" />
        <Text className="ml-2 font-semibold text-gray-800">{title}</Text>
      </View>

      <Text className="text-gray-600">{address}</Text>
      <Text className="text-gray-600 mt-2">{stayed}</Text>
      <Text className="text-gray-600">{rent}</Text>
      <Text className="text-yellow-500">{rating}</Text>

      <LoadingButton
        onPress={onPress}
        loading={loading}
        title="View Post"
        loadingText="Viewing..."
        className="mt-4"
      />
    </View>
  );
}
