import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/lib/theme";
import { fetchPostsById } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import MapView, { Marker } from "react-native-maps";

export default function DetailPost() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { colors } = useAppTheme();

  const { data: post, error, isLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostsById(id as string),
    enabled: !!id,
  });

  const isAvailable = !!post?.availability;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black px-4 py-4">
        <Skeleton className="w-full h-64 mb-4" />
        <Skeleton className="w-1/3 h-6 rounded-full mb-2" />
        <Skeleton className="w-1/2 h-4 mb-2" />
        <Skeleton className="w-full h-20 mb-4" />
        <Skeleton className="w-full h-60 rounded-lg mb-4" />
        <Skeleton className="w-1/3 h-6 mb-2" />
        <Skeleton className="w-full h-16" />
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-black">
        <Text className="text-gray-900 dark:text-white">Post not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Header */}
        <View className="relative">
            {post.image && (
              <Image
                source={{ uri: post.image }}
                className="w-full h-64"
                resizeMode="cover"
              />
            )}
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute top-6 left-4 bg-black bg-opacity-50 rounded-full p-2"
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
        </View>

        <View className="px-4 py-4">
         <View className="flex-row justify-between items-center mb-2">
            {/* User Info */}
            {post.user && (
              <TouchableOpacity
                onPress={() => router.push(`/(user)/${post?.user?.id}`)}
                className="flex-row items-center"
              >
                {post.user.avatar && (
                  <Image
                    source={{ uri: post.user.avatar }}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                )}
                <View>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.user.firstname || post.user.lastname
                      ? `${post.user.firstname ?? ""} ${post.user.lastname ?? ""}`.trim()
                      : post.user.username ?? "Stayvia User"}
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

            {/* Chat Button */}
            <TouchableOpacity
              onPress={() => router.push(`/(chat)/${post.user?.id}`)}
              className="bg-black bg-opacity-50 rounded-full p-2"
            >
              <Ionicons name="chatbox-ellipses-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          

          {/* Post Title */}
          <Text className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {post.title}
          </Text>

          {/* Location */}
          {post.location && (
            <Text className="text-gray-500 mb-1">📍 {post.location}</Text>
          )}

          {/* Availability */}
          <Text className={`${isAvailable ? "text-green-500" : "text-red-500"} mb-2`}>
            {isAvailable ? "Available" : "Unavailable"}
          </Text>

          {/* Map */}
          {post.latitude != null && post.longitude != null && (
            <View className="w-full h-60 rounded-lg overflow-hidden mb-4">
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: post.latitude,
                  longitude: post.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{ latitude: post.latitude, longitude: post.longitude }}
                  title={post.title}
                />
              </MapView>
            </View>
          )}

          {/* Price */}
          {post.price_per_night && (
            <Text className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              ₱{post.price_per_night}
            </Text>
          )}

          {/* Description */}
          {post.description && (
            <Text className="text-gray-900 dark:text-white mb-4">
              {post.description}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Sticky Button */}
      <View className="absolute bottom-0 w-full px-4 py-4 bg-white dark:bg-black">
        <TouchableOpacity
          disabled={!isAvailable}
          onPress={() => isAvailable && router.push(`../request/${id}`)}
          className={`py-4 rounded-xl ${
            isAvailable ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          <Text className="text-center text-white font-semibold">
            {isAvailable ? "Request Rental" : "Unavailable"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
