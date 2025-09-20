// import React, { useEffect, useState } from "react";
// import { View, Image, TouchableOpacity, Modal } from "react-native";
// import { Text } from "@/components/ui/text";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Heart, MessageCircle } from "lucide-react-native";
// import { toggleFavorite, isFavorite } from "@/utils/favorites";
// import { useRouter } from "expo-router";
// // import { Post } from "@/utils/types";
// import { Tables } from "../../types/database.types"; 
// import { Separator } from "../ui/separator";
// import { AntDesign, Ionicons } from "@expo/vector-icons";

// type Post = Tables<"posts"> & {
//   user: Tables<"users"> | null;
//   image?: string | null;
//   description?: string | null;
// };

// type PostCardProps = {
//   post: Post;
//   // onFavoriteChange?: (postId: number, favorited: boolean) => void;
// };

// export function PostCard({ post }: PostCardProps) {
//   const router = useRouter();
//   // const [favorited, setFavorited] = useState(false);
//   // const [voteCount, setVoteCount] = useState<number>(post.upvotes ?? 0);
//   // const [commentsCount, setCommentsCount] = useState<number>(post.reviews ?? 0);

//   const [expanded, setExpanded] = useState(false);
//   const [fullScreenImageVisible, setFullScreenImageVisible] = useState(false); // new
//   const maxChars = 100;

//   const description = post.description ?? "";
//   const shouldTruncate = description.length > maxChars;
//   const displayText = expanded
//     ? description
//     : shouldTruncate
//     ? description.slice(0, maxChars) + "..."
//     : description;

//   // useEffect(() => {
//   //   if (post.id) {
//   //     isFavorite(post.id).then(setFavorited);
//   //   }
//   // }, [post.id]);

//   // const handleFavorite = async () => {
//   //   const result = await toggleFavorite(post.id);
//   //   setFavorited(result);
//   //   // setVoteCount((prev) => (result ? prev + 1 : Math.max(prev - 1, 0)));
//   //   onFavoriteChange?.(post.id, result);
//   // };

//   const handleComments = () => router.push(`/home/comment/${post.id}`);
//   const handleOpenPost = () => router.push(`/home/post/${post.id}`);
//   const handleOpenuser = () => router.push(`/(user)/${post.user?.id}`);

//   return (
//     <Card className="w-full p-0 overflow-hidden shadow-sm mb-2 px-2">
//       <CardHeader className="px-2 pt-4 pb-[-10]">
//         {/* User info + title + description */}
//         {/* <View className="flex-row items-center justify-between">
//           <View className="flex-row items-center">
//             {post.user?.avatar && (
//               <Image source={{ uri: post.user.avatar }} className="w-8 h-8 rounded-full mr-3" />
//             )}
//             <View className="flex-col">
//               <Text className="text-sm font-medium text-gray-900 dark:text-white">
//                 {post.user?.firstname || post.user?.lastname
//                   ? `${post.user?.firstname ?? ""} ${post.user?.lastname ?? ""}`.trim()
//                   : post.user?.username?.trim()
//                   ? post.user.username
//                   : "Stayvia User"}
//               </Text>
//               <Text className="text-xs text-gray-500">
//                 {post.created_at
//                   ? new Date(post.created_at).toLocaleDateString()
//                   : ""} ·{" "}
//                 {post.created_at
//                   ? new Date(post.created_at).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })
//                   : ""}
//               </Text>
//             </View>
//           </View>

//           <TouchableOpacity onPress={handleOpenPost} className="p-2">
//             <AntDesign name="folderopen" size={20} color="#4F46E5" style={{ position: 'absolute', right: 0, top: 0 }} />
//           </TouchableOpacity>
//         </View> */}
//         <View className="flex-row items-center justify-between">
//         <TouchableOpacity
//           onPress={handleOpenuser}
//           className="flex-row items-center"
//           activeOpacity={0.7}
//         >
//           {post.user?.avatar && (
//             <Image
//               source={{ uri: post.user.avatar }}
//               className="w-8 h-8 rounded-full mr-3"
//             />
//           )}
//           <View className="flex-col">
//             <Text className="text-sm font-medium text-gray-900 dark:text-white">
//               {post.user?.firstname || post.user?.lastname
//                 ? `${post.user?.firstname ?? ""} ${post.user?.lastname ?? ""}`.trim()
//                 : post.user?.username?.trim()
//                 ? post.user.username
//                 : "Stayvia User"}
//             </Text>
//             <Text className="text-xs text-gray-500">
//               {post.created_at
//                 ? new Date(post.created_at).toLocaleDateString()
//                 : ""} ·{" "}
//               {post.created_at
//                 ? new Date(post.created_at).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })
//                 : ""}
//             </Text>
//           </View>
//         </TouchableOpacity>

//     {/* Open Post Icon */}
//     <TouchableOpacity onPress={handleOpenPost} className="p-2">
//       <AntDesign
//         name="folderopen"
//         size={20}
//         color="#4F46E5"
//         style={{ position: "absolute", right: 0, top: 0 }}
//       />
//     </TouchableOpacity>
// </View>


//         <CardTitle className="text-base ">{post.title}</CardTitle>

//         {description.length > 0 && (
//           <View className="mt-[-10]">
//             <Text className="text-sm text-gray-800 dark:text-gray-100">{displayText}</Text>
//             {shouldTruncate && (
//               <TouchableOpacity onPress={() => setExpanded(!expanded)}>
//                 <Text className="text-xs text-blue-600 mt-1">
//                   {expanded ? "See less" : "See more"}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       </CardHeader>


