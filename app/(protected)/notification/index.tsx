import { View, Text, FlatList, TouchableOpacity, Image, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { useSupabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { fetchAllRequestsByPostId } from "@/services/requestService";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

export default function NotificationIndex() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useUser();
  const supabase = useSupabase();

  const [notifications, setNotifications] = useState<
    { id: string; title: string; avatar: string; time: string }[]
  >([]);

  // Fetch posts of current user
  const { data: myPosts = [] } = useQuery({
    queryKey: ["myPosts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  console.log(myPosts)

  // Fetch requests for each post
  const { data: requests = [] } = useQuery({
    queryKey: ["requestsForMyPosts", myPosts.map((p) => p.id)],
    queryFn: async () => {
      if (!myPosts.length) return [];
      const allRequests: typeof notifications = [];

      for (const post of myPosts) {
        const reqs = await fetchAllRequestsByPostId(post.id, supabase);
        reqs.forEach((r: any) => {
          if (r.user_id && r.post) {
            allRequests.push({
              id: r.id,
              title: `${r.user?.firstname} requested your post "${r.post.title}"`,
              avatar: r.user?.avatar_url || "https://i.pravatar.cc/100",
              time: formatDistanceToNow(new Date(r.created_at), { addSuffix: true }),
            });
          }
        });
      }

      return allRequests;
    },
    enabled: !!myPosts.length,
  });




  useEffect(() => {
    if (requests) {
      setNotifications(requests);
    }
  }, [requests]);

  const renderNotification = ({ item }: { item: typeof notifications[0] }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: isDark ? "#1f1f1f" : "#ffffff",
      }}
      onPress={() => router.push(`/home/post/${item.id}`)}
    >
      <Image
        source={{ uri: item.avatar }}
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          marginRight: 12,
          borderWidth: 1,
          borderColor: isDark ? "#333" : "#ddd",
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ color: isDark ? "#fff" : "#000", fontWeight: "500" }}>{item.title}</Text>
        <Text style={{ color: isDark ? "#aaa" : "#555", fontSize: 12, marginTop: 2 }}>
          {item.time}
        </Text>
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
        <Text
          style={{
            color: isDark ? "#fff" : "#000",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
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
