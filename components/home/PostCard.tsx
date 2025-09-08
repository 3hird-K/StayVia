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

type PostCardProps = {
  id: string;
  title: string;
  created_at: string;
  upvotes: number;
  nr_of_comments: number;
  image?: string | null;
  availability?: string | null;
  pricePerNight?: string | null;
  location?: string | null;
  group: {
    id: string;
    name: string;
    image: string;
  };
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
};

export function PostCard({
  id,
  title,
  created_at,
  upvotes,
  nr_of_comments,
  image,
  availability,
  pricePerNight,
  location,
  group,
  user,
}: PostCardProps) {
  const [favorited, setFavorited] = useState(false);
  const [voteCount, setVoteCount] = useState(upvotes);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      isFavorite(id).then((res) => {
        setFavorited(res);
        setVoteCount(upvotes + (res ? 1 : 0));
      });
    }
  }, [id]);

  const handleFavorite = async () => {
    const result = await toggleFavorite(id);
    setFavorited(result);
    setVoteCount((prev) => (result ? prev + 1 : prev - 1));
  };

  const handleComments = () => {
    router.push(`./home/comment/${id}`);
  };

  return (
    <Card className="w-full p-0 overflow-hidden shadow-sm mb-4">
      {/* Image First */}
      {image ? (
        <View className="relative">
          <Image
            source={{ uri: image }}
            className="w-full h-48"
            resizeMode="cover"
          />
          {/* ❤️ Single Favorite Button (top-right) */}
          <TouchableOpacity
            onPress={handleFavorite}
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
          source={{ uri: group.image }}
          className="w-6 h-6 rounded-full mr-2"
        />
        <View className="flex-1">
          <Text className="text-sm font-semibold">{group.name}</Text>
          <Text className="text-xs text-gray-500">
            Posted by {user.name} · {new Date(created_at).toLocaleDateString()}
          </Text>
        </View>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-4 pt-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {location ? (
          <Text className="text-xs text-gray-500 mt-1">{location}</Text>
        ) : null}
        {availability ? (
          <Text
            className={`text-xs mt-1 ${
              availability.toLowerCase() === "available"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {availability}
          </Text>
        ) : null}
        {pricePerNight ? (
          <Text className="text-sm font-semibold mt-1">{pricePerNight}</Text>
        ) : null}
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex-row items-center justify-between px-4 pb-3 mt-2">
        {/* ❤️ Same Favorite/Upvote, synced with top */}
        <TouchableOpacity
          onPress={handleFavorite}
          className="flex-row items-center gap-2"
        >
          <Heart
            size={18}
            color={favorited ? "red" : "black"}
            fill={favorited ? "red" : "none"}
          />
          <Text className="text-sm font-medium">{voteCount}</Text>
        </TouchableOpacity>

        {/* 💬 Comments */}
        <TouchableOpacity
          onPress={handleComments}
          className="flex-row items-center gap-2"
        >
          <MessageCircle size={18} color="black" />
          <Text className="text-sm">{nr_of_comments} comments</Text>
        </TouchableOpacity>
      </CardFooter>
    </Card>
  );
}
