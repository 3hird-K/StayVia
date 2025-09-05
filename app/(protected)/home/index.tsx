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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import listings from "@/assets/data/listings.json";
import { ListingCard } from "@/components/home/listingCard";
import { Skeleton } from "@/components/ui/skeleton"; 
import { useRouter } from "expo-router";

export default function Home() {
  const insets = useSafeAreaInsets();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  // Extract unique filters from listings.json
  const allFilters = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((item) => {
      item.filters?.forEach((f) => set.add(f));
    });
    return Array.from(set).sort();
  }, []);

  // Toggle filter selection (checkbox style)
  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  // Simulate loading when filters/search change
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timeout);
  }, [search, activeFilters]);

  // Apply filters + search
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesFilter =
        activeFilters.length === 0 ||
        activeFilters.every((f) => item.filters?.includes(f));

      const matchesSearch =
        search === "" ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location?.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [activeFilters, search]);

  return (
    <ScreenWrapper style={{ paddingTop: 5, paddingHorizontal: 0}}>
      <SafeAreaView
        className="flex-1 bg-background"
        style={{ paddingTop: insets.top || 22 }}
      >
        {/* Header */}
        <View className="w-full p-0 bg-indigo-500">
          <Image
            source={require("@/assets/images/icon-white.png")}
            className="w-64 p-[-6] h-32 m-0 self-center"
            resizeMode="contain"
          />
        </View>

        {/* Search + Filter */}
        <View className="px-4 mt-4">
          <View className="flex-row items-center">
            {/* Search Bar */}
            <View className="flex-1 flex-row items-center bg-white rounded-full px-4 py-0 shadow-md border border-gray-200">
              <Input
                placeholder="Search for a place..."
                value={search}
                onChangeText={setSearch}
                className="flex-1 border-0 text-base"
              />
              <Ionicons name="search" size={20} color="#6B7280" />
            </View>

            {/* Filter Button */}
            <TouchableOpacity
              onPress={() => setFilterModalVisible(true)}
              className="ml-3 bg-indigo-500 p-3 rounded-full shadow-sm"
            >
              <Ionicons name="filter-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Active filters badges */}
          {activeFilters.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-3"
              contentContainerStyle={{ gap: 8 }}
            >
              {activeFilters.map((f, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="rounded-full px-3 py-1 flex-row items-center"
                >
                  <Text className="text-gray-700">{f.replace("-", " ")}</Text>
                  <TouchableOpacity onPress={() => toggleFilter(f)}>
                    <Ionicons name="close" size={14} color="#6B7280" className="ml-1" />
                  </TouchableOpacity>
                </Badge>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Listings with skeleton loader */}
        <View className="flex-1 mt-4">
          {loading ? (
            <View className="px-4 shadow-md">
              {[...Array(5)].map((_, i) => (
                <View key={i} className="mb-4 shadow-md">
                  {/* Skeleton styled like a ListingCard */}
                  <Skeleton className="h-40 w-full rounded-xl mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2" />
                </View>
              ))}
            </View>
          ) : (
            <FlatList
              data={filteredListings}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => 
                <TouchableOpacity onPress={() => router.push(`./home/listing/${item.id}`)}>
                  <ListingCard {...item} />
                </TouchableOpacity>
            }
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <Text className="text-center text-gray-500 mt-10">
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
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-2xl p-6 max-h-[70%]">
              <Text className="text-lg font-semibold mb-4">Filters</Text>

              {/* Checkbox filters */}
              <ScrollView>
                <View className="flex-row flex-wrap justify-between">
                  {allFilters.map((f, i) => {
                    const isActive = activeFilters.includes(f);
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => toggleFilter(f)}
                        className="flex-row items-center px-3 py-2 mb-3 rounded-lg border border-gray-300"
                        style={{
                          backgroundColor: isActive ? "#E0E7FF" : "white",
                          width: "48%",
                        }}
                      >
                        <Ionicons
                          name={isActive ? "checkbox" : "square-outline"}
                          size={18}
                          color={isActive ? "#4F46E5" : "#6B7280"}
                          style={{ marginRight: 6 }}
                        />
                        <Text className="capitalize flex-1">{f.replace("-", " ")}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {/* Buttons */}
              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  className="bg-gray-100 px-5 py-2 rounded-full"
                  onPress={() => setActiveFilters([])}
                >
                  <Text className="text-gray-700 font-medium">Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-indigo-500 px-5 py-2 rounded-full"
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text className="text-white font-medium">Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
