import { View, Text, FlatList, useColorScheme, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { useSupabase } from "@/lib/supabase";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import DownloadImage from "@/components/download/downloadImage";
import { getOrCreateConversation } from "@/services/conversationService";
import { deleteRequest, fetchAllRequests, fetchApprovedRequestsByUser, updateRequest } from "@/services/requestService";
import { useRouter } from "expo-router";
import { AlertDialog } from "@/components/ui/alert-dialog";

export default function NotificationIndex() {
  const router = useRouter();
  const { user } = useUser();
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const defaultAvatar = "https://i.pravatar.cc/150";
  const avatarUrl = !user?.imageUrl || user.imageUrl.includes("clerk.dev/static") ? defaultAvatar : user.imageUrl;

  // ------------------ Fetch Posts & Requests ------------------
  const { data: myPosts = [] } = useQuery({
    queryKey: ["myPosts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from("posts").select("*").eq("user_id", user.id);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const postIds = useMemo(() => myPosts.map((p) => p.id), [myPosts]);

  const { data: postOwnerRequests = [] } = useQuery({
    queryKey: ["requests", postIds],
    queryFn: async () => (postIds.length ? fetchAllRequests(postIds, supabase) : []),
    enabled: !!postIds.length,
  });

  const { data: myApprovedRequests = [] } = useQuery({
    queryKey: ["approvedRequests", user?.id],
    queryFn: async () => (user ? fetchApprovedRequestsByUser(user.id, supabase) : []),
    enabled: !!user,
  });

  const requests = useMemo(() => [...postOwnerRequests, ...myApprovedRequests], [postOwnerRequests, myApprovedRequests]);

  // ------------------ Mutations ------------------
  const { mutate: startChat } = useMutation({
    mutationFn: (selectedUser: any) => getOrCreateConversation(supabase, user!.id, selectedUser.id),
    onSuccess: (conversation, selectedUser: any) => {
      router.push(`/(channel)/${conversation.id}?name=${selectedUser.firstname}&avatar=${selectedUser.avatar ?? ""}`);
    },
    onError: (error: any) => Alert.alert("Error", "Failed to start chat."),
  });

  const deleteNotifMutation = useMutation({
    mutationFn: async () => {
      if (!selectedRequestId) throw new Error("No request selected");
      return deleteRequest(selectedRequestId, supabase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["approvedRequests"] });
      setConfirmVisible(false);
      setSelectedRequestId(null);
    },
  });

  const approveRequestMutation = useMutation({
    mutationFn: async (requestId: string) => updateRequest(requestId, supabase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["approvedRequests"] });
    },
  });

  const handleApprove = (id: string) => approveRequestMutation.mutate(id);
  const handleDelete = (id: string) => { setSelectedRequestId(id); setConfirmVisible(true); };
  const confirmDelete = () => deleteNotifMutation.mutate();
  const handleOpenPost = (id: string) => router.push(`/(post)/${id}`);

  // ------------------ Render Notification ------------------
  const renderNotification = ({ item }: any) => {
    const isPostOwner = item.post.user_id === user?.id;
    const isRequestOwner = item.user.id === user?.id;

    return (
      <TouchableOpacity onPress={() => handleOpenPost(item.postId)} activeOpacity={0.8}>
        <View style={{
          flexDirection: "row",
          alignItems: "flex-start",
          padding: 12,
          marginHorizontal: 12,
          marginVertical: 6,
          borderRadius: 12,
          backgroundColor: isDark ? "#1f1f1f" : "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <DownloadImage
            path={item.avatar}
            supabase={supabase}
            fallbackUri={avatarUrl}
            style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
          />

          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "600", fontSize: 14, color: isDark ? "#fff" : "#000" }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 12, color: isDark ? "#aaa" : "#555", marginTop: 2 }}>
              {item.time}
            </Text>

            {item.requested && isRequestOwner && (
              <View style={{
                marginTop: 4,
                backgroundColor: "#4caf50",
                alignSelf: "flex-start",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
              }}>
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "500" }}>Approved</Text>
              </View>
            )}

            {isPostOwner && (
              <View style={{ flexDirection: "row", marginTop: 6, gap: 8 }}>
                {!item.requested && 
                  <TouchableOpacity
                    onPress={() => handleApprove(item.id)}
                    style={{
                      backgroundColor: "#007bff",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "500" }}>Approve</Text>
                  </TouchableOpacity>
                }
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={{
                    backgroundColor: "#e53935",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 12, fontWeight: "500" }}>Disapprove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => startChat(item.user)}
                  style={{
                    backgroundColor: "#6c757d",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 12, fontWeight: "500" }}>Message</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#f5f5f5" }} edges={["top", "left", "right"]}>
      <View style={{
        backgroundColor: isDark ? "#1f1f1f" : "#fff",
        borderBottomWidth: 1,
        borderBottomColor: isDark ? "#333" : "#ddd",
        paddingVertical: 16,
        paddingHorizontal: 16,
      }}>
        <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
          Notifications
        </Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      <AlertDialog
        visible={confirmVisible}
        title="Delete Request"
        message="Are you sure you want to disapprove this request?"
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}
