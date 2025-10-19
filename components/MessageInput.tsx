import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";
import { useSupabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/services/conversationService";

type MessageInputProps = {
  conversationId: string;
};

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const { user } = useUser();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  // 📨 Send message mutation
  const { mutate: handleSend, isPending: sending } = useMutation({
    mutationFn: async () => {
      if (!user?.id || (!message.trim() && !image)) return;

      await sendMessage(
        supabase,
        conversationId,
        user.id,
        message.trim(),
        image || null
      );

      setMessage("");
      setImage(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });

  // 📸 Pick image from library
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const isMessageEmpty = !message.trim() && !image;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <SafeAreaView
        edges={["bottom"]}
        className="p-4 gap-4 bg-white border-t border-gray-200 "
      >
        {image && (
          <View className="w-32 h-32 relative">
            <Image
              source={{ uri: image }}
              className="w-full h-full rounded-2xl"
            />
            <Pressable
              onPress={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-gray-100 w-6 h-6 items-center justify-center rounded-full"
            >
              <Ionicons name="close" size={14} color="dimgray" />
            </Pressable>
          </View>
        )}

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={pickImage}
            className="bg-gray-200 rounded-full p-2 w-10 h-10 items-center justify-center"
          >
            <Ionicons name="image" size={20} color="#6B7280" />
          </Pressable>

          <TextInput
            placeholder="Type something..."
            value={message}
            onChangeText={setMessage}
            multiline
            className="bg-gray-100 flex-1 rounded-3xl px-4 py-3 text-gray-900 text-base max-h-[120px]"
          />

          <Pressable
            onPress={() => handleSend()}
            disabled={isMessageEmpty || sending}
            className={`rounded-full p-2 w-10 h-10 items-center justify-center ${
              isMessageEmpty || sending ? "bg-gray-200" : "bg-blue-500"
            }`}
          >
            <Ionicons
              name="send"
              size={20}
              color={isMessageEmpty || sending ? "#9CA3AF" : "#FFFFFF"}
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
