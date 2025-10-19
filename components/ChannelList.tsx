import React from "react";
import { FlatList, View, Text, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/lib/supabase";
import { fetchUsers, User } from "@/services/userService";
import UserListItem from "./UserListItem";

type UserListProps = {
  onPress?: (user: User) => void;
};

export default function UserList({ onPress }: UserListProps) {
  const supabase = useSupabase();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(supabase),
  });

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );

  if (error)
    // console.log(error)
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading users</Text>
      </View>
    );

  if (!users?.length)
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No users found</Text>
      </View>
    );

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <UserListItem user={item} onPress={onPress} />
      )}
    />
  );
}
