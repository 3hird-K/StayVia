import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import FeatherIcon from "@expo/vector-icons/Feather";
import ScreenWrapper from "@/components/ScreenWrapper";

type Message = { id: string; text: string; fromUser: boolean };

export default function ChatScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input,
      fromUser: true,
    };
    setMessages((prev) => [newMsg, ...prev]);
    setInput("");
  };

  return (
    <ScreenWrapper>
      {/* <ScrollView className="px-3"> */}
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-white">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <FeatherIcon name="arrow-left" size={22} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-black flex-1">
              Chat with {userId}
            </Text>
          </View>

          {/* Messages */}
          {messages.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">No messages yet</Text>
            </View>
          ) : (
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  className={`m-2 p-3 rounded-2xl max-w-4/5 ${
                    item.fromUser
                      ? "bg-blue-500 self-end"
                      : "bg-gray-200 self-start"
                  }`}
                >
                  <Text className={item.fromUser ? "text-white" : "text-black"}>
                    {item.text}
                  </Text>
                </View>
              )}
              inverted
            />
          )}

          {/* Input */}
          <View className="flex-row items-center gap-2 p-2 border-t border-gray-200 bg-white">
            <TextInput
              className="flex-1 border border-gray-300 rounded-full px-4 py-2"
              placeholder="Type a message..."
              placeholderTextColor="#999"
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity
              onPress={sendMessage}
              className="bg-blue-500 p-3 rounded-full"
            >
              <Text className="text-white font-bold">➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      {/* </ScrollView> */}
    </ScreenWrapper>
    
  );
}
