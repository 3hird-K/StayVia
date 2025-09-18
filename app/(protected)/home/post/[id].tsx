import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, Image, TouchableOpacity, useColorScheme, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Post } from "@/utils/types";
import  {getPostById}  from "@/utils/api"; // <-- import the API function

export default function DetailPost() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      const postData = await getPostById(Number(id));
      if (!postData) {
        console.error("Post not found");
      } else {
        setPost(postData);
        setUpvotes(postData.upvotes ?? 0);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleUpvote = () => {
    setUpvotes((prev) => (upvoted ? prev - 1 : prev + 1));
    setUpvoted(!upvoted);
    // Optionally: update Supabase via API
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: isDarkMode ? "#121212" : "#FFFFFF" }}>
        <Text style={{ color: isDarkMode ? "#FFF" : "#111827" }}>Post not found</Text>
      </SafeAreaView>
    );
  }

    const isAvailable = !!post.availability;

  const colors = {
    background: isDarkMode ? "#121212" : "#FFFFFF",
    textPrimary: isDarkMode ? "#FFFFFF" : "#111827",
    textSecondary: isDarkMode ? "#D1D5DB" : "#6B7280",
    textGreen: "#16A34A",
    textRed: "#DC2626",
    filterBg: isDarkMode ? "#1F1F1F" : "#E5E7EB",
    buttonAvailable: "#2563EB",
    buttonUnavailable: "#9CA3AF",
  };

  
  const handleOpenuser = () => router.push(`/(user)/${post.user?.id}`);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "left", "right"]}>
      <ScrollView style={{ flex: 1 }}>
        {/* Image and controls */}
        <View style={{ position: "relative" }}>
          {post.image && (
            <Image source={{ uri: post.image }} style={{ width: "100%", height: 320, borderRadius: 5 }} resizeMode="cover" />
          )}

          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: "absolute", top: 24, left: 16, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 999, padding: 8 }}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={handleUpvote}
            style={{ position: "absolute", top: 24, right: 16, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name={upvoted ? "heart" : "heart-outline"} size={22} color={upvoted ? "red" : "white"} />
            <Text style={{ color: "white", marginLeft: 4 }}>{upvotes}</Text>
          </TouchableOpacity> */}
        </View>

        <View style={{ padding: 20 }}>

          {/* User info */}
          <TouchableOpacity
            onPress={handleOpenuser}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            {post.user && (
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                {post.user.avatar ? (
                  <Image
                    source={{ uri: post.user.avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                  />
                ) : (
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#ccc", marginRight: 12 }} />
                )}

                <View className="flex-col">
                  <Text className="text-xl font-bold text-gray-900 dark:text-white">
                    {post.user.firstname || post.user.lastname
                      ? `${post.user.firstname} ${post.user.lastname}`.trim()
                      : post.user.username}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0">
                    {(post.user.email).toLowerCase()}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8, color: colors.textPrimary }}>{post.title}</Text>

          {post.location && <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>📍 {post.location}</Text>}

          <Text style={{ fontSize: 14, marginBottom: 8, color: isAvailable ? colors.textGreen : colors.textRed }}>
            {isAvailable ? "Available" : "Unavailable"}
          </Text>

          {/* Map */}
          {post.latitude && post.longitude && (
            <View style={{ width: "100%", height: 240, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: post.latitude,
                  longitude: post.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker coordinate={{ latitude: post.latitude, longitude: post.longitude }} title={post.title} description={post.location ?? ""} />
              </MapView>
            </View>
          )}

          {post.price_per_night !== undefined && (
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: colors.textPrimary }}>
              ₱{post.price_per_night}
            </Text>
          )}

          {(post.beds || post.type) && (
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8 }}>
              {post.beds ?? ""} {post.beds && post.type ? "·" : ""} {post.type ?? ""}
            </Text>
          )}

          {Array.isArray(post.filters) && post.filters.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
              {post.filters.map((filter, idx) => (
                <Text
                  key={idx}
                  style={{
                    fontSize: 12,
                    backgroundColor: colors.filterBg,
                    borderRadius: 6,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    marginRight: 4,
                    marginBottom: 4,
                    color: colors.textPrimary,
                  }}
                >
                  {filter}
                </Text>
              ))}
            </View>
          )}

          {post.description && <Text style={{ fontSize: 14, color: colors.textPrimary, marginBottom: 16 }}>{post.description}</Text>}

          <TouchableOpacity
            disabled={!isAvailable}
            onPress={() => isAvailable && router.push(`../request/${id}`)}
            style={{
              marginTop: 24,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: isAvailable ? colors.buttonAvailable : colors.buttonUnavailable,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600", textAlign: "center" }}>
              {isAvailable ? "Request Rental" : "Unavailable"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
