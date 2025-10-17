import { useAccountType } from "@/hooks/useAccountType";
import { Stack } from "expo-router";
import React from "react";

export default function NotificationStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Chats",
        }}
      />
    </Stack>
  );
}
