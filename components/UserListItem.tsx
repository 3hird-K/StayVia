import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { User } from "@/services/userService";
import DownloadImage from "./download/downloadImage";
import { useSupabase } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";

type Props = {
  user: User;
  onPress?: (user: User) => void;
};

export default function UserListItem({ user, onPress }: Props) {
  const supabase = useSupabase();
  const {user: userLog} = useUser();
  const defaultAvatar = "https://i.pravatar.cc/150";
  const avatarUrl =
    !userLog?.imageUrl || userLog.imageUrl.includes("clerk.dev/static")
      ? defaultAvatar
      : userLog.imageUrl;
  return (
    <Pressable
      onPress={() => onPress?.(user)}
      className="flex-row items-center gap-4 p-4 border-b border-gray-100"
    >
      <View className="bg-gray-200 w-12 h-12 items-center justify-center rounded-full overflow-hidden">
        {user.avatar ? (
          <DownloadImage
            path={user?.avatar}
            supabase={supabase}
            fallbackUri={avatarUrl} 
            className="w-16 h-16 rounded-full mr-3"
          />
        ) : (
          <Text className="text-lg font-bold text-gray-600">
            {user.firstname?.charAt(0).toUpperCase() ||
              user.username.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>

      <View>
        <Text className="text-gray-900 font-medium">
          {user.firstname && user.lastname
            ? `${user.firstname} ${user.lastname}`
            : user.username}
        </Text>
        {user.account_type && (
          <Text className="text-gray-500 text-sm">{user.account_type}</Text>
        )}
      </View>

      {user.online && (
        <View className="ml-auto w-3 h-3 rounded-full bg-green-500" />
      )}
    </Pressable>
  );
}