//       {/* Content */}
//       <CardContent className="px-0 mt-[-10]">
//         {post.image && (
//           <View className="relative">
//             <TouchableOpacity onPress={() => setFullScreenImageVisible(true)}>
//               <Image
//                 source={{ uri: post.image ?? "" }}
//                 className="w-full h-52 rounded"
//                 resizeMode="cover"
//               />
//             </TouchableOpacity>

//           </View>
//         )}
//       </CardContent>

//       <Separator className="my-[-15]" />

//       {/* Footer */}
//       <CardFooter className="flex-row items-center justify-between px-4 pb-3 mt-2">
//         {/* <TouchableOpacity
//           onPress={(e) => {
//             e.stopPropagation();
//             handleFavorite();
//           }}
//           className="flex-row items-center gap-2"
//         >
//           <Heart size={18} color={favorited ? "red" : "black"} fill={favorited ? "red" : "none"} />
//           <Text className="text-sm font-medium">{voteCount}</Text>
//         </TouchableOpacity> */}

//         <TouchableOpacity
//           onPress={(e) => {
//             e.stopPropagation();
//             handleComments();
//           }}
//           className="flex-row items-center gap-2"
//         >
//           <MessageCircle size={18} color="black" />
//           {/* <Text className="text-sm">{commentsCount} comments</Text> */}
//         </TouchableOpacity>
//       </CardFooter>

//       {/* Fullscreen Image Modal */}
//       <Modal
//         visible={fullScreenImageVisible}
//         transparent={true}
//         onRequestClose={() => setFullScreenImageVisible(false)}
//       >
//         <TouchableOpacity
//           style={{ flex: 1, backgroundColor: "rgb(0,0,0)", justifyContent: "center", alignItems: "center" }}
//           onPress={() => setFullScreenImageVisible(false)}
//           activeOpacity={1}
//         >
//           <Image
//             source={{ uri: post.image || "" }}
//             style={{ width: "100%", height: "100%", resizeMode: "contain" }}
//           />
//         </TouchableOpacity>
//       </Modal>
//     </Card>
//   );
// }


import React, { useState } from "react";
import { View, Image, TouchableOpacity, Modal, GestureResponderEvent } from "react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Tables } from "../../types/database.types";
import { Separator } from "../ui/separator";
import { AntDesign } from "@expo/vector-icons";

type Post = Tables<"posts"> & {
  user: Tables<"users"> | null;
  // image?: string | null;
  // description?: string | null;
};

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [fullScreenImageVisible, setFullScreenImageVisible] = useState(false);

  const maxChars = 100;
  const description = post.description ?? "";
  const shouldTruncate = description.length > maxChars;
  const displayText = expanded
    ? description
    : shouldTruncate
    ? description.slice(0, maxChars) + "..."
    : description;

  const handleComments = (e?: GestureResponderEvent) => {
    e?.stopPropagation?.();
    router.push(`/home/comment/${post.id}`);
  };

  const handleOpenPost = () => router.push(`/home/post/${post.id}`);

  const handleOpenUser = () => {
    if (post.user?.id) {
      router.push(`/(user)/${post.user.id}`);
    }
  };

  return (
    <Card className="w-full p-0 overflow-hidden shadow-sm mb-2 px-2">
      <CardHeader style={{ paddingHorizontal: 8, paddingTop: 16, paddingBottom: 0 }}>
        {/* User info */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleOpenUser}
            style={{ flexDirection: "row", alignItems: "center" }}
            activeOpacity={0.7}
          >
            {post.user?.avatar && (
              <Image
                source={{ uri: post.user.avatar }}
                style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
              />
            )}
            <View>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {post.user?.firstname || post.user?.lastname
                  ? `${post.user?.firstname ?? ""} ${post.user?.lastname ?? ""}`.trim()
                  : post.user?.username?.trim()
                  ? post.user.username
                  : "Stayvia User"}
              </Text>
              <Text className="text-xs text-gray-500">
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString()
                  : ""}{" "}
                ·{" "}
                {post.created_at
                  ? new Date(post.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Open Post Icon */}
          <TouchableOpacity onPress={handleOpenPost} style={{ padding: 8 }}>
            <AntDesign name="folderopen" size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* Title & Description */}
        <CardTitle style={{ fontSize: 16, marginTop: 4 }}>{post.title}</CardTitle>

        {description.length > 0 && (
          <View style={{ marginTop: 4 }}>
            <Text className="text-sm text-gray-800 dark:text-gray-100">{displayText}</Text>
            {shouldTruncate && (
              <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text className="text-xs text-blue-600 mt-1">
                  {expanded ? "See less" : "See more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </CardHeader>

      {/* Image Content */}
      <CardContent style={{ paddingHorizontal: 0, marginTop: 4 }}>
        {post.image ? (
          <View style={{ position: "relative" }}>
            <TouchableOpacity onPress={() => setFullScreenImageVisible(true)}>
              <Image
                source={{ uri: post.image }}
                style={{ width: "100%", height: 208, borderRadius: 8 }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </CardContent>

      <Separator style={{ marginVertical: 4 }} />

      {/* Footer */}
      <CardFooter
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={handleComments}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <MessageCircle size={18} color="black" />
        </TouchableOpacity>
      </CardFooter>

      {/* Fullscreen Image Modal */}
      <Modal
        visible={fullScreenImageVisible}
        transparent
        onRequestClose={() => setFullScreenImageVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgb(0,0,0)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setFullScreenImageVisible(false)}
          activeOpacity={1}
        >
          <Image
            source={{ uri: post.image ?? "" }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </Modal>
    </Card>
  );
}
