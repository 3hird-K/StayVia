import ScreenWrapper from "@/components/ScreenWrapper";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import RentalHistoryCard from "@/components/home/rentalHistoryCard";
import EmptyState from "@/components/EmptyState"; 
import HeaderBtn from "@/components/HeaderBtn";

export default function Request() {
  const insets = useSafeAreaInsets();

  const [hasHistory] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleViewPost = (id: string) => {
    setLoadingId(id);
    setTimeout(() => {
      setLoadingId(null);
      router.push("/(protected)/home");
    }, 1500);
  };

  const rentalHistory = [
    {
      id: "1",
      title: "Lapasan Boarding House CDOC",
      address:
        "Barangay Lapasan, Cagayan de Oro City, Misamis Oriental, 9000",
      stayed: "Stayed: Aug 2024 – Jan 2025 (6 months)",
      rent: "Rent: ₱5,000/month",
      rating: "Rating: ★★★★☆",
    },
    {
      id: "2",
      title: "Gusa Dormitory",
      address: "Barangay Gusa, Cagayan de Oro City, Misamis Oriental, 9000",
      stayed: "Stayed: Feb 2023 – Jul 2023 (5 months)",
      rent: "Rent: ₱4,500/month",
      rating: "Rating: ★★★★☆",
    },
    {
      id: "3",
      title: "Macasandig Apartment",
      address:
        "Barangay Macasandig, Cagayan de Oro City, Misamis Oriental, 9000",
      stayed: "Stayed: Jan 2022 – Dec 2022 (12 months)",
      rent: "Rent: ₱6,200/month",
      rating: "Rating: ★★★★★",
    },
  ];

  return (
    <ScreenWrapper>
      <SafeAreaView
        className="flex-1 bg-white px-4"
        style={{ paddingTop: insets.top || 22 }}
      >
        <HeaderBtn title="Request" />

        {/* Rental History */}
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Rental History
        </Text>
        <Text className="text-gray-600 mb-6">
          Your past boarding stays will appear here once you’ve booked through
          Stayvia.
        </Text>

        {!hasHistory ? (
          <EmptyState
            icon={<Ionicons name="home-outline" size={80} color="#2563EB" />}
            message="Your past stays will appear here once you’ve booked with Stayvia."
            buttonLabel="Find a Place"
            onPress={() => router.push("/(protected)/home")}
          />
        ) : (
          <FlatList
            data={rentalHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RentalHistoryCard
                title={item.title}
                address={item.address}
                stayed={item.stayed}
                rent={item.rent}
                rating={item.rating}
                loading={loadingId === item.id}
                onPress={() => handleViewPost(item.id)}
              />
            )}
            ItemSeparatorComponent={() => <View className="h-4" />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </ScreenWrapper>
  );
}
