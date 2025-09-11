import { View, Text, FlatList, TouchableOpacity, Image, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function NotificationIndex() {
  const router = useRouter();
  const colorScheme = useColorScheme(); // Detect system theme
  const isDark = colorScheme === "dark";

  const [notifications] = useState([
    { id: "1", title: "Jenna commented on your post", avatar: "https://i.pinimg.com/736x/df/10/11/df1011d5f96b0a5a79e6a627fbddfeb9.jpg", time: "5m" },
    { id: "2", title: "Emma started following you", avatar: "https://statico.soapcentral.com/editor/2025/08/25aab-17548184387776.jpg", time: "1h" },
    { id: "3", title: "Thing mentioned you in a comment", avatar: "https://static.wikia.nocookie.net/p__/images/4/41/Thing_%28Wednesday_2022%29.png/revision/latest?cb=20230221044832&path-prefix=protagonist", time: "2h" },
    { id: "4", title: "Agnes liked your post", avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNgA6K2M7WDTsHz7M-G6ScAodPTtg5d_pNOw&sE", time: "4h" },
    { id: "5", title: "John shared your photo", avatar: "https://i.pravatar.cc/100?img=11", time: "10m" },
  ]);

  const renderNotification = ({ item }: { item: typeof notifications[0] }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: isDark ? "#1f1f1f" : "#ffffff",
      }}
      onPress={() => router.push(`/(protected)/home`)}
    >
      <Image
        source={{ uri: item.avatar }}
        style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12, borderWidth: 1, borderColor: isDark ? "#333" : "#ddd" }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ color: isDark ? "#fff" : "#000", fontWeight: "500" }}>{item.title}</Text>
        <Text style={{ color: isDark ? "#aaa" : "#555", fontSize: 12, marginTop: 2 }}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#f5f5f5" }}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: isDark ? "#1f1f1f" : "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333" : "#ddd",
          paddingVertical: 16,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
          Notifications
        </Text>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: isDark ? "#333" : "#ddd", marginHorizontal: 12 }} />
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </SafeAreaView>
  );
}
