import { Stack } from "expo-router";

export default function NotificationStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Notifications list */}
      <Stack.Screen
        name="index"
        options={{
          title: "Chats",
        }}
      />

      {/* Chat screen for a specific user */}
      {/* <Stack.Screen
        name="[id]"
        options={{
          title: "Chat",
        }}
      /> */}
    </Stack>
  );
}
