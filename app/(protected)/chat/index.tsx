// import { FlatList, View, Text, useColorScheme } from 'react-native';
// import channels from '@/data/channels';
// import ChannelListItem from '@/components/ChannelListItem';

// export default function ChannelListScreen() {
//   return (
    
//       <FlatList
//         data={channels}
//         className='bg-white'
//         renderItem={({ item }) => <ChannelListItem channel={item} />}
//         showsVerticalScrollIndicator={false}
//         contentInsetAdjustmentBehavior='automatic'
//       />
    
//   );
// }

import React from "react";
import { FlatList, View, Text, ActivityIndicator } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useSupabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import ChannelListItem from "@/components/ChannelListItem";
import { Database } from "@/types/database.types";

type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
type ConversationParticipant = Database["public"]["Tables"]["conversation_participants"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

// 🔹 Fetch all conversations for the logged-in user
async function getUserConversations(
  supabase: ReturnType<typeof useSupabase>,
  userId: string
) {
  const { data, error } = await supabase
    .from("conversation_participants")
    .select(
      `
      conversation_id,
      conversations!inner(id, created_at),
      user_id,
      users!conversation_participants_user_id_fkey(id, firstname, lastname, avatar)
    `
    )
    .eq("user_id", userId);

  if (error) throw error;

  // Map to show other user in the conversation
  const conversationIds = data.map((p) => p.conversation_id);

  if (conversationIds.length === 0) return [];

  const { data: allParticipants, error: partError } = await supabase
    .from("conversation_participants")
    .select(
      `
      conversation_id,
      user_id,
      users!conversation_participants_user_id_fkey(id, firstname, lastname, avatar)
    `
    )
    .in("conversation_id", conversationIds);

  if (partError) throw partError;

  // Group conversations and find the other user for each
  const grouped = conversationIds.map((convId) => {
    const participants = allParticipants.filter((p) => p.conversation_id === convId);
    const other = participants.find((p) => p.user_id !== userId)?.users;
    return {
      id: convId,
      otherUser: other,
    };
  });

  return grouped;
}

export default function ChannelListScreen() {
  const { user } = useUser();
  const supabase = useSupabase();

  const {
    data: conversations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: () => getUserConversations(supabase, user!.id),
    enabled: !!user?.id,
  });

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Error loading conversations</Text>
      </View>
    );

  if (!conversations?.length)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>No conversations yet</Text>
      </View>
    );

  return (
    <FlatList
      data={conversations}
      className="bg-white"
      keyExtractor={(item) => item.id ?? ""}
      renderItem={({ item }) => (
        <ChannelListItem
          channel={{
            id: item.id as string,
            name: `${item.otherUser?.firstname ?? ""} ${item.otherUser?.lastname ?? ""}`,
            avatar: item.otherUser?.avatar ?? "",
          }}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    />
  );
}
