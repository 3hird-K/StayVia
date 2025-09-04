import React, { useState } from "react";
import { View, Text } from "react-native";
import LoadingButton from "./loadingButton";

type EmptyStateProps = {
  icon: React.ReactNode;
  title?: string; // ✅ optional title
  subtitle?: string; // ✅ optional subtitle/description
  message: string;
  buttonLabel: string;
  onPress: () => void;
};

export default function EmptyState({
  icon,
  title,
  subtitle,
  message,
  buttonLabel,
  onPress,
}: EmptyStateProps) {
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    setLoading(true);
    onPress();
    setTimeout(() => setLoading(false), 1500); 
  };

  return (
    <View className="flex-1 justify-center items-center px-6">
      {icon}
      {title && (
        <Text className="text-xl font-semibold text-gray-900 mt-4 text-center">
          {title}
        </Text>
      )}
      {subtitle && (
        <Text className="text-gray-500 text-center mt-2">{subtitle}</Text>
      )}
      <Text className="text-gray-500 text-center mt-4">{message}</Text>

      <LoadingButton
        onPress={handlePress}
        loading={loading}
        title={buttonLabel}
        loadingText="Please wait..."
        className="bg-indigo-600 px-6 py-3 rounded-lg mt-6"
      />
    </View>
  );
}
