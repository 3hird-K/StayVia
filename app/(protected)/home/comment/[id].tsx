import ScreenWrapper from "@/components/ScreenWrapper";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { ChevronDown, ChevronRight, Heart } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";

// 🔗 Import comments from JSON file
import commentsData from "@/assets/data/comments.json";

// 🔁 Recursive comment item
function CommentItem({ item, level = 0 }: { item: any; level?: number }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View
      className="mb-3"
      style={{ marginLeft: level * 16 }} // indentation for replies
    >
      <View className="flex-row items-start gap-2">
        {/* Avatar */}
        <Image
          source={{
            uri:
              item.user?.image ||
              "https://ui-avatars.com/api/?name=" + item.user?.name,
          }}
          className="w-8 h-8 rounded-full"
        />

        <View className="flex-1">
          {/* Username & Time */}
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-semibold">{item.user?.name}</Text>
            <Text className="text-xs text-gray-500">
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>

          {/* Comment text */}
          <Text className="text-sm mt-1">{item.comment}</Text>

          {/* Actions */}
          <View className="flex-row items-center gap-4 mt-1">
            <TouchableOpacity className="flex-row items-center gap-1">
              <Heart size={14} color="black" />
              <Text className="text-xs">{item.upvotes}</Text>
            </TouchableOpacity>
            {item.replies?.length > 0 && (
              <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                className="flex-row items-center gap-1"
              >
                {expanded ? (
                  <ChevronDown size={14} color="black" />
                ) : (
                  <ChevronRight size={14} color="black" />
                )}
                <Text className="text-xs text-gray-600">
                  {expanded
                    ? "Hide replies"
                    : `View replies (${item.replies.length})`}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Replies */}
          {expanded &&
            item.replies?.map((reply: any) => (
              <CommentItem key={reply.id} item={reply} level={level + 1} />
            ))}
        </View>
      </View>
    </View>
  );
}

export default function Comment() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // 📝 Local state for comments
  const [comments, setComments] = useState(
    commentsData.filter((c) => c.post_id === id)
  );
  const [newComment, setNewComment] = useState("");

  // ➕ Add new comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newEntry = {
      id: `comment-${Date.now()}`,
      post_id: id,
      user_id: "current-user",
      parent_id: null,
      comment: newComment,
      created_at: new Date().toISOString(),
      upvotes: 0,
      user: {
        id: "current-user",
        name: "u/You",
        image:
          "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/15.png",
      },
      replies: [],
    };

    setComments([newEntry, ...comments]);
    setNewComment("");
  };

  return (
    <ScreenWrapper>
      {/* Header with Back Button */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={28} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Comments</Text>
      </View>

      {/* Comments List */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CommentItem item={item} />}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Input box (stays above keyboard) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View className="flex-row items-center border-t border-gray-200 p-3 bg-white">
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write a comment..."
            className="flex-1 text-base"
          />
          <TouchableOpacity onPress={handleAddComment} className="ml-3">
            <Ionicons name="send" size={22} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
