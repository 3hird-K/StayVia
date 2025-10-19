import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useSupabase } from "@/lib/supabase";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";

export default function ChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // conversation_id
  const { user } = useUser();
  const supabase = useSupabase();

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;

    fetchConversation();
    fetchMessages();

    // Subscribe for live updates (new messages)
    const subscription = supabase
      .channel(`conversation-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${id}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Prevent duplicate messages
            if (prev.some((msg) => msg.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [id, user]);

  const fetchConversation = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching conversation:", error.message);
      return;
    }

    setConversation(data);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error.message);
    } else {
      setMessages(data || []);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!conversation) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Conversation not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: conversation?.title || "Chat",
          headerTitleAlign: "center",
        }}
      />

      <View className="flex-1 bg-white">
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    style={{ flex: 1 }}
    keyboardVerticalOffset={80}
  >
    <MessageList messages={messages} currentUserId={user?.id} />
    <MessageInput conversationId={id} />
  </KeyboardAvoidingView>
</View>

    </>
  );
}
