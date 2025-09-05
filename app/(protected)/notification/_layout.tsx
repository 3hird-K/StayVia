import { Stack } from "expo-router";

export default function NotificationStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Notifications list */}
      <Stack.Screen
        name="index"
        options={{
          title: "Notifications",
        }}
      />

      {/* Chat screen for a specific user */}
      <Stack.Screen
        name="Chat/[userId]"
        options={{
          title: "Chat",
        }}
      />
    </Stack>
  );
}
