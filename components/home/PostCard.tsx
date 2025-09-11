import { useEffect, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react-native";
import { toggleFavorite, isFavorite } from "@/utils/favorites";
import { useRouter } from "expo-router";
import { Post } from "@/utils/types";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const [favorited, setFavorited] = useState(false);
  const [voteCount, setVoteCount] = useState(post.upvotes);
  const router = useRouter();

  useEffect(() => {
    if (post.id) {
      isFavorite(post.id).then((res) => {
        setFavorited(res);
        setVoteCount(post.upvotes + (res ? 1 : 0));
      });
    }
  }, [post.id]);

  const handleFavorite = async () => {
    const result = await toggleFavorite(post.id);
    setFavorited(result);
    setVoteCount((prev) => (result ? prev + 1 : prev - 1));
  };

  const handleComments = () => {
    router.push(`/home/comment/${post.id}`);
  };

  const handleOpenPost = () => {
    router.push(`/home/post/${post.id}`);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleOpenPost}
      className="w-full"
    >
      <Card className="w-full p-0 overflow-hidden shadow-sm mb-4">
        {/* Image */}
        {post.image ? (
          <View className="relative">
            <Image
              source={{ uri: post.image }}
              className="w-full h-48"
              resizeMode="cover"
            />
            {/* Favorite Button (top-right) */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleFavorite();
              }}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
            >
              <Heart
                size={18}
                color={favorited ? "red" : "black"}
                fill={favorited ? "red" : "none"}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Header */}
        <CardHeader className="flex-row items-center gap-2 px-4 pt-3">
          <Image
            source={{ uri: post.group.image }}
            className="w-6 h-6 rounded-full mr-2"
          />
          <View className="flex-1">
            <Text className="text-sm font-semibold">{post.group.name}</Text>
            <Text className="text-xs text-gray-500">
              Posted by {post.user.name} ·{" "}
              {new Date(post.created_at).toLocaleDateString()}
            </Text>
          </View>
        </CardHeader>

        {/* Content */}
        <CardContent className="px-4 pt-2">
          <CardTitle className="text-base">{post.title}</CardTitle>
          {post.location ? (
            <Text className="text-xs text-gray-500 mt-1">{post.location}</Text>
          ) : null}
          {post.availability ? (
            <Text
              className={`text-xs mt-1 ${
                post.availability.toLowerCase() === "available"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {post.availability}
            </Text>
          ) : null}
          {post.pricePerNight ? (
            <Text className="text-sm font-semibold mt-1">
              {post.pricePerNight}
            </Text>
          ) : null}
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex-row items-center justify-between px-4 pb-3 mt-2">
          {/* Favorite/Upvote */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
            className="flex-row items-center gap-2"
          >
            <Heart
              size={18}
              color={favorited ? "red" : "black"}
              fill={favorited ? "red" : "none"}
            />
            <Text className="text-sm font-medium">{voteCount}</Text>
          </TouchableOpacity>

          {/* Comments */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleComments();
            }}
            className="flex-row items-center gap-2"
          >
            <MessageCircle size={18} color="black" />
            <Text className="text-sm">{post.nr_of_comments} comments</Text>
          </TouchableOpacity>
        </CardFooter>
      </Card>
    </TouchableOpacity>
  );
}
