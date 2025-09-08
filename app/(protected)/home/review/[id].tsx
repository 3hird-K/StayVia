import ScreenWrapper from "@/components/ScreenWrapper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import posts from "@/assets/data/posts.json";

// ✅ Expandable text component
function ExpandableText({ text, limit = 100 }: { text: string; limit?: number }) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= limit) {
    return <Text className="text-sm text-gray-700">{text}</Text>;
  }

  return (
    <View>
      <Text className="text-sm text-gray-700">
        {expanded ? text : text.slice(0, limit) + "..."}
      </Text>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text className="text-xs text-blue-600 mt-1 font-medium">
          {expanded ? "See less" : "See more"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Review() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <Text>Post not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1 p-4 bg-white">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4 flex-row items-center"
        >
          <Ionicons name="chevron-back" size={24} color="black" />
          <Text className="ml-1 text-lg font-semibold">Reviews</Text>
        </TouchableOpacity>

        {/* Header */}
        <Text className="text-2xl font-bold mb-6">{post.title}</Text>

        {/* Reviews List */}
        <FlatList
          data={post.reviewsList || []}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="w-full mb-5 p-4 bg-gray-50 rounded-xl shadow-sm">
              <View className="w-ful flex-row items-center mb-2">
                {/* Avatar */}
                <Image
                  source={{
                    uri:
                      item.avatar ||
                      `https://ui-avatars.com/api/?name=${item.user}`,
                  }}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <View>
                  <Text className="text-base font-semibold">{item.user}</Text>
                  <View className="flex-row items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < item.rating ? "star" : "star-outline"}
                        size={16}
                        color={i < item.rating ? "#FACC15" : "#D1D5DB"}
                      />
                    ))}
                  </View>
                </View>
              </View>

              {/* ✅ Collapsible review text */}
              <ExpandableText text={item.comment} limit={120} />
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-gray-500 text-center mt-10">
              No reviews yet.
            </Text>
          }
        />
      </View>
    </ScreenWrapper>
  );
}
