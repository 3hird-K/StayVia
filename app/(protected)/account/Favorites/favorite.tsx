import ScreenWrapper from "@/components/ScreenWrapper";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ListingCard } from "@/components/home/listingCard";
import EmptyState from "@/components/EmptyState";
import HeaderBtn from "@/components/HeaderBtn";

const listings = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
    dateRange: "Sep 8 – Oct 3",
    title: "Modern Apartment in CDO",
    description: "Cozy studio near downtown.",
    beds: "2 beds",
    rating: 4.83,
    reviews: 12,
    price: "₱38,943",
    nights: "for 25 nights",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    dateRange: "Oct 10 – Nov 2",
    title: "Scenic Mountain Retreat",
    description: "Enjoy breathtaking views.",
    beds: "3 beds",
    rating: 4.9,
    reviews: 45,
    price: "₱52,000",
    nights: "for 20 nights",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    dateRange: "Nov 15 – Dec 5",
    title: "Cozy Beachside Villa",
    description: "Steps away from the ocean.",
    beds: "4 beds",
    rating: 4.7,
    reviews: 32,
    price: "₱75,500",
    nights: "for 30 nights",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    dateRange: "Dec 20 – Jan 5",
    title: "Urban Loft in Manila",
    description: "Stylish loft in the heart of the city.",
    beds: "1 queen bed",
    rating: 4.85,
    reviews: 58,
    price: "₱42,300",
    nights: "for 16 nights",
  },
];

export default function Favorite() {
  const insets = useSafeAreaInsets();

  const [hasFavorited] = useState(false); 

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
            renderItem={({ item }) => <ListingCard {...item} />}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
}
