import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useState, useMemo, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import listings from "@/assets/data/posts.json";
import { PostCard } from "@/components/home/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "expo-router";
import type { Post } from "@/utils/types";

export default function Home() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme(); // 'light' | 'dark'
  const isDarkMode = colorScheme === "dark";

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Extract unique filters from listings.json
  const allFilters = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((item: Post) => {
      item.filters?.forEach((f) => set.add(f));
    });
    return Array.from(set).sort();
  }, []);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [search, activeFilters]);

  const filteredListings = useMemo(() => {
    return listings.filter((item: Post) => {
      const matchesFilter =
        activeFilters.length === 0 ||
        activeFilters.every((f) => item.filters?.includes(f));

      const matchesSearch =
        search === "" ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location?.toLowerCase().includes(search.toLowerCase()) ||
        item.availability?.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [activeFilters, search]);

  // Define dynamic colors based on theme
  const colors = {
    background: isDarkMode ? "#121212" : "#F9FAFB",
    cardBackground: isDarkMode ? "#1F1F1F" : "white",
    textPrimary: isDarkMode ? "#FFFFFF" : "#111827",
    textSecondary: isDarkMode ? "#D1D5DB" : "#6B7280",
    border: isDarkMode ? "#374151" : "#E5E7EB",
    filterActive: "#4F46E5",
    filterInactive: isDarkMode ? "#6B7280" : "#6B7280",
    modalBackground: isDarkMode ? "#1F1F1F" : "white",
    overlayBackground: "rgba(0,0,0,0.5)",
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top || 22, backgroundColor: colors.background }}
    >
      {/* Header */}
      <View style={{ backgroundColor: "#4F46E5" }}>
        <Image
          source={require("@/assets/images/icon-white.png")}
          style={{ width: 256, height: 128, alignSelf: "center" }}
          resizeMode="contain"
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
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 5,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Input
              placeholder="Search for a place..."
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
              backgroundColor: "#4F46E5",
              padding: 12,
              borderRadius: 9999,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }}
          >
            <Ionicons name="filter-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {activeFilters.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 12 }}
            contentContainerStyle={{ gap: 8 }}
          >
            {activeFilters.map((f, i) => (
              <Badge
                key={i}
                variant="secondary"
                style={{
                  borderRadius: 9999,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.cardBackground,
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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Link href={`/home/post/${item.id}`} asChild>
                <PostCard post={item} />
              </Link>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: "center", color: colors.textSecondary, marginTop: 40 }}>
                No listings found
              </Text>
            )}
          />
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: colors.overlayBackground }}>
          <View style={{ backgroundColor: colors.modalBackground, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "70%" }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16, color: colors.textPrimary }}>Filters</Text>

            <ScrollView>
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                {allFilters.map((f, i) => {
                  const isActive = activeFilters.includes(f);
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => toggleFilter(f)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        marginBottom: 12,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colors.border,
                        backgroundColor: isActive ? "#E0E7FF" : colors.cardBackground,
                        width: "48%",
                      }}
                    >
                      <Ionicons
                        name={isActive ? "checkbox" : "square-outline"}
                        size={18}
                        color={isActive ? colors.filterActive : colors.filterInactive}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={{ flex: 1, textTransform: "capitalize", color: colors.textPrimary }}>
                        {f.replace("-", " ")}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 24 }}>
              <TouchableOpacity
                style={{ backgroundColor: isDarkMode ? "#374151" : "#E5E7EB", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 9999 }}
                onPress={() => setActiveFilters([])}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: "500" }}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: "#4F46E5", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 9999 }}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={{ color: "white", fontWeight: "500" }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
