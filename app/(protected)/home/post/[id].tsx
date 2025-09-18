import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Post } from "@/utils/types";
import { getPostById } from "@/utils/api";

export default function DetailPost() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      // ✅ Guard against missing/invalid id
      if (!id || Array.isArray(id) || isNaN(Number(id))) {
        setLoading(false);
        return;
      }
      const postData = await getPostById(Number(id));
      if (postData) {
        setPost(postData);
        setUpvotes(postData.upvotes ?? 0);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const colors = {
    background: isDarkMode ? "#121212" : "#FFFFFF",
    textPrimary: isDarkMode ? "#FFFFFF" : "#111827",
    textSecondary: isDarkMode ? "#D1D5DB" : "#6B7280",
    textGreen: "#16A34A",
    textRed: "#DC2626",
    filterBg: isDarkMode ? "#1F1F1F" : "#E5E7EB",
    buttonAvailable: "#2563EB",
    buttonUnavailable: "#9CA3AF",
    purple: "#4F46E5",
  };

  const handleOpenUser = () => {
    if (post?.user?.id) router.push(`/(user)/${post.user.id}`);
  };
  const handleMessageUser = () => {
    if (post?.user?.id) router.push(`/(chat)/${post.user.id}`);
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
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.textPrimary }}>Post not found</Text>
      </SafeAreaView>
    );
  }

  const isAvailable = !!post.availability;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <ScrollView>
        {/* Image Header */}
        <View style={{ position: "relative" }}>
          {post.image && (
            <Image
              source={{ uri: post.image }}
              style={{ width: "100%", height: 320, borderRadius: 5 }}
              resizeMode="cover"
            />
          )}

          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: 24,
              left: 16,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 999,
              padding: 8,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ padding: 20 }}>
          {/* User info with Message icon */}
          {post.user && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              {/* User avatar & name */}
              <TouchableOpacity
                onPress={handleOpenUser}
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                {post.user.avatar ? (
                  <Image
                    source={{ uri: post.user.avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 8 }}
                  />
                ) : (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20,
                      backgroundColor: "#ccc",
                      marginRight: 8,
                    }}
                  />
                )}

                <View>
                  <Text style={{ fontSize: 13, color: colors.textPrimary }}>
                    Posted by: {post.user.firstname || post.user.lastname
                      ? `${post.user.firstname ?? ""} ${post.user.lastname ?? ""}`.trim()
                      : post.user.username}
                  </Text>
                  {/* <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                    {post.user.email?.toLowerCase() ?? ""}
                  </Text> */}
                </View>
              </TouchableOpacity>

              {/* Message button */}
              <TouchableOpacity
                onPress={handleMessageUser}
                style={{
                  flexDirection: "row",                
                  alignItems: "center",                
                  backgroundColor: colors.purple,
                  borderRadius: 999,                  
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  marginLeft: 12,
                  shadowColor: "#000",                
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 3,
                  elevation: 2,                       
                }}
              >
                <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                    marginLeft: 6,                    
                    fontSize: 16,
                  }}
                >
                  Message
                </Text>
              </TouchableOpacity>

            </View>
          )}

          {/* Post Details */}
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8, color: colors.textPrimary }}>
            {post.title}
          </Text>

          {post.location && (
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>
              📍 {post.location}
            </Text>
          )}

          <Text
            style={{
              fontSize: 14,
              marginBottom: 8,
              color: isAvailable ? colors.textGreen : colors.textRed,
            }}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </Text>

          {/* Map */}
          {post.latitude != null && post.longitude != null && (
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
                <Marker
                  coordinate={{ latitude: post.latitude, longitude: post.longitude }}
                  title={post.title}
                  description={post.location ?? ""}
                />
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

          {post.description && (
            <Text style={{ fontSize: 14, color: colors.textPrimary, marginBottom: 16 }}>
              {post.description}
            </Text>
          )}

          <TouchableOpacity
            disabled={!isAvailable}
            onPress={() => isAvailable && router.push(`../request/${id}`)}
            style={{
              marginTop: 24,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: isAvailable ? colors.purple : colors.buttonUnavailable,
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
