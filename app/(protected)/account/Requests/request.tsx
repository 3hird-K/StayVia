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
import RentalHistoryCard from "@/components/RentalHistoryCard";

export default function Request() {
  const insets = useSafeAreaInsets();

  const [hasHistory] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null); // <-- track which card is loading

  const handleViewPost = (id: string) => {
    setLoadingId(id); // mark this card as loading
    setTimeout(() => {
      setLoadingId(null); // reset after navigation
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
        {/* Back Button */}
        <View className="flex-row items-center w-full mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#4B5563" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800 ml-2">
            My Request
          </Text>
        </View>

        {/* Rental History */}
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Rental History
        </Text>
        <Text className="text-gray-600 mb-6">
          Your past boarding stays will appear here once you’ve booked through
          Stayvia.
        </Text>

        {!hasHistory ? (
          // Empty State
          <View className="flex-1 justify-center items-center">
            <Ionicons name="home-outline" size={80} color="#2563EB" />
            <Text className="text-center text-gray-500 mt-4 mb-6">
              Your past stays will appear here once you’ve booked with Stayvia.
            </Text>
            <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-lg">
              <Text className="text-white font-semibold">Find a Place</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // FlatList for Rental History
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
                loading={loadingId === item.id} // only the clicked one shows loading
                onPress={() => handleViewPost(item.id)} // pass ID
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
