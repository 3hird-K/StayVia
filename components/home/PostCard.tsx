import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  GestureResponderEvent,
} from "react-native";
import { Text } from "@/components/ui/text";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Separator } from "../ui/separator";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Database } from "@/types/database.types";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import DownloadImage from "../download/downloadImage";
import { useSupabase } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import { SupabaseClient } from "@supabase/supabase-js";
import DownloadPostImages from "../download/downloadPostImages";

type PostWithUser = Database["public"]["Tables"]["posts"]["Row"] & {
  post_user: Database["public"]["Tables"]["users"]["Row"] | null;
};

type PostCardProps = { post: PostWithUser };

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [fullScreenImageVisible, setFullScreenImageVisible] = useState(false);
  const [image, setImage] = useState<string | undefined>();
  const {user} = useUser();

  const maxChars = 100;
  const description = post.description ?? "";
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

  const createdAt = post.created_at ? new Date(post.created_at) : null;
  const timeAgo = createdAt
    ? formatDistanceToNow(createdAt, { addSuffix: true })
    : "";

  const postUser = post.post_user;
     const defaultAvatar = "https://i.pravatar.cc/150";
      const avatarUrl =
        !user?.imageUrl || user.imageUrl.includes("clerk.dev/static")
          ? defaultAvatar
          : user.imageUrl;
    const supabase = useSupabase();


  return (
    <Card className="w-full p-0 overflow-hidden shadow-sm mb-2">
      <CardHeader className="px-0 pt-4 pb-0">
        {/* User info header */}
        <View className="flex-row justify-between items-center px-4">
          <TouchableOpacity
            onPress={handleOpenUser}
            className="flex-row items-center flex-shrink"
            activeOpacity={0.7}
          >
            {postUser?.avatar ? (
              <DownloadImage
                path={postUser?.avatar}
                supabase={supabase}
                fallbackUri={avatarUrl}
                style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }}
              />

            ) : (
              <View className="w-9 h-9 rounded-full bg-gray-300 mr-3" />
            )}

            <View>
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {postUser
                  ? postUser.firstname || postUser.lastname
                    ? `${postUser.firstname ?? ""} ${postUser.lastname ?? ""}`.trim()
                    : postUser.username
                  : "Unknown User"} {`(${postUser?.account_type})`}
              </Text>
              <Text className="text-xs text-gray-500">
                {timeAgo} · {createdAt ? format(createdAt, "MMM d, yyyy") : ""}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Open post icon */}
          <TouchableOpacity onPress={handleOpenPost} className="p-2">
            <AntDesign name="folderopen" size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* Title & description */}
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

      {/* Image */}
        {post.image && (
      <CardContent className="px-0 mt-2">
          <TouchableOpacity onPress={() => setFullScreenImageVisible(true)}>
             <DownloadPostImages
                path={post?.image}
                supabase={supabase}
                fallbackUri={avatarUrl}
                className="w-full h-52 rounded"
              />
          </TouchableOpacity>
      </CardContent>
        )}

      <Separator className="my-1" />

      <CardFooter className="flex-row items-center justify-center px-4 pb-3">
        <TouchableOpacity onPress={()=>{}} className="flex-row items-center justify-center mb-3">
          {/* <MessageCircle size={18} color="black" /> */}
          <Ionicons name="heart-outline" size={25}  /> 
          <Text className="text-sm text-gray-700 dark:text-gray-300 ml-2">Add to Favorites</Text>
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
                path={post?.image}
                supabase={supabase}
                fallbackUri={avatarUrl}
                className="w-full h-52 rounded"
              />
        </TouchableOpacity>
      </Modal>
    </Card>
  );
}
