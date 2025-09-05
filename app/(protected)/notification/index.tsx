import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function NotificationIndex() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"chats" | "notifications">("chats");

  // Sample notifications
  const [notifications] = useState([
    { id: "n1", title: "New Comment", description: "Neil commented on your post.", time: "5m" },
    { id: "n2", title: "New Follower", description: "Jessa started following you.", time: "1h" },
    { id: "n3", title: "Mentioned You", description: "Jazel mentioned you in a comment.", time: "2h" },
  ]);

   // Sample chats
  const [chats] = useState([
    { id: "1", name: "Harvey Babia", avatar: "https://i.pravatar.cc/100?img=1", lastMessage: "You sent a photo.", time: "1m" },
    { id: "2", name: "Jessa Orobia", avatar: "https://i.pravatar.cc/100?img=19", lastMessage: "Jessa: para walay problema pud.", time: "1h" },
    { id: "3", name: "Jazel Achas", avatar: "https://i.pravatar.cc/100?img=5", lastMessage: "Jazel: Hi guys...", time: "2h" },
    { id: "4", name: "Dan Adrian", avatar: "https://i.pravatar.cc/100?img=3", lastMessage: "Dan: Kumusta kuys...", time: "3days ago" },
    { id: "5", name: "Rembrundt Almonia", avatar: "https://i.pravatar.cc/100?img=9", lastMessage: "Almonia: Brother...", time: "1w" },
  ]);

  return (
    <ScreenWrapper>
      {/* <ScrollView className="px-3 bg-white"> */}
        {/* Header */}
        <View className="px-4 py-6">
          <Text className="text-black text-xl text-center font-bold">Notifications & Chats</Text>
        </View>

        {/* Toggle */}
        <View className="flex-row justify-center bg-gray-200 rounded-full mx-4 mb-4">
          <TouchableOpacity
            onPress={() => setActiveTab("chats")}
            className={`flex-1 py-2 rounded-l-full items-center ${
              activeTab === "chats" ? "bg-blue-500" : ""
            }`}
          >
            <Text className={activeTab === "chats" ? "text-white font-semibold" : "text-gray-700"}>
              Chats
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("notifications")}
            className={`flex-1 py-2 rounded-r-full items-center ${
              activeTab === "notifications" ? "bg-blue-500" : ""
            }`}
          >
            <Text
              className={activeTab === "notifications" ? "text-white font-semibold" : "text-gray-700"}
            >
              Notifications
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === "chats" ? (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/(protected)/notification/Chat/${item.id}`)}
                className="flex-row items-center px-3 py-2 border-b border-gray-200"
              >
                <Image source={{ uri: item.avatar }} className="w-12 h-12 rounded-full mr-3" />
                <View className="flex-1">
                  <Text className="text-black font-semibold">{item.name}</Text>
                  <Text className="text-gray-600" numberOfLines={1} ellipsizeMode="tail">
                    {item.lastMessage}
                  </Text>
                </View>
                <Text className="text-gray-400 text-xs ml-2">{item.time}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View className="px-4 mb-4">
            {notifications.length === 0 ? (
              <Text className="text-gray-500">No notifications</Text>
            ) : (
              notifications.map((item) => (
                <View
                  key={item.id}
                  className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-lg mb-2"
                >
                  <Text className="font-semibold text-black">{item.title}</Text>
                  <Text className="text-gray-600">{item.description}</Text>
                  <Text className="text-gray-400 text-xs mt-1">{item.time}</Text>
                </View>
              ))
            )}
          </View>
        )}
      {/* </ScrollView> */}
    </ScreenWrapper>
  );
}
