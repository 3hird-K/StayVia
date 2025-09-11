import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, Image, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import posts from "@/assets/data/posts.json";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailPost() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const post = posts.find((p) => p.id === id);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(post?.upvotes || 0);

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: isDarkMode ? "#121212" : "#FFFFFF" }}>
        <Text style={{ color: isDarkMode ? "#FFF" : "#111827" }}>Post not found</Text>
      </SafeAreaView>
    );
  }

  const handleUpvote = () => {
    setUpvotes((prev) => (upvoted ? prev - 1 : prev + 1));
    setUpvoted(!upvoted);
  };

  const isAvailable = post.availability?.toLowerCase() === "available";

  const colors = {
    background: isDarkMode ? "#121212" : "#FFFFFF",
    textPrimary: isDarkMode ? "#FFFFFF" : "#111827",
    textSecondary: isDarkMode ? "#D1D5DB" : "#6B7280",
    textGreen: "#16A34A",
    textRed: "#DC2626",
    filterBg: isDarkMode ? "#1F1F1F" : "#E5E7EB",
    buttonAvailable: "#2563EB",
    buttonUnavailable: "#9CA3AF",
    overlay: "rgba(0,0,0,0.5)",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "left", "right"]}>
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Image with Back & Upvote Buttons */}
        <View style={{ position: "relative" }}>
          {post.image && (
            <Image
              source={{ uri: post.image }}
              style={{ width: "100%", height: 320, borderRadius: 12 }}
              resizeMode="cover"
            />
          )}

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: "absolute", top: 24, left: 16, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 999, padding: 8 }}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Upvote Button */}
          <TouchableOpacity
            onPress={handleUpvote}
            style={{ position: "absolute", top: 24, right: 16, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name={upvoted ? "heart" : "heart-outline"} size={22} color={upvoted ? "red" : "white"} />
            <Text style={{ color: "white", marginLeft: 4 }}>{upvotes}</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8, color: colors.textPrimary }}>
            {post.title}
          </Text>

          {post.location && <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>📍 {post.location}</Text>}

          {post.availability && (
            <Text style={{ fontSize: 14, marginBottom: 8, color: isAvailable ? colors.textGreen : colors.textRed }}>
              {post.availability}
            </Text>
          )}

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
                <Marker
                  coordinate={{ latitude: post.latitude, longitude: post.longitude }}
                  title={post.title}
                  description={post.location}
                />
              </MapView>
            </View>
          )}

          {post.pricePerNight && <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: colors.textPrimary }}>{post.pricePerNight}</Text>}

          {(post.beds || post.type) && (
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8 }}>
              {post.beds} {post.beds && post.type ? "·" : ""} {post.type}
            </Text>
          )}

          {post.rating !== undefined && post.reviews !== undefined && (
            <TouchableOpacity onPress={() => router.push(`../review/${id}`)} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: "#FBBF24" }}>⭐ {post.rating} ({post.reviews} reviews)</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}

          {post.postedAt && <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>Posted: {post.postedAt}</Text>}

          {post.filters && post.filters.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
              {post.filters.map((filter, index) => (
                <Text key={index} style={{ fontSize: 12, backgroundColor: colors.filterBg, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginRight: 4, marginBottom: 4, color: colors.textPrimary }}>
                  {filter}
                </Text>
              ))}
            </View>
          )}

          {post.description && <Text style={{ fontSize: 14, color: colors.textPrimary, marginBottom: 16 }}>{post.description}</Text>}

          {/* Extra Info */}
          <View>
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
              Posted by {post.user?.name} in {post.group?.name}
            </Text>
          </View>

          {/* Request Rental Button */}
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
