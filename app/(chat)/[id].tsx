import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useRef,  } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  useColorScheme,
//   SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import users from "@/assets/data/users.json";

type Message = {
  id: string;
  text?: string;
  imageUri?: string;
  fromUser: boolean;
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const user = users.find((u) => u.id === id );

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const sendMessage = (msg: Partial<Message>) => {
    const newMsg: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      fromUser: true,
      ...msg,
    };
    setMessages((prev) => [newMsg, ...prev]);
    setInput("");
    Keyboard.dismiss();
    setTimeout(
      () => flatListRef.current?.scrollToOffset({ offset: 0, animated: true }),
      100
    );
  };

  const handleSendText = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      sendMessage({ imageUri: result.assets[0].uri });
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      result.assets.forEach((asset) => sendMessage({ imageUri: asset.uri }));
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#f5f5f5" }}
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#333" : "#ddd",
            backgroundColor: isDark ? "#1f1f1f" : "#ffffff",
          }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={22} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Image
            source={{ uri: user?.avatar }}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8 }}
          />
          <Text style={{ fontSize: 18, fontWeight: "600", color: isDark ? "#fff" : "#000" }}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={{ paddingTop: 2, paddingBottom: 10 }}
          renderItem={({ item }) => (
            <View
              style={{
                alignSelf: item.fromUser ? "flex-end" : "flex-start",
                marginVertical: 4,
                maxWidth: "75%",
                gap: 6,
              }}
            >
              {/* Text bubble */}
              {item.text && (
                <View
                  style={{
                    backgroundColor: item.fromUser
                      ? "#2563EB"
                      : isDark
                      ? "#1f1f1f"
                      : "#e5e7eb",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ color: item.fromUser ? "#fff" : isDark ? "#fff" : "#000" }}>
                    {item.text}
                  </Text>
                </View>
              )}

              {/* Image bubble */}
              {item.imageUri && (
                <TouchableOpacity
                  onPress={() => setPreviewImage(item.imageUri ?? null)}
                  style={{
                    backgroundColor: item.fromUser
                      ? "rgba(37,99,235,0.1)"
                      : isDark
                      ? "#2c2c2c"
                      : "#f3f4f6",
                    padding: 4,
                    borderRadius: 12,
                  }}
                >
                  <Image
                    source={{ uri: item.imageUri }}
                    style={{
                      width: 180,
                      height: 120,
                      borderRadius: 8,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        />

        {/* Input */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderTopWidth: 1,
            borderTopColor: isDark ? "#333" : "#ddd",
            backgroundColor: isDark ? "#1f1f1f" : "#ffffff",
          }}
        >
          <TouchableOpacity onPress={openCamera} style={{ padding: 6 }}>
            <Ionicons name="camera" size={22} color={isDark ? "#fff" : "gray"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openGallery} style={{ padding: 6 }}>
            <Ionicons name="image" size={22} color={isDark ? "#fff" : "blue"} />
          </TouchableOpacity>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: isDark ? "#333" : "#ccc",
              borderRadius: 999,
              paddingHorizontal: 16,
              paddingVertical: Platform.OS === "ios" ? 10 : 6,
              color: isDark ? "#fff" : "#000",
              marginHorizontal: 6,
              marginBottom: 10,
              backgroundColor: isDark ? "#2c2c2c" : "#f2f2f2",
            }}
            placeholder="Type a message..."
            placeholderTextColor={isDark ? "#aaa" : "#888"}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity
            onPress={handleSendText}
            style={{
              padding: 8,
              borderRadius: 999,
              backgroundColor: "#2563EB",
            }}
          >
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Image Preview Modal */}
        <Modal visible={!!previewImage} transparent animationType="fade">
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.9)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setPreviewImage(null)}
          >
            {previewImage && (
              <Image
                source={{ uri: previewImage }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            )}
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
