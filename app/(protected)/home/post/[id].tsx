import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
// import type { Post } from "@/utils/types";
// import { getPostById } from "@/utils/api";
import { useAppTheme } from "@/lib/theme";
import { fetchPostsById } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";




export default function DetailPost() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { colors } = useAppTheme(); 


  console.log(id);

  // const {data: post, error, isLoading} = useQuery({
  //   queryKey: ['post', id],
  //   queryFn: () => fetchPostsById(id as string),
  //   enabled: !!id,
  // })

  const {data: post, error, isLoading} = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPostsById(id as string),
    enabled: !!id,
  });

  // console.log(post);


  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.foreground }}>Post not found</Text>
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
              style={{ width: "100%", height: 250, borderRadius: 2 }}
              resizeMode="cover"
            />
          )}

          <TouchableOpacity
            onPress={() => {
              // Invalidate posts query so Home refreshes
              // router.push('/(protected)/home'); // navigate back
              router.back();
            }}
            style={{
              position: "absolute",
              top: 24,
              left: 16,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 999,
              padding: 8,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ padding: 20 }}>
          {/* User info */}
          {post.user && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  post.user?.id && router.push(`/(user)/${post.user.id}`)
                }
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                {post.user.avatar ? (
                  <Image
                    source={{ uri: post.user.avatar }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 8,
                    }}
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
                  <Text style={{ fontSize: 13, color: colors.foreground }}>
                    Posted by:{" "}
                    {post.user.firstname || post.user.lastname
                      ? `${post.user.firstname ?? ""} ${
                          post.user.lastname ?? ""
                        }`.trim()
                      : post.user.username}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Message button */}
              <TouchableOpacity
                onPress={() =>
                  post.user?.id && router.push(`/(chat)/${post.user.id}`)
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.primary,
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
                    color: colors.primaryForeground,
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

          {/* Post details */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 8,
              color: colors.foreground,
            }}
          >
            {post.title}
          </Text>

          {post.location && (
            <Text
              style={{
                fontSize: 14,
                color: colors.mutedForeground,
                marginBottom: 4,
              }}
            >
              📍 {post.location}
            </Text>
          )}

          <Text
            style={{
              fontSize: 14,
              marginBottom: 8,
              color: isAvailable ? "green" : "red",
            }}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </Text>

          {/* Map */}
          {post.latitude != null && post.longitude != null && (
            <View
              style={{
                width: "100%",
                height: 240,
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
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
                  coordinate={{
                    latitude: post.latitude,
                    longitude: post.longitude,
                  }}
                  title={post.title}
                  description={post.location ?? ""}
                />
              </MapView>
            </View>
          )}

          {post.price_per_night !== undefined && (
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 8,
                color: colors.foreground,
              }}
            >
              ₱{post.price_per_night}
            </Text>
          )}

          {(post.beds || post.type) && (
            <Text
              style={{
                fontSize: 14,
                color: colors.mutedForeground,
                marginBottom: 8,
              }}
            >
              {post.beds ?? ""} {post.beds && post.type ? "·" : ""}{" "}
              {post.type ?? ""}
            </Text>
          )}

          {Array.isArray(post.filters) && post.filters.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
              {post.filters.map((filter, idx) => (
                <Text
                  key={idx}
                  style={{
                    fontSize: 12,
                    backgroundColor: colors.secondary,
                    borderRadius: 6,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    marginRight: 4,
                    marginBottom: 4,
                    color: colors.foreground,
                  }}
                >
                  {/* {filter} */}
                </Text>
              ))}
            </View>
          )}

          {post.description && (
            <Text
              style={{
                fontSize: 14,
                color: colors.foreground,
                marginBottom: 16,
              }}
            >
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
              backgroundColor: isAvailable ? colors.primary : colors.muted,
            }}
          >
            <Text
              style={{
                color: colors.primaryForeground,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {isAvailable ? "Request Rental" : "Unavailable"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
