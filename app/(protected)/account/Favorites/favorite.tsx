import ScreenWrapper from "@/components/ScreenWrapper";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import  { PostCard }  from "@/components/home/PostCard";
import EmptyState from "@/components/EmptyState";
import HeaderBtn from "@/components/HeaderBtn";
import listings from "@/assets/data/posts.json";

export default function Favorite() {
  const insets = useSafeAreaInsets();

  const [hasFavorited] = useState(true); 

  return (
    <ScreenWrapper>
      <SafeAreaView
        className="flex-1 bg-white"
        style={{ paddingTop: insets.top || 22 }}
      >
        <HeaderBtn title="Favorites" />

        {!hasFavorited ? (
          <EmptyState
            icon={<Ionicons name="heart-outline" size={80} color="#2563EB" />}
            title="No Favorites Yet"
            message="Save your favorite places to easily find them later."
            buttonLabel="Browse Listings"
            onPress={() => router.push("/(protected)/home")}
          />
        ) : (
          <FlatList
            data={listings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PostCard {...item} />}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
}
