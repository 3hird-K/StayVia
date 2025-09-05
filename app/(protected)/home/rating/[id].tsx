import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import listings from "@/assets/data/listings.json";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function RatingDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Listing not found</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Reviews & Ratings</Text>
      </View>

      {/* Rating summary */}
      <View className="p-5 items-center">
        <Text className="text-5xl font-bold">{listing.rating}</Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={22} color="#fbbf24" />
          <Ionicons name="star" size={22} color="#fbbf24" />
          <Ionicons name="star" size={22} color="#fbbf24" />
          <Ionicons name="star" size={22} color="#fbbf24" />
          <Ionicons name="star-half" size={22} color="#fbbf24" />
        </View>
        <Text className="text-gray-500 mt-2">
          Based on {listing.reviews} reviews
        </Text>
      </View>

      {/* Example breakdown (static for now) */}
      <View className="px-5">
        {[5, 4, 3, 2, 1].map((star) => (
          <View key={star} className="flex-row items-center mb-2">
            <Text className="w-8">{star}★</Text>
            <View className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
              <View
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${Math.random() * 100}%` }} // fake data for now
              />
            </View>
            <Text>{Math.floor(Math.random() * 50)}</Text>
          </View>
        ))}
      </View>

      {/* Example review */}
      <View className="bg-white m-5 p-4 rounded-xl shadow">
        <View className="flex-row items-center mb-2">
          <Ionicons name="person-circle" size={40} color="gray" />
          <View className="ml-3">
            <Text className="font-semibold">Dustin You</Text>
            <Text className="text-xs text-gray-500">2 weeks ago</Text>
          </View>
        </View>
        <Text className="text-gray-700">
          never again di najud ko mobalik kay hadlok kayu. way tao pero nay tae
        </Text>
      </View>
      <View className="bg-white m-5 p-4 rounded-xl shadow">
        <View className="flex-row items-center mb-2">
          <Ionicons name="person-circle" size={40} color="gray" />
          <View className="ml-3">
            <Text className="font-semibold">Harvey Babia</Text>
            <Text className="text-xs text-gray-500">2 weeks ago</Text>
          </View>
        </View>
        <Text className="text-gray-700">
          Nice kaayo baii, lingaw kaayo mi diri. Angayan kaayo para sa
          barkada. Peaceful kaayo. Salamat StayVia!
        </Text>
      </View>
    </ScrollView>
    </ScreenWrapper>
  );
}
