import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import users from "@/assets/data/users.json"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { THEME, type ThemeColors } from "@/lib/theme";

export default function ChatIndex() {
  const router = useRouter();
  const systemScheme = useColorScheme();
  const effectiveTheme: "light" | "dark" = systemScheme === "dark" ? "dark" : "light";
  const theme: ThemeColors = THEME[effectiveTheme];

  const [search, setSearch] = useState("");
  const [activeFriends] = useState(users.filter((u) => u.online));
  const [chats] = useState(users);

  const filteredChats = chats.filter(
    (chat) =>
      chat.firstName.toLowerCase().includes(search.toLowerCase()) ||
      chat.lastName.toLowerCase().includes(search.toLowerCase()) ||
      chat.username.toLowerCase().includes(search.toLowerCase()) ||
      (chat.lastMessage && chat.lastMessage.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View style={{ backgroundColor: theme.card, paddingVertical: 16, paddingHorizontal: 16 }}>
        <Text style={{ color: theme.foreground, fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
          Stavia Chats
        </Text>
      </View>

      {/* Search Bar */}
      <View style={{ backgroundColor: theme.card, padding: 8, paddingHorizontal: 16 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search for conversation"
          placeholderTextColor={theme.mutedForeground}
          style={{
            backgroundColor: theme.input ?? (effectiveTheme === "dark" ? "#27272a" : "#E5E7EB"),
            color: theme.foreground,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 9999,
          }}
        />
      </View>

      {/* Active Friends */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ backgroundColor: theme.card, paddingHorizontal: 16, paddingVertical: 12}}
      >
        {activeFriends.map((friend) => (
          <View key={friend.id} style={{ marginRight: 16, alignItems: "center", }}>
            <Image
              source={{ uri: friend.avatar }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                borderWidth: 2,
                borderColor: "#3B82F6",
              }}
            />
            <Text style={{ color: theme.foreground, fontSize: 12, textAlign: "center" }}>
              {friend.firstName}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={{ paddingBottom: 16, marginTop: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/(chat)/${item.id}`)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: theme.border,
            }}
          >
            <View>
              <Image
                source={{ uri: item.avatar }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
              />
              {item.online && (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#34D399",
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    borderWidth: 1,
                    borderColor: theme.card,
                  }}
                />
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: theme.foreground, fontWeight: "600" }}>
                {item.firstName} {item.lastName}
              </Text>
              {item.lastMessage && (
                <Text style={{ color: theme.mutedForeground, fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">
                  {item.lastMessage}
                </Text>
              )}
            </View>
            <Text style={{ color: theme.mutedForeground, fontSize: 10, marginLeft: 8 }}>
              {item.time}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
