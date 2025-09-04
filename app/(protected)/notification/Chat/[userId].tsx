import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import FeatherIcon from "@expo/vector-icons/Feather";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import ScreenWrapper from "@/components/ScreenWrapper";

type Message = {
  id: string;
  text?: string;
  fileName?: string;
  fileUri?: string;
  imageUri?: string;
  videoUri?: string;
  fromUser: boolean;
};

export default function ChatScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = (msg: Partial<Message>) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      fromUser: true,
      ...msg,
    };
    setMessages((prev) => [newMsg, ...prev]);
    setInput("");
  };

  const handleSendText = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
  };

  const attachFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      sendMessage({ fileName: asset.name, fileUri: asset.uri });
    }
  };

  const attachImageOrVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // allows images + videos
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset.type === "image") {
        sendMessage({ imageUri: asset.uri });
      } else if (asset.type === "video") {
        sendMessage({ videoUri: asset.uri });
      }
    }
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
              {/* Text */}
              {item.text && (
                <Text className={item.fromUser ? "text-white" : "text-black"}>
                  {item.text}
                </Text>
              )}

              {/* Image */}
              {item.imageUri && (
                <Image
                  source={{ uri: item.imageUri }}
                  className="w-40 h-40 rounded-lg mt-2"
                />
              )}

              {/* Video (placeholder since RN doesn’t natively play video without extra lib) */}
              {item.videoUri && (
                <Text
                  className={`mt-2 underline ${
                    item.fromUser ? "text-white" : "text-blue-600"
                  }`}
                >
                  [Video attached]
                </Text>
              )}

              {/* File */}
              {item.fileName && (
                <Text
                  className={`mt-2 underline ${
                    item.fromUser ? "text-white" : "text-blue-600"
                  }`}
                >
                  📎 {item.fileName}
                </Text>
              )}
            </View>
          )}
          inverted
        />
      )}

      {/* Input */}
      <View className="flex-row items-center gap-2 p-2 border-t border-gray-200 bg-white">
        <TouchableOpacity onPress={attachFile} className="p-2">
          <FeatherIcon name="paperclip" size={22} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={attachImageOrVideo} className="p-2">
          <FeatherIcon name="image" size={22} color="red" />
        </TouchableOpacity>
        <TextInput
          className="flex-1 border border-gray-300 rounded-full px-4 py-2"
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          onPress={handleSendText}
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
