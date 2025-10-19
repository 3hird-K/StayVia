import { Channel } from "@/types";
import { View, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import DownloadImage from "./download/downloadImage";
import { useSupabase } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";

type ChannelListItemProps = {
  channel: Channel;
};

export default function ChannelListItem({ channel }: ChannelListItemProps) {

  const supabase = useSupabase();
  const {user} = useUser();
  const defaultAvatar = "https://i.pravatar.cc/150";
  const avatarUrl =
    !user?.imageUrl || user?.imageUrl.includes("clerk.dev/static")
      ? defaultAvatar
      : user?.imageUrl;

  return (
    <Link href={`/(channel)/${channel.id}`} asChild>
      <Pressable className="flex-row gap-3 p-4 border-b border-gray-200 items-center">
        {/* Avatar */}
        {/* <Image
          source={{ uri: channel.avatar ?? "https://placehold.co/100x100" }}
          className="w-12 h-12 rounded-full bg-gray-200"
        /> */}
        <DownloadImage
          path={channel.avatar}
          supabase={supabase}
          fallbackUri={defaultAvatar}
          style={{ width: 50, height: 50, borderRadius: 50, marginRight: 12 }}
        />

        {/* Name & last message */}
        <View className="flex-1">
          <Text
            className="font-bold text-lg text-neutral-700"
            numberOfLines={1}
          >
            {channel.name || "Unknown User"}
          </Text>

          <Text className="text-sm text-gray-500" numberOfLines={1}>
            {channel.lastMessage?.content ?? "No messages yet"}
          </Text>
        </View>

        {/* Last message time */}
        {channel.lastMessage?.created_at && (
          <Text className="text-xs text-neutral-500">
            {formatDistanceToNow(new Date(channel.lastMessage.created_at), {
              addSuffix: true,
            })}
          </Text>
        )}
      </Pressable>
    </Link>
  );
}
