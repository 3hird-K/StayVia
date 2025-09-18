import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, ScrollView, Modal, Dimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react-native";
import { toggleFavorite, isFavorite } from "@/utils/favorites";
import { useRouter } from "expo-router";
import { Post } from "@/utils/types";
import { Separator } from "../ui/separator";
import { AntDesign } from "@expo/vector-icons";

type PostCardProps = {
  post: Post;
  onFavoriteChange?: (postId: number, favorited: boolean) => void;
};

export function HorizontalPostCard({ post, onFavoriteChange }: PostCardProps) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [voteCount, setVoteCount] = useState<number>(post.upvotes ?? 0);
  const [commentsCount, setCommentsCount] = useState<number>(post.reviews ?? 0);
  const [expanded, setExpanded] = useState(false);
  const [fullScreenImageVisible, setFullScreenImageVisible] = useState(false);

  const maxChars = 100;
  const description = post.description ?? "";
  const shouldTruncate = description.length > maxChars;
  const displayText = expanded ? description : shouldTruncate ? description.slice(0, maxChars) + "..." : description;

  useEffect(() => {
    if (post.id) {
      isFavorite(post.id).then(setFavorited);
    }
  }, [post.id]);

  const handleFavorite = async () => {
    const result = await toggleFavorite(post.id);
    setFavorited(result);
    setVoteCount((prev) => (result ? prev + 1 : Math.max(prev - 1, 0)));
    onFavoriteChange?.(post.id, result);
  };

  const handleComments = () => router.push(`/home/comment/${post.id}`);
  const handleOpenPost = () => router.push(`/home/post/${post.id}`);
  const handleOpenuser = () => router.push(`/(user)/${post.user?.id}`);

  return (
    <Card className="w-72 mr-3 p-0 overflow-hidden shadow-sm">
      <CardHeader className="px-2 pt-4 pb-[-10]">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleOpenuser} className="flex-row items-center" activeOpacity={0.7}>
            {post.user?.avatar && (
              <Image source={{ uri: post.user.avatar }} className="w-8 h-8 rounded-full mr-3" />
            )}
            <View className="flex-col">
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {post.user?.firstname || post.user?.lastname
                  ? `${post.user?.firstname ?? ""} ${post.user?.lastname ?? ""}`.trim()
                  : post.user?.username?.trim()
                  ? post.user.username
                  : "Stayvia User"}
              </Text>
              <Text className="text-xs text-gray-500">
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString()
                  : ""} ·{" "}
                {post.created_at
                  ? new Date(post.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : ""}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOpenPost} className="p-2">
            <AntDesign name="folderopen" size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        <CardTitle className="text-base mt-[-2]">{post.title}</CardTitle>

        {description.length > 0 && (
          <View className="mt-[-10]">
            <Text className="text-sm text-gray-800 dark:text-gray-100">{displayText}</Text>
            {shouldTruncate && (
              <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text className="text-xs text-blue-600 mt-1">{expanded ? "See less" : "See more"}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </CardHeader>

      <CardContent className="px-0 mt-[-10]">
        {post.image && (
          <TouchableOpacity onPress={() => setFullScreenImageVisible(true)}>
            <Image
              source={{ uri: post.image ?? "" }}
              className="w-full h-40 rounded"
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      </CardContent>

      <Separator className="my-[-15]" />

      <CardFooter className="flex-row items-center justify-between px-4 pb-3 mt-2">
        <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleFavorite(); }} className="flex-row items-center gap-2">
          <Heart size={18} color={favorited ? "red" : "black"} fill={favorited ? "red" : "none"} />
          <Text className="text-sm font-medium">{voteCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleComments(); }} className="flex-row items-center gap-2">
          <MessageCircle size={18} color="black" />
          <Text className="text-sm">{commentsCount} comments</Text>
        </TouchableOpacity>
      </CardFooter>

      <Modal visible={fullScreenImageVisible} transparent={true} onRequestClose={() => setFullScreenImageVisible(false)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgb(0,0,0)", justifyContent: "center", alignItems: "center" }}
          onPress={() => setFullScreenImageVisible(false)}
          activeOpacity={1}
        >
          <Image source={{ uri: post.image || "" }} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
        </TouchableOpacity>
      </Modal>
    </Card>
  );
}

// Horizontal scroll wrapper for multiple posts
export function HorizontalPostList({ posts }: { posts: Post[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-2">
      {posts.map((post) => (
        <HorizontalPostCard key={post.id} post={post} />
      ))}
    </ScrollView>
  );
}
