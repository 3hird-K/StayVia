import { Channel } from "@/types";
import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import DownloadImage from "./download/downloadImage";
import { useSupabase } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";

type ChannelListItemProps = {
  channel: Channel;
}; 

export default function ChannelListItem({ channel }: ChannelListItemProps) {
  const supabase = useSupabase();
  const { user } = useUser();
  const defaultAvatar = "https://i.pravatar.cc/150";

  const [lastMessage, setLastMessage] = useState<{
    content: string | null;
    created_at: string | null;
  } | null>(null);

  const avatarUrl =
    !user?.imageUrl || user?.imageUrl.includes("clerk.dev/static")
      ? defaultAvatar
      : user?.imageUrl;

  // Fetch last message
  useEffect(() => {
    const fetchLastMessage = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", channel.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setLastMessage({
          content: data.content,
          created_at: data.created_at,
        });
      }
    };

    fetchLastMessage();
  }, [channel.id, supabase]);

  return (
    <Link
      href={{
        pathname: "/(channel)/[id]",
        params: { id: channel.id, channelData: JSON.stringify(channel) },
      }}
      asChild
    >
      <Pressable className="flex-row gap-3 p-4 border-b border-gray-200 items-center">
        {/* Avatar */}
        <DownloadImage
          path={channel.avatar}
          supabase={supabase}
          fallbackUri={defaultAvatar}
          style={{ width: 50, height: 50, borderRadius: 50, marginRight: 12 }}
        />

        {/* Name & last message */}
        <View className="flex-1">
          <Text className="font-bold text-lg text-neutral-700" numberOfLines={1}>
            {channel.name || "Unknown User"}
          </Text>

          <Text className="text-sm text-gray-500" numberOfLines={1}>
            {lastMessage?.content ?? "No messages yet"}
          </Text>
        </View>

        {/* Last message time */}
        {lastMessage?.created_at && (
          <Text className="text-xs text-neutral-500">
            {formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true })}
          </Text>
        )}
      </Pressable>
    </Link>
  );
}
