import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";

type MessageListItemProps = {
  message: {
    id: string;
    sender_id?: string | null;
    content?: string | null;
    image?: string | null;
    created_at?: string | null;
  };
  isOwnMessage?: boolean;
};

export default function MessageListItem({
  message,
  isOwnMessage = false,
}: MessageListItemProps) {
  const [showTimestamp, setShowTimestamp] = useState(false);
  const hasImage = Boolean(message.image);
  const hasText = Boolean(message.content);

  const toggleTimestamp = () => {
    setShowTimestamp((prev) => !prev);
  };

  return (
    <Pressable
      onPress={toggleTimestamp}
      className={`flex-row mb-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <View
        className={`max-w-[75%] gap-1 ${isOwnMessage ? "items-end" : "items-start"}`}
      >
        {/* 🖼️ Image message */}
        {hasImage && message.image && (
          <Image
            source={{ uri: message.image }}
            className="w-48 h-48 rounded-2xl bg-gray-100"
          />
        )}

        {/* 💬 Text bubble */}
        {hasText && message.content && (
          <View
            className={`rounded-2xl px-4 py-2 ${
              isOwnMessage ? "bg-blue-500 rounded-br-md" : "bg-gray-200 rounded-bl-md"
            }`}
          >
            <Text className={`${isOwnMessage ? "text-white" : "text-neutral-900"}`}>
              {message.content}
            </Text>
          </View>
        )}

        {/* ⏱️ Timestamp (toggleable) */}
        {showTimestamp && message.created_at && (
          <Text className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
