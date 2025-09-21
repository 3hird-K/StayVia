import React, { useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
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
import {
  filterPostsByDesc,
  filterPostsByFname,
  filterPostsByTitle,
} from "@/services/filterService";
import { fetchPosts, fetchAllFilters, fetchPostsByFilters } from "@/services/postService";

export default function Home() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const [search, setSearch] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showTypes, setShowTypes] = useState(false); // for chevron toggle
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filtersApplied, setFiltersApplied] = useState(false);


  const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    "Boarding House": "home-outline",
    Dormitory: "school-outline",
    "Shared Room": "people-outline",
    "Private Room": "person-outline",
  };
  const types = ["Boarding House", "Dormitory", "Shared Room", "Private Room"];


  // Fetch all posts
  const { data: posts = [], isLoading, isError, error, refetch, isFetching } =
    useQuery({
      queryKey: ["posts"],
      queryFn: fetchPosts,
      staleTime: 1000 * 60,
    });

  // Search queries
  const { data: filteredPostsTitle, isFetching: isFetchingFilteredTitle } =
    useQuery({
      queryKey: ["postsTitle", search],
      queryFn: () => filterPostsByTitle(search),
      enabled: !!search,
      placeholderData: posts,
    });

  const { data: filteredPostsDesc, isFetching: isFetchingFilteredDesc } =
    useQuery({
      queryKey: ["postsDesc", search],
      queryFn: () => filterPostsByDesc(search),
      enabled: !!search,
      placeholderData: posts,
    });

  const { data: filteredPostsFname, isFetching: isFetchingFilteredFname } =
    useQuery({
      queryKey: ["postsFname", search],
      queryFn: () => filterPostsByFname(search),
      enabled: !!search,
      placeholderData: posts,
    });


    
    
    // Fetch filters
    const { data: filtersData } = useQuery({
      queryKey: ["allFilters"],
      queryFn: fetchAllFilters,
    });
    
    const formatted = JSON.stringify(selectedFilters).replace(/",\s+"/g, '","');
    const filteredPostsData = formatted;

    const { data: filteredPosts = [], isFetching: isFetchingFilteredData } =
      useQuery({
        queryKey: ["filteredPosts", filteredPostsData],
        queryFn: () => fetchPostsByFilters(filteredPostsData),
        enabled: filtersApplied && filteredPostsData.length > 0,
      });

    // Fetch posts based on selected filters (server-side)
    // const { data: filteredSelectedPosts = [] , isFetching: isFetchingFilteredData } =
    //   useQuery({
    //     queryKey: ["filteredPosts", filteredPostsData],
    //     queryFn: () => fetchPostsByFilters(filteredPostsData),
    //     enabled: true, 
    //   });
      // console.log(filteredPostsData)
      // console.log(JSON.stringify(filteredPosts, null, 2))


      


  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  // console.log(selectedFilters);
  // console.log(JSON.stringify(filteredPosts, null, 2))



  const isSearchLoading =
    isFetchingFilteredTitle || isFetchingFilteredDesc || isFetchingFilteredFname || isFetchingFilteredData;

  const isRefetching = isSearchLoading;

  // const filteredPost = search
  //   ? [
  //       ...(filteredPostsTitle ?? []),
  //       ...(filteredPostsDesc ?? []),
  //       ...(filteredPostsFname ?? []),
  //     ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
  //   : posts;

    
  //   const displayedPosts = filteredPost.filter((post) =>
  //     selectedType ? post.type === selectedType : true
  // );
  const basePosts = search
  ? [
      ...(filteredPostsTitle ?? []),
      ...(filteredPostsDesc ?? []),
      ...(filteredPostsFname ?? []),
    ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
  : posts;

// if filters are applied, show the filtered posts from the server
const filteredByServer =
  filtersApplied && selectedFilters.length > 0 ? filteredPosts : basePosts;

const displayedPosts = filteredByServer.filter((post) =>
  selectedType ? post.type === selectedType : true
);

  
  const showNoListings =
    !isLoading && !isSearchLoading && basePosts.length === 0;


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
        className="flex-col items-center px-1 py-0"
        style={{ backgroundColor: colors.primary }}
      >
        <Image
          alt="App Logo"
          source={require("@/assets/images/icon-white.png")}
          className="w-40 h-24 top-2"
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

          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            style={{
              marginLeft: 12,
              backgroundColor: colors.primary,
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Ionicons name="filter" size={20} color={colors.primaryForeground} />
          </TouchableOpacity>
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
            const firstWord = typeName.split(" ")[0];
            const isSelected = selectedType === typeName;

            return (
              <TouchableOpacity
                key={typeName}
                onPress={() => setSelectedType(isSelected ? null : typeName)}
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
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
                    backgroundColor: isSelected
                      ? colors.primary
                      : "transparent",
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
                  {firstWord}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

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
              backgroundColor: colors.card,
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
                color: colors.foreground,
                marginBottom: 12,
              }}
            >
              Select Filters
            </Text>

            {/* Filter Chips */}
            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingBottom: 16,
              }}
            >
              <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingBottom: 16,
              }}
            >
              {filtersData?.map((filter: string) => {
                const isSelected = selectedFilters.includes(filter);
                return (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => toggleFilter(filter)}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      marginRight: 8,
                      marginBottom: 8,
                      backgroundColor: isSelected ? colors.primary : colors.card,
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? "white" : colors.foreground,
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            </ScrollView>

            {/* <TouchableOpacity
              onPress={() => setFilterModalVisible(false)}
              style={{
                marginTop: 16,
                backgroundColor: colors.primary,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: colors.primaryForeground,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Apply Filters
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => {
                setFiltersApplied(true);
                setFilterModalVisible(false);
              }}
              style={{
                marginTop: 16,
                backgroundColor: colors.primary,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: colors.primaryForeground,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Apply Filters
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* Listings */}
      <View style={{ flex: 1, marginTop: 16 }}>
        {(isLoading || isSearchLoading) ? (
          <View style={{ paddingHorizontal: 16 }}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={{ marginBottom: 16 }}>
                <Skeleton
                  style={{
                    height: 160,
                    width: "100%",
                    borderRadius: 16,
                    marginBottom: 8,
                  }}
                />
                <Skeleton style={{ height: 16, width: "75%", marginBottom: 4 }} />
                <Skeleton style={{ height: 16, width: "50%" }} />
              </View>
            ))}
          </View>
        ) : isError ? (
          <Text
            style={{
              textAlign: "center",
              color: colors.mutedForeground,
              marginTop: 40,
            }}
          >
            Error loading posts: {String((error as Error).message)}
          </Text>
        ) : (
          <FlatList
            data={displayedPosts}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Link href={`/home/post/${item.id}`} asChild>
                <PostCard post={item} />
              </Link>
            )}
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() =>
              showNoListings ? (
                <Text
                  style={{
                    textAlign: "center",
                    color: colors.mutedForeground,
                    marginTop: 40,
                    fontSize: 16,
                  }}
                >
                  No Post Found!
                </Text>
              ) : null
            }
            refreshing={isFetching || isRefetching}
            onRefresh={() => refetch()}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
