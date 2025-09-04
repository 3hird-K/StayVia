import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function UserList() {
  const router = useRouter();

  const [chats, setChats] = useState([
    {
      id: "1",
      name: "Neil Dime",
      avatar: "https://i.pravatar.cc/100?img=1",
      lastMessage: "You sent a photo.",
      time: "1m",
    },
    {
      id: "2",
      name: "IT3R1-IT313 MOBILE PROGRAMMING",
      avatar: "https://i.pravatar.cc/100?img=2",
      lastMessage: "Dario: para walay problema pud.",
      time: "1h",
    },
    {
      id: "3",
      name: "[3R1] IT314 - Software Engineering",
      avatar: "https://i.pravatar.cc/100?img=3",
      lastMessage: "Ms. Jc Vanny Mill Tong: Hi guys...",
      time: "2h",
    },
  ]);

  return (
    <ScreenWrapper>
      <ScrollView className="px-3">
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="p-4">
            <Text className="text-black text-xl font-bold">Chats</Text>
          </View>

          {/* Search bar */}
          <View className="mx-4 mb-2 bg-gray-100 rounded-full px-3 py-2">
            <Text className="text-gray-500">Search Messenger</Text>
          </View>

          {/* Chat list OR empty state */}
          {chats.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500 text-base">No messages yet</Text>
            </View>
          ) : (
            <FlatList
              data={chats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/(protected)/notification/Chat/ChatScreen?id=${item.id}`)}
                  className="flex-row items-center px-4 py-3 border-b border-gray-200"
                >
                  <Image
                    source={{ uri: item.avatar }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <Text className="text-black font-semibold">{item.name}</Text>
                    <Text
                      className="text-gray-600"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.lastMessage}
                    </Text>
                  </View>
                  <Text className="text-gray-400 text-xs ml-2">{item.time}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
    
  );
}
