import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import listings from "@/assets/data/posts.json";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { toggleFavorite, isFavorite } from "@/utils/favorites";
import { Item } from "@rn-primitives/radio-group";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function ListingDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);

  // find listing from JSON
  const listing = listings.find((l) => String(l.id) === String(id));

  useEffect(() => {
    if (id) {
      isFavorite(String(id)).then(setFavorited);
    }
  }, [id]);

  if (!listing) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Listing not found</Text>
      </View>
    );
  }

  const handleFavorite = async () => {
    if (id) {
      const result = await toggleFavorite(String(id));
      setFavorited(result);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView className="flex-1 bg-white">
      {/* Header Image */}
      <Image
        source={{ uri: listing.image || "https://placehold.co/600x400" }}
        className="w-full h-80"
      />

      {/* Top Buttons (Back + Heart) */}
      <View className="absolute top-12 left-0 right-0 flex-row justify-between px-4">
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-black/50 p-2 rounded-full"
          accessible
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Heart button */}
        <TouchableOpacity
          onPress={handleFavorite}
          className="bg-black/50 p-2 rounded-full"
          accessible
          accessibilityLabel="Toggle favorite"
        >
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={24}
            color={favorited ? "red" : "white"}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="p-5">
        <Text className="text-2xl font-bold mb-1">{listing.title}</Text>
        <Text className="text-gray-600 mb-3">{listing.location}</Text>

        <Text className="text-indigo-600 text-xl font-semibold mb-4">
          {listing.pricePerNight}
        </Text>

        {/* Ratings */}
        <TouchableOpacity
          onPress={() => router.push(`../rating/${listing.id}`)}
          className="flex-row items-center mb-4"
        >
          <Text>Rating: </Text>
          <Ionicons name="star" size={18} color="#fbbf24" />
          <Text className="ml-1 font-semibold">{listing.rating}</Text>
          <Text className="ml-2 text-gray-500">({listing.reviews} reviews)</Text>
        </TouchableOpacity>

        {/* Beds */}
        <Text className="text-gray-700 mb-4">{listing.beds}</Text>

        {/* Description */}
        <Text className="text-gray-700 leading-6 mb-6">
          {listing.description}
        </Text>

        {/* Filters */}
        {listing.filters && (
          <View className="flex-row flex-wrap gap-2 mb-6">
            {listing.filters.map((f, i) => (
              <View key={i} className="bg-indigo-100 px-3 py-1 rounded-full">
                <Text className="text-indigo-700 text-sm capitalize">
                  {f.replace("-", " ")}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Availability */}
        <Text
          className={`mb-6 font-semibold ${
            listing.availability ? "text-green-600" : "text-red-600"
          }`}
        >
          {listing.availability ? "Available" : "Not Available"}
        </Text>

        {/* Posted Date */}
        <Text className="text-gray-500 text-sm mb-10">
          Posted on{" "}
          {listing.postedAt
            ? new Date(listing.postedAt).toDateString()
            : "Unknown"}
        </Text>

        {/* Request Rental Button */}
        <TouchableOpacity
          disabled={!listing.availability}
          className={`py-4 rounded-xl ${
            listing.availability ? "bg-indigo-500" : "bg-gray-400"
          }`}
          accessible
          accessibilityLabel="Request rental"
        >
          <Text className="text-white text-center font-semibold text-lg">
            {listing.availability ? "Request Rental" : "Unavailable"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </ScreenWrapper>
  );
}
