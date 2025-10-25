import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/home/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "expo-router";
import { useAppTheme } from "@/lib/theme";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/lib/supabase";
import { fetchPostsWithUser } from "@/services/postService";
import { fetchPostFavoritesByUserId } from "@/services/favorites";
import { fetchRequestByUserId } from "@/services/requestService";
import { useUser } from "@clerk/clerk-expo";
import { Button } from "@/components/ui/button";

export default function Home() {
  const supabase = useSupabase();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showTypes, setShowTypes] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const baseTypes = ["Rent", "Post", "Favorites", "Requests"];
  const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    Rent: "home-outline",
    Post: "person-outline",
    Favorites: "heart-outline",
    Requests: "help-outline",
  };

  // --------------------------
  // Fetch all posts
  // --------------------------
  const { data: posts = [], isLoading, isError, error, refetch, isFetching } =
    useQuery({
      queryKey: ["posts"],
      queryFn: () => fetchPostsWithUser(supabase),
      staleTime: 1000 * 60,
    });

  // --------------------------
  // Fetch all unique filters from Supabase
  // --------------------------
  const { data: filters = [], isFetching: isFetchingFilters } = useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("filters");
      if (error) throw error;
      const allFilters = (data ?? [])
        .flatMap((post) => (Array.isArray(post.filters) ? post.filters : []))
        .filter(Boolean);
      return Array.from(new Set(allFilters)); // unique
    },
    staleTime: 1000 * 60 * 5,
  });

  const allTypes = [...baseTypes, ...filters.map((f) => String(f))];

  // --------------------------
  // Fetch user favorites
  // --------------------------
  const { data: favoritePosts = [], isFetching: isFetchingFavorites, refetch: refetchFavorites } =
    useQuery({
      queryKey: ["favorites", user?.id],
      queryFn: () =>
        user ? fetchPostFavoritesByUserId(supabase, user.id) : Promise.resolve([]),
      enabled: !!user,
    });

  // --------------------------
  // Fetch user requests
  // --------------------------
  const { data: userRequests = [], isFetching: isFetchingRequests, refetch: refetchRequests } =
    useQuery({
      queryKey: ["requests", user?.id],
      queryFn: () =>
        user ? fetchRequestByUserId(user.id, null, supabase) : Promise.resolve([]),
      enabled: !!user,
    });

  // --------------------------
  // Filter posts by type + search + filters
  // --------------------------
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    let filtered: typeof posts = posts;

    if (selectedType) {
      if (selectedType === "Favorites") {
        filtered =
          favoritePosts?.map((fav) => fav.post).filter((p): p is NonNullable<typeof p> => !!p) ??
          [];
      } else if (selectedType === "Post") {
        filtered = posts.filter((post) => post.post_user?.id === user?.id);
      } else if (selectedType === "Requests") {
        filtered =
          userRequests?.map((req) => req.post).filter((p): p is NonNullable<typeof p> => !!p) ??
          [];
      } else if (selectedType !== "Rent") {
        filtered = posts.filter((post) => {
          const postFilters = Array.isArray(post.filters) ? post.filters.map(String) : [];
          return postFilters.includes(selectedType);
        });
      }
    }

    if (selectedFilters.length > 0) {
      filtered = filtered.filter((post) => {
        const postFilters = Array.isArray(post.filters) ? post.filters.map(String) : [];
        return selectedFilters.every((sf) => postFilters.includes(sf));
      });
    }

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((post) => {
        const title = String(post.title ?? "").toLowerCase();
        const desc = String(post.description ?? "").toLowerCase();
        const firstName = String(post.post_user?.firstname ?? "").toLowerCase();
        const lastName = String(post.post_user?.lastname ?? "").toLowerCase();
        const postFilters = Array.isArray(post.filters) ? post.filters.map(String) : [];
        return (
          title.includes(lowerSearch) ||
          desc.includes(lowerSearch) ||
          firstName.includes(lowerSearch) ||
          lastName.includes(lowerSearch) ||
          postFilters.some((f) => f.toLowerCase().includes(lowerSearch))
        );
      });
    }

    return filtered;
  }, [selectedType, posts, favoritePosts, userRequests, search, selectedFilters, user]);

  // --------------------------
  // Render
  // --------------------------
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top || 22,
        backgroundColor: colors.background,
      }}
    >
      {/* Header / Logo */}
      <View
        style={{
          backgroundColor: colors.primary,
          alignItems: "center",
          paddingVertical: 8,
        }}
      >
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

          <View style={{ flexDirection: "row", paddingLeft: 6 }}>
            <TouchableOpacity
              onPress={() => setShowTypes(!showTypes)}
              style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}
            >
              <Ionicons
                name={showTypes ? "chevron-up-outline" : "chevron-down-outline"}
                size={20}
                color={colors.foreground}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowFilter(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.card,
                borderRadius: 20,
                padding: 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons name="filter-outline" size={18} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

     {showTypes && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            marginTop: 8,
          }}
        >
          {baseTypes.map((typeName) => {
            const isSelected = selectedType === typeName;
            return (
              <TouchableOpacity
                key={typeName}
                onPress={() => {
                  const newType = isSelected ? null : typeName;
                  setSelectedType(newType);

                  // Invalidate queries for Favorites and Requests
                  if (newType === "Favorites") {
                    queryClient.invalidateQueries({queryKey: ["favorites"]});
                  } else if (newType === "Requests") {
                    queryClient.invalidateQueries({queryKey: ["requests"]});
                  }
                }}
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

      <Modal
  transparent
  animationType="fade"
  visible={showFilter}
  onRequestClose={() => setShowFilter(false)}
>
  <View className="flex-1 bg-black/50 justify-center items-center">
    <View
      className="w-11/12 bg-card rounded-xl p-5"
      style={{ maxHeight: 400 }}
    >
      <Text className="text-lg font-bold text-foreground mb-3">
        Filter Options
      </Text>

      <ScrollView className="max-h-64">
        {filters.map((filter) => {
          const filterLabel = String(filter);
          const isSelected = selectedFilters.includes(filterLabel);

          return (
            <Button
              key={filterLabel}
              variant={isSelected ? "default" : "outline"}
              className="mb-2"
              onPress={() => {
                setSelectedFilters((prev) =>
                  isSelected
                    ? prev.filter((f) => f !== filterLabel)
                    : [...prev, filterLabel]
                );
              }}
            >
              <Text className={isSelected ? "text-white" : "text-foreground"}>
                {filterLabel}
              </Text>
            </Button>
          );
        })}
      </ScrollView>

      <View className="flex-row justify-end mt-4 space-x-3">
        <Button
          variant="ghost"
          onPress={() => setShowFilter(false)}
          className="px-4 py-2"
        >
          <Text className="text-muted-foreground">Cancel</Text>
        </Button>

        <Button
          onPress={() => setShowFilter(false)}
          className="px-4 py-2 bg-primary"
        >
          <Text className="text-white font-bold">Apply</Text>
        </Button>
      </View>
    </View>
  </View>
</Modal>


      {/* Listings */}
      <View style={{ flex: 1, marginTop: 16 }}>
        {isLoading || isFetchingFavorites || isFetchingRequests || isFetchingFilters ? (
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
        ) : filteredPosts.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Ionicons name="information-circle-outline" size={50} color={colors.mutedForeground} />
            <Text
              style={{
                marginTop: 12,
                fontSize: 16,
                fontWeight: "500",
                color: colors.mutedForeground,
              }}
            >
              {selectedType === "Favorites"
                ? "No favorites yet"
                : selectedType === "Requests"
                ? "No requests found"
                : selectedType === "Post"
                ? "You haven't posted anything yet"
                : "No posts found"}
            </Text>
          </View>
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
            refreshing={isFetching || isFetchingFavorites || isFetchingRequests}
            onRefresh={() => {
              refetch();
              refetchFavorites();
              refetchRequests();
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

