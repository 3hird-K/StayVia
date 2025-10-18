import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/home/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "expo-router";
import { useAppTheme } from "@/lib/theme";
import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/lib/supabase";
import { fetchPostsWithUser } from "@/services/postService";
import { fetchPostFavoritesByUserId } from "@/services/favorites";
import { useUser } from "@clerk/clerk-expo";

export default function Home() {
  const supabase = useSupabase();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { user } = useUser();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showTypes, setShowTypes] = useState(true);

  const types = ["Rent", "Post", "Favorites", "Requests"];
  const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    Rent: "home-outline",
    Post: "person-outline",
    Favorites: "heart-outline",
    Requests: "help-outline",
  };

  // Fetch all posts
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPostsWithUser(supabase),
    staleTime: 1000 * 60,
  });

  // Fetch favorites of current user
  const {
    data: favoritePosts = [],
    isFetching: isFetchingFavorites,
    refetch: refetchFavorites,
  } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: () =>
      user ? fetchPostFavoritesByUserId(supabase, user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  // Filter posts by type + search
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    let filtered: typeof posts = posts;

    switch (selectedType) {
      case "Favorites":
        filtered =
          favoritePosts
            ?.map((fav) => fav.post)
            .filter((p): p is NonNullable<typeof p> => !!p) ?? [];
        break;

      case "Post":
        filtered = posts.filter((post) => post.post_user?.id === user?.id);
        break;

      case "Rent":
        filtered = posts;
        break;

      case "Requests":
        // Keep as-is for now
        filtered = posts;
        break;

      default:
        filtered = posts;
    }

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((post) => {
        const title = post.title?.toLowerCase() ?? "";
        const desc = post.description?.toLowerCase() ?? "";
        const firstName = post.post_user?.firstname?.toLowerCase() ?? "";
        const lastName = post.post_user?.lastname?.toLowerCase() ?? "";
        return (
          title.includes(lowerSearch) ||
          desc.includes(lowerSearch) ||
          firstName.includes(lowerSearch) ||
          lastName.includes(lowerSearch)
        );
      });
    }

    return filtered;
  }, [selectedType, posts, favoritePosts, search, user]);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top || 22, backgroundColor: colors.background }}
    >
      {/* Header / Logo */}
      <View style={{ backgroundColor: colors.primary, alignItems: "center", paddingVertical: 8 }}>
        <Image
          alt="App Logo"
          source={require("@/assets/images/icon-white.png")}
          style={{ width: 160, height: 96 }}
        />
      </View>

      {/* Search + Filter */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.card,
              borderRadius: 9999,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Input
              placeholder="Search..."
              placeholderTextColor={colors.mutedForeground}
              value={search}
              onChangeText={setSearch}
              style={{ flex: 1, borderWidth: 0, color: colors.foreground }}
            />
            <Ionicons name="search" size={20} color={colors.mutedForeground} />
          </View>

          {/* Chevron toggle for Types */}
          <View style={{ flexDirection: "row", paddingLeft: 6 }}>
            <TouchableOpacity
              onPress={() => setShowTypes(!showTypes)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons
                name={showTypes ? "chevron-up-outline" : "chevron-down-outline"}
                size={20}
                color={colors.foreground}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Types Row (Collapsible) */}
      {showTypes && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            marginTop: 8,
          }}
        >
          {types.map((typeName) => {
            const isSelected = selectedType === typeName;
            return (
              <TouchableOpacity
                key={typeName}
                onPress={() => setSelectedType(isSelected ? null : typeName)}
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: 6,
                  marginHorizontal: 4,
                  borderRadius: 20,
                }}
              >
                <Ionicons
                  name={typeIcons[typeName]}
                  size={28}
                  color={isSelected ? "white" : colors.primary}
                  style={{
                    borderRadius: 99,
                    padding: 8,
                    backgroundColor: isSelected ? colors.primary : "transparent",
                  }}
                />
                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                    fontWeight: "bold",
                    color: isSelected ? colors.primary : colors.foreground,
                  }}
                >
                  {typeName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Listings */}
      <View style={{ flex: 1, marginTop: 16 }}>
        {isLoading || isFetchingFavorites ? (
          <View style={{ paddingHorizontal: 16 }}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={{ marginBottom: 16 }}>
                <Skeleton style={{ height: 160, width: "100%", borderRadius: 16, marginBottom: 8 }} />
                <Skeleton style={{ height: 16, width: "75%", marginBottom: 4 }} />
                <Skeleton style={{ height: 16, width: "50%" }} />
              </View>
            ))}
          </View>
        ) : isError ? (
          <Text style={{ textAlign: "center", color: colors.mutedForeground, marginTop: 40 }}>
            Error loading posts: {String((error as Error).message)}
          </Text>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => String(item?.id)}
            renderItem={({ item }) => (
              <Link href={`/home/post/${item?.id}`} asChild>
                <PostCard post={item} />
              </Link>
            )}
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            refreshing={isFetching || isFetchingFavorites}
            onRefresh={() => {
              refetch();
              refetchFavorites();
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
