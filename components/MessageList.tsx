import React, { useRef, useEffect } from "react";
import { FlatList } from "react-native";
import MessageListItem from "./MessageListItem";

type MessageListProps = {
  messages: any[];
  currentUserId?: string;
};

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom when a new message is added
  useEffect(() => {
    if (messages?.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={({ item }) => (
        <MessageListItem message={item} isOwnMessage={item.sender_id === currentUserId} />
      )}
      // inverted 
      contentContainerStyle={{ padding: 16, flexGrow: 1, justifyContent: 'flex-end' }}
      showsVerticalScrollIndicator={false}
    />



  );
}
