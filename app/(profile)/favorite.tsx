import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import React, { useMemo, useState, useEffect } from "react";
import { SafeAreaView, FlatList, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PostCard } from "@/components/home/PostCard";
import EmptyState from "@/components/EmptyState";
import HeaderBtn from "@/components/HeaderBtn";
import listingsJSON from "@/assets/data/posts.json"; // your static posts.json
import type { Post } from "@/utils/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Favorite() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Initialize listings with favorited default fallback
  const [listings, setListings] = useState<Post[]>([]);

  useEffect(() => {
    const initialized = listingsJSON.map((p) => ({
      ...p,
      favorited: p.favorited ?? false, // ensure favorited exists
      upvotes: p.upvotes ?? 0,         // ensure upvotes exists
      nr_of_comments: p.nr_of_comments ?? 0,
    }));
    setListings(initialized);
  }, []);

  // Get only favorited posts
  const favoritedListings = useMemo(
    () => listings.filter((p) => p.favorited),
    [listings]
  );

  // Update favorite state from PostCard
  const handleFavoriteChange = (postId: string, favorited: boolean) => {
    setListings((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, favorited } : p))
    );
  };

  return (
    <ScreenWrapper>
      <SafeAreaView
        className="flex-1 bg-white"
        style={{ paddingTop: insets.top || 22 }}
      >
        <HeaderBtn title="Favorites" />

        {favoritedListings.length === 0 ? (
          <EmptyState
            icon={<Text style={{ fontSize: 80 }}>❤️</Text>}
            title="No Favorites Yet"
            message="Save your favorite places to easily find them later."
            buttonLabel="Browse Listings"
            onPress={() => router.push("/(protected)/home")}
          />
        ) : (
          <View className="flex-1 mt-4">
            {loading ? (
              <View className="px-4">
                {[...Array(5)].map((_, i) => (
                  <View key={i} className="mb-4">
                    <Skeleton className="h-40 w-full rounded-xl mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                  </View>
                ))}
              </View>
            ) : (
              <FlatList
                data={favoritedListings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <PostCard
                    post={item}
                    onFavoriteChange={handleFavoriteChange}
                  />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
}
