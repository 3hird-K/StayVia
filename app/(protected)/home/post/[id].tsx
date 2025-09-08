import ScreenWrapper from "@/components/ScreenWrapper";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import posts from "@/assets/data/posts.json";

export default function DetailPost() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const post = posts.find((p) => p.id === id);

  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(post?.upvotes || 0);

  if (!post) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <Text>Post not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const handleUpvote = () => {
    if (upvoted) {
      setUpvotes((prev) => prev - 1);
    } else {
      setUpvotes((prev) => prev + 1);
    }
    setUpvoted(!upvoted);
  };

  const isAvailable = post.availability?.toLowerCase() === "available";

  return (
    <ScreenWrapper>
      <ScrollView className="flex-1 bg-white">
        {/* Image with Back & Upvote Buttons */}
        <View className="relative">
          {post.image ? (
            <Image
              source={{ uri: post.image }}
              className="w-full h-80 rounded-md"
              resizeMode="cover"
            />
          ) : null}

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.push(`/(protected)/home`)}
            className="absolute top-6 left-4 bg-black/50 rounded-full p-2"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Upvote Button */}
          <TouchableOpacity
            onPress={handleUpvote}
            className="absolute top-6 right-4 bg-black/50 rounded-full px-3 py-1 flex-row items-center"
          >
            <Ionicons
              name={upvoted ? "heart" : "heart-outline"}
              size={22}
              color={upvoted ? "red" : "white"}
            />
            <Text className="text-white ml-1">{upvotes}</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="p-5">
          <Text className="text-xl font-bold mb-2">{post.title}</Text>

          {post.location ? (
            <Text className="text-sm text-gray-500 mb-1">📍 {post.location}</Text>
          ) : null}

          {/* Availability */}
          {post.availability ? (
            <Text
              className={`text-sm mb-2 ${
                isAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {post.availability}
            </Text>
          ) : null}

          {/* Map Section */}
          {post.latitude && post.longitude ? (
            <View className="w-full h-60 mb-4 rounded-lg overflow-hidden">
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: post.latitude,
                  longitude: post.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: post.latitude,
                    longitude: post.longitude,
                  }}
                  title={post.title}
                  description={post.location}
                />
              </MapView>
            </View>
          ) : null}

          {/* Price */}
          {post.pricePerNight ? (
            <Text className="text-lg font-semibold mb-2">{post.pricePerNight}</Text>
          ) : null}

          {post.beds || post.type ? (
            <Text className="text-sm text-gray-600 mb-2">
              {post.beds} {post.beds && post.type ? "·" : ""} {post.type}
            </Text>
          ) : null}

          {post.rating !== undefined && post.reviews !== undefined ? (
            <TouchableOpacity onPress={() => router.push(`../review/${id}`)}
                className="flex-row items-center mb-2"
            >
                <Text className="text-sm text-yellow-600">
                ⭐ {post.rating} ({post.reviews} reviews)
                </Text>
                <Ionicons name="chevron-forward" size={16} color="gray" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            ) : null}


          {post.postedAt ? (
            <Text className="text-xs text-gray-400 mb-2">Posted: {post.postedAt}</Text>
          ) : null}

          {/* Filters */}
          {post.filters && post.filters.length > 0 ? (
            <View className="flex-row flex-wrap mb-4">
              {post.filters.map((filter, index) => (
                <Text
                  key={index}
                  className="text-xs bg-gray-200 rounded px-2 py-0.5 mr-1 mb-1"
                >
                  {filter}
                </Text>
              ))}
            </View>
          ) : null}

          {/* Description */}
          {post.description ? (
            <Text className="text-base text-gray-700 mb-4">{post.description}</Text>
          ) : null}

          {/* Extra Info */}
          <View className="mt-4">
            {/* <Text className="text-sm text-gray-500">
              Comments: {post.nr_of_comments} 💬
            </Text> */}
            <Text className="text-sm text-gray-500 mt-2">
              Posted by {post.user?.name} in {post.group?.name}
            </Text>
          </View>

          {/* Request Rental Button */}
          {/* <TouchableOpacity
            disabled={!isAvailable}
            className={`mt-6 py-3 rounded-lg ${
              isAvailable ? "bg-blue-600" : "bg-gray-400"
            }`}
          >
            <Text className="text-center text-white font-semibold">
              {isAvailable ? "Request Rental" : "Unavailable"}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            disabled={!isAvailable}
            onPress={() => isAvailable && router.push(`../request/${id}`)}
            className={`mt-6 py-3 rounded-lg ${
                isAvailable ? "bg-blue-800" : "bg-gray-400"
            }`}
            >
            <Text className="text-center text-white font-semibold">
                {isAvailable ? "Request Rental" : "Unavailable"}
            </Text>
            </TouchableOpacity>



        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
