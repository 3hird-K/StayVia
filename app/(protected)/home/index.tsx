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
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/home/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "expo-router";
import { useAppTheme } from "@/lib/theme";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/services/postService";


export default function Home() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const [search, setSearch] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
    // isRefetching
    isFetching
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60, 
  });

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

            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingBottom: 16,
              }}
            >
              {/* filter chips would go here */}
            </ScrollView>

            <TouchableOpacity
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
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Listings */}
      <View style={{ flex: 1, marginTop: 16 }}>
        {isLoading ? (
          <View style={{ paddingHorizontal: 16 }}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={{ marginBottom: 16 }}>
                <Skeleton
                  style={{ height: 160, width: "100%", borderRadius: 16, marginBottom: 8 }}
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
            data={posts}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Link href={`/home/post/${item.id}`} asChild>
                <PostCard post={item} />
              </Link>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text
                style={{
                  textAlign: "center",
                  color: colors.mutedForeground,
                  marginTop: 40,
                }}
              >
                No listings found
              </Text>
            )}
            refreshing={isFetching}           // <- show loading indicator while refreshing
            onRefresh={() => refetch()}        // <- triggers refetch when pulled
/>

        )}
      </View>
    </SafeAreaView>
  );
}
