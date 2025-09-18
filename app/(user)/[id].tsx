import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/text";
import { Skeleton } from "@/components/ui/skeleton";
import type { User, Post } from "@/utils/types";
import { getUserById, getPostsByUser } from "@/utils/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { HorizontalPostCard } from "@/components/home/HorizontalPostCard";
import { Ionicons } from "@expo/vector-icons";

export default function ProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await getUserById(id);
        const userPosts = await getPostsByUser(id);
        setUser(userData);
        setPosts(userPosts);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-neutral-900">
        <Skeleton style={{ width: 120, height: 120, borderRadius: 999, marginBottom: 16 }} />
        <Skeleton style={{ width: 200, height: 24, marginBottom: 8 }} />
        <Skeleton style={{ width: 150, height: 16 }} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-neutral-900" edges={["top", "left", "right"]}>
        <Text>User not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900" edges={["top", "left", "right"]}>
     {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        {/* Left: Back Arrow */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow-sm"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#4F46E5" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Profile
        </Text>

        {/* Right: Message Icon */}
        <TouchableOpacity
          onPress={() => router.push(`/(chat)/${user?.id}`)}
          className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow-sm"
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-ellipses" size={22} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* User Info */}
        <View className="flex-row items-center mt-6 mb-4 px-4 gap-4">
          {user.avatar && (
            <Image
              source={{ uri: user.avatar }}
              className="w-16 h-16 rounded-full mb-3"
            />
          )}
          <View className="flex-col">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              {user.firstname || user.lastname
                ? `${user.firstname} ${user.lastname}`.trim()
                : user.username}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0">
              @{user.username}
            </Text>
          </View>
        </View>

        {/* User Posts Horizontal Scroll */}
        <View className="px-4">
          {posts.length === 0 ? (
            <View className="w-full h-52 flex-col justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-lg mt-4">
              <Ionicons name="albums-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 dark:text-gray-400 mt-2">
                No posts yet
              </Text>
              <Text className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                This user hasn't shared any posts.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            >
              {posts.map((post) => (
                <HorizontalPostCard key={post.id} post={post} />
              ))}
            </ScrollView>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
