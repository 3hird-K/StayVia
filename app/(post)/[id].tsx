import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import MapView, { Marker } from "react-native-maps";
import { fetchPostsById } from "@/services/postService";
import { useSupabase } from "@/lib/supabase";
import DownloadImage from "@/components/download/downloadImage";
import DownloadPostImages from "@/components/download/downloadPostImages";
import { useUser } from "@clerk/clerk-expo";
import { insertRequestByUserId, fetchRequestByUserId } from "@/services/requestService";
import { useEffect, useState } from "react";

export default function DetailPost() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const supabase = useSupabase();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const userId = user?.id;
  const defaultAvatar = "https://i.pravatar.cc/150";

  // ✅ Fetch post details
  const { data: post, error, isLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostsById(id as string, supabase),
    enabled: !!id,
  });

  const isOwnPost = userId === post?.post_user?.id;
  const isAvailable = !!post?.availability;

  // ✅ Fetch existing request for this post + user
  const { data: existingRequest, isLoading: isCheckingRequest } = useQuery({
    queryKey: ["request", userId, id],
    queryFn: () => fetchRequestByUserId(userId as string, id as string, supabase),
    enabled: !!userId && !!id,
  });

  // ✅ Track if user already requested
  const [hasRequested, setHasRequested] = useState(false);

  useEffect(() => {
    if (existingRequest && existingRequest.length > 0) {
      setHasRequested(true);
    }
  }, [existingRequest]);

  // ✅ Mutation: send new request
  const requestMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !id) throw new Error("User or post ID missing");
      return insertRequestByUserId(userId, id as string, supabase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request", userId, id] });
      setHasRequested(true);
    },
    onError: (err) => {
      console.error("Failed to request post:", err);
    },
  });

  const { mutate, isPending, isSuccess } = requestMutation;

  const handleRequestPost = () => {
    if (!isAvailable || isOwnPost || hasRequested) return;
    mutate();
  };

  // ✅ Loading state for post
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black px-4 py-4">
        <Skeleton className="w-full h-64 rounded-lg mb-4" />
        <Skeleton className="w-1/3 h-6 rounded-full mb-2" />
        <Skeleton className="w-1/2 h-4 mb-2" />
        <Skeleton className="w-full h-20 rounded-lg mb-4" />
        <Skeleton className="w-full h-60 rounded-lg mb-4" />
        <Skeleton className="w-1/3 h-6 rounded-full mb-2" />
        <Skeleton className="w-full h-16 rounded-lg" />
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-black">
        <Text className="text-gray-900 dark:text-white text-lg font-medium">
          Post not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="px-2">
        {/* Image Header */}
        <View className="relative mb-4">
          {post.image ? (
            <DownloadPostImages
              path={post.image}
              supabase={supabase}
              fallbackUri={defaultAvatar}
              className="w-full h-64 rounded-xl shadow-lg"
            />
          ) : (
            <View className="w-full h-64 rounded-xl bg-gray-200 flex justify-center items-center shadow-lg">
              <Ionicons name="image-outline" size={60} color="#9CA3AF" />
            </View>
          )}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-6 left-4 bg-black bg-opacity-50 rounded-full p-2"
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* User Info + Chat */}
        <View className="flex-row justify-between items-center mb-4">
          {post.post_user && (
            <TouchableOpacity
              onPress={() => router.push(`/(user)/${post?.post_user?.id}`)}
              className="flex-row items-center flex-shrink"
            >
              {post.post_user.avatar ? (
                <DownloadImage
                  path={post.post_user.avatar}
                  supabase={supabase}
                  fallbackUri={defaultAvatar}
                  style={{ width: 50, height: 50, borderRadius: 50, marginRight: 12 }}
                />
              ) : (
                <View className="w-12 h-12 rounded-full bg-gray-300 mr-3" />
              )}
              <View>
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  {post.post_user.firstname || post.post_user.lastname
                    ? `${post.post_user.firstname ?? ""} ${post.post_user.lastname ?? ""}`.trim()
                    : post.post_user.username ?? "Stayvia User"}
                </Text>
                {post.created_at && (
                  <Text className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()} ·{" "}
                    {new Date(post.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          {!isOwnPost && (
            <TouchableOpacity
              onPress={() => router.push(`/(chat)/${post.post_user?.id}`)}
              className="bg-blue-600 p-3 rounded-full shadow-md"
            >
              <Ionicons name="chatbox-ellipses-outline" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Post Details */}
        <Text className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{post.title}</Text>
        {post.location && <Text className="text-gray-500 mb-2 text-sm">📍 {post.location}</Text>}
        <Text className={`text-sm font-medium mb-4 ${isAvailable ? "text-green-500" : "text-red-500"}`}>
          {isAvailable ? "Available" : "Unavailable"}
        </Text>

        {post.latitude != null && post.longitude != null && (
          <View className="w-full h-60 rounded-xl overflow-hidden mb-4 shadow-md">
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: post.latitude,
                longitude: post.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={{ latitude: post.latitude, longitude: post.longitude }} title={post.title} />
            </MapView>
          </View>
        )}

        {post.price_per_night && (
          <Text className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            ₱{post.price_per_night}
          </Text>
        )}

        {post.description && (
          <Text className="text-gray-800 dark:text-gray-200 mb-6">{post.description}</Text>
        )}
      </ScrollView>

      {/* ✅ Sticky Request Button */}
      {!isOwnPost && (
        <View className="absolute bottom-0 w-full px-4 py-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            disabled={!isAvailable || hasRequested || isPending || isCheckingRequest}
            onPress={handleRequestPost}
            className={`py-4 rounded-xl ${
              !isAvailable || hasRequested || isPending || isCheckingRequest
                ? "bg-gray-400"
                : "bg-blue-600"
            } shadow-lg flex-row justify-center items-center`}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-center text-white font-semibold text-sm">
                {hasRequested ? "Requested" : "Request Rental"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
