import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Text } from "@/components/ui/text";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useRouter } from "expo-router";
import { Separator } from "../ui/separator";
import DownloadImage from "../download/downloadImage";
import DownloadPostImages from "../download/downloadPostImages";
import { useSupabase } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { insertFavorite, deleteFavorite, checkFavorite } from "@/services/favorites"; // ✅ ensure you have these
import { Database } from "@/types/database.types";

type PostWithUser = Database["public"]["Tables"]["posts"]["Row"] & {
  post_user: Database["public"]["Tables"]["users"]["Row"] | null;
};

type PostCardProps = { post: PostWithUser };

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [fullScreenImageVisible, setFullScreenImageVisible] = useState(false);
  const { user } = useUser();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const defaultAvatar = "https://i.pravatar.cc/150";
  const avatarUrl =
    !user?.imageUrl || user.imageUrl.includes("clerk.dev/static")
      ? defaultAvatar
      : user.imageUrl;

  // ----- State -----
  const [isFavorited, setIsFavorited] = useState(false);

  // ----- Fetch if already favorited -----
  useEffect(() => {
    const fetchFavorite = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("post_id", post.id)
        .maybeSingle();

      if (!error && data) setIsFavorited(true);
    };
    fetchFavorite();
  }, [user?.id, post.id]);

  // ----- Mutations -----
  const addFavoriteMutation = useMutation({
    mutationFn: async () =>
      insertFavorite(
        { post_id: post.id, user_id: user?.id, favorited: true },
        supabase
      ),
    onMutate: async () => {
      setIsFavorited(true); // optimistic update
    },
    onError: () => {
      Alert.alert("Error", "Failed to favorite post.");
      setIsFavorited(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const user_id = user?.id;
  const removeFavoriteMutation = useMutation({
    mutationFn: async () =>
      deleteFavorite(post.id, user_id as string, supabase),
    onMutate: async () => {
      setIsFavorited(false); 
    },
    onError: () => {
      Alert.alert("Error", "Failed to unfavorite post.");
      setIsFavorited(true);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const handleToggleFavorite = () => {
    if (!user?.id) {
      Alert.alert("Login required", "Please sign in to favorite posts.");
      return;
    }
    if (isFavorited) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  // ----- Display -----
  const createdAt = post.created_at ? new Date(post.created_at) : null;
  const timeAgo = createdAt
    ? formatDistanceToNow(createdAt, { addSuffix: true })
    : "";

  const description = post.description ?? "";
  const maxChars = 100;
  const shouldTruncate = description.length > maxChars;
  const displayText = expanded
    ? description
    : shouldTruncate
    ? description.slice(0, maxChars) + "..."
    : description;

  const handleOpenPost = () => router.push(`/(post)/${post.id}`);
  const handleOpenUser = () => {
    if (post.post_user?.id) router.push(`/(user)/${post.post_user.id}`);
  };

  return (
    <Card className="w-full p-0 overflow-hidden shadow-sm mb-2">
      <CardHeader className="px-0 pt-4 pb-0">
        <View className="flex-row justify-between items-center px-4">
          <TouchableOpacity
            onPress={handleOpenUser}
            className="flex-row items-center flex-shrink"
            activeOpacity={0.7}
          >
            {post.post_user?.avatar ? (
              <DownloadImage
                path={post.post_user.avatar}
                supabase={supabase}
                fallbackUri={avatarUrl}
                style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }}
              />
            ) : (
              <View className="w-9 h-9 rounded-full bg-gray-300 mr-3" />
            )}

            <View>
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {post.post_user
                  ? `${post.post_user.firstname ?? ""} ${post.post_user.lastname ?? ""}`.trim() ||
                    post.post_user.username
                  : "Unknown User"}{" "}
                ({post.post_user?.account_type})
              </Text>
              <Text className="text-xs text-gray-500">
                {timeAgo} · {createdAt ? format(createdAt, "MMM d, yyyy") : ""}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOpenPost} className="p-2">
            <AntDesign name="folderopen" size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        <CardTitle className="text-base px-4 mt-3">{post.title}</CardTitle>

        {description.length > 0 && (
          <View className="mt-1 px-4">
            <Text className="text-sm text-gray-800 dark:text-gray-100">
              {displayText}
            </Text>
            {shouldTruncate && (
              <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text className="text-xs text-blue-600 mt-1">
                  {expanded ? "See less" : "See more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </CardHeader>

      {post.image && (
        <CardContent className="px-0 mt-2">
          <TouchableOpacity onPress={() => setFullScreenImageVisible(true)}>
            <DownloadPostImages
              path={post.image}
              supabase={supabase}
              fallbackUri={avatarUrl}
              className="w-full h-52 rounded"
            />
          </TouchableOpacity>
        </CardContent>
      )}

      <Separator className="my-1" />

      {/* Favorite Button */}
      <CardFooter className="flex-row items-center justify-center px-4 pb-3">
        <TouchableOpacity
          onPress={handleToggleFavorite}
          className="flex-row items-center justify-center mb-3"
        >
          <Ionicons
            name={isFavorited ? "heart" : "heart-outline"}
            size={25}
            color={isFavorited ? "red" : "gray"}
          />
          <Text className="text-sm text-gray-700 dark:text-gray-300 ml-2">
            {isFavorited ? "Added to Favorites" : "Add to Favorites"}
          </Text>
        </TouchableOpacity>
      </CardFooter>

      {/* Fullscreen modal */}
      <Modal
        visible={fullScreenImageVisible}
        transparent
        onRequestClose={() => setFullScreenImageVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black justify-center items-center"
          onPress={() => setFullScreenImageVisible(false)}
          activeOpacity={1}
        >
          <DownloadPostImages
            path={post.image}
            supabase={supabase}
            fallbackUri={avatarUrl}
            className="w-full h-52 rounded"
          />
        </TouchableOpacity>
      </Modal>
    </Card>
  );
}
