import React, { useState, useMemo, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Modal,
  Image
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/home/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "expo-router";
import type { Post } from "@/utils/types";
import { getAllPosts } from "@/utils/api";

export default function Home() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [posts, setPosts] = useState<Post[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const colors = {
    background: isDarkMode ? "#121212" : "#F9FAFB",
    cardBackground: isDarkMode ? "#1F1F1F" : "white",
    textPrimary: isDarkMode ? "#FFFFFF" : "#111827",
    textSecondary: isDarkMode ? "#D1D5DB" : "#6B7280",
    border: isDarkMode ? "#374151" : "#E5E7EB",
    purple: "#4F46E5",
  };

  // Fetch posts
  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      setLoading(true);
      const data = await getAllPosts();
      if (isMounted) setPosts(data);
      setLoading(false);
    }

    fetchPosts();
    return () => { isMounted = false; };
  }, []);

  // Unique filters across all posts
  const allFilters = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((item) => item.filters?.forEach((f) => set.add(f)));
    return Array.from(set).sort();
  }, [posts]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  // Property types
  const allTypes = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.type) set.add(p.type);
    });
    return Array.from(set);
  }, [posts]);

  const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    "Boarding House": "home",
    "Shared Room": "people",
    "Private Room": "bed",
    "Dormitory": "school",
    "Apartment": "business",
    "Studio": "grid",
  };

  const selectType = (type: string) => {
    setActiveType((prev) => (prev === type ? null : type));
  };

  // Filtered posts
  const filteredListings = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((item) => {
      const matchesFilter =
        activeFilters.length === 0 ||
        activeFilters.every((f) => item.filters?.includes(f));

      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.user?.firstname?.toLowerCase().includes(q) ||
        item.user?.username?.toLowerCase().includes(q);

      const matchesType = !activeType || item.type === activeType;

      return matchesFilter && matchesSearch && matchesType;
    });
  }, [activeFilters, search, activeType, posts]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top || 22,
        backgroundColor: colors.background,
      }}
    >
      {/* Account Section */}
      <View className="flex-col items-center bg-[#4F46E5] dark:bg-neutral-900 px-1 py-0 ">
        <Image
          alt="App Logo"
          source={require('@/assets/images/icon-white.png')}
          className="w-40 h-24 top-2 "
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
              backgroundColor: colors.cardBackground,
              borderRadius: 9999,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Input
              placeholder="Search..."
              placeholderTextColor={colors.textSecondary}
              value={search}
              onChangeText={setSearch}
              style={{ flex: 1, borderWidth: 0, color: colors.textPrimary }}
            />
            <Ionicons name="search" size={20} color={colors.textSecondary} />
          </View>

          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            style={{
              marginLeft: 12,
              backgroundColor: colors.purple,
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Ionicons name="filter" size={20} color="white" />
          </TouchableOpacity>
        </View>

          {/* Property Types TabBar */}
          {allTypes.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 12 }}
              contentContainerStyle={{ paddingRight: 8 }}
            >
              {["Apartment", "Studio", "Boarding House", "Shared Room", "Private Room", "Dormitory"].map(
                (type) => {
                  const selected = activeType === type;
                  const color = selected ? colors.purple : colors.textSecondary;

                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() => selectType(type)}
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 16,
                        paddingVertical: 4,
                        borderBottomWidth: selected ? 2 : 0, // underline when selected
                        borderBottomColor: selected ? colors.purple : "transparent",
                      }}
                    >
                      <Ionicons
                        name={typeIcons[type]}
                        size={24}
                        color={color} // icon color
                      />
                      <Text style={{ color: color, fontSize: 12, marginTop: 4 }}>
                        {type.split(" ")[0]} {/* Only first word */}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </ScrollView>
          )}



        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 12 }}
            contentContainerStyle={{ paddingRight: 8 }}
          >
            {activeFilters.map((f) => (
              <Badge
                key={f}
                variant="secondary"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 9999,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  backgroundColor: colors.cardBackground,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: colors.textSecondary }}>{f.replace("-", " ")}</Text>
                <TouchableOpacity onPress={() => toggleFilter(f)}>
                  <Ionicons name="close" size={14} color={colors.textSecondary} />
                </TouchableOpacity>
              </Badge>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "60%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.textPrimary,
                marginBottom: 12,
              }}
            >
              Select Filters
            </Text>

            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingBottom: 16,
              }}
            >
              {allFilters.map((filter) => {
                const selected = activeFilters.includes(filter);
                return (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => toggleFilter(filter)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 9999,
                      borderWidth: 1,
                      borderColor: selected ? colors.purple : colors.border,
                      backgroundColor: selected ? colors.purple : "transparent",
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ color: selected ? "white" : colors.textPrimary }}>
                      {filter.replace("-", " ")}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setFilterModalVisible(false)}
              style={{
                marginTop: 16,
                backgroundColor: colors.purple,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Listings */}
      <View style={{ flex: 1, marginTop: 16 }}>
        {loading ? (
          <View style={{ paddingHorizontal: 16 }}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={{ marginBottom: 16 }}>
                <Skeleton style={{ height: 160, width: "100%", borderRadius: 16, marginBottom: 8 }} />
                <Skeleton style={{ height: 16, width: "75%", marginBottom: 4 }} />
                <Skeleton style={{ height: 16, width: "50%" }} />
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            data={filteredListings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Link href={`/home/post/${item.id}`} asChild>
                <PostCard post={item} />
              </Link>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: "center", color: colors.textSecondary, marginTop: 40 }}>
                No listings found
              </Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}