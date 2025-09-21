// import React, { useState } from "react";
// import { View, Image, TouchableOpacity, Modal, GestureResponderEvent } from "react-native";
// import { Text } from "@/components/ui/text";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { MessageCircle } from "lucide-react-native";
// import { useRouter } from "expo-router";
// import { Tables } from "../../types/database.types";
// import { Separator } from "../ui/separator";
// import { AntDesign } from "@expo/vector-icons";

// type Post = Tables<"posts"> & {
//   user: Tables<"users"> | null;
// };

// type PostCardProps = {
//   post: Post;
// };

// export function PostCard({ post }: PostCardProps) {
//   const router = useRouter();
//   const [expanded, setExpanded] = useState(false);
//   const [fullScreenImageVisible, setFullScreenImageVisible] = useState(false);

//   const maxChars = 100;
//   const description = post.description ?? "";
//   const shouldTruncate = description.length > maxChars;
//   const displayText = expanded
//     ? description
//     : shouldTruncate
//     ? description.slice(0, maxChars) + "..."
//     : description;

//   const handleComments = (e?: GestureResponderEvent) => {
//     e?.stopPropagation?.();
//     router.push(`/home/comment/${post.id}`);
//   };

//   const handleOpenPost = () => router.push(`/(post)/${post.id}`);

//   const handleOpenUser = () => {
//     if (post.user_id) {
//       router.push(`/(user)/${post.user_id}`);
//     }
//   };

//   return (
//     <Card className="w-full p-0 overflow-hidden shadow-sm mb-2">
//       <CardHeader className="px-0 pt-4 pb-0">
//         {/* User info */}
//         <View className="flex-row justify-between items-center px-4">
//           <TouchableOpacity
//             onPress={handleOpenUser}
//             className="flex-row items-center"
//             activeOpacity={0.7}
//           >
//             {post.user?.avatar && (
//               <Image
//                 source={{ uri: post.user.avatar }}
//                 className="w-8 h-8 rounded-full mr-2"
//               />
//             )}
//             <View>
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
//                   : ""}{" "}
//                 ·{" "}
//                 {post.created_at
//                   ? new Date(post.created_at).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })
//                   : ""}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           {/* Open Post Icon */}
//           <TouchableOpacity onPress={handleOpenPost} className="p-2">
//             <AntDesign name="folderopen" size={20} color="#4F46E5" />
//           </TouchableOpacity>
//         </View>

//         {/* Title & Description */}
//         <CardTitle className="text-base px-4 mt-2">{post.title}</CardTitle>

//         {description.length > 0 && (
//           <View className="mt-1 px-4">
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

//       {/* Image Content */}
//       <CardContent className="px-0 mt-1">
//         {post.image && (
//           <View className="relative">
//             <TouchableOpacity onPress={() => setFullScreenImageVisible(true)}>
//               <Image
//                 source={{ uri: post.image }}
//                 className="w-full h-52 rounded"
//                 resizeMode="cover"
//               />
//             </TouchableOpacity>
//           </View>
//         )}
//       </CardContent>

//       <Separator className="my-1" />

//       {/* Footer */}
//       <CardFooter className="flex-row items-center justify-between px-4 pb-3 mt-2">
//         <TouchableOpacity
//           onPress={handleComments}
//           className="flex-row items-center"
//         >
//           <MessageCircle size={18} color="black" />
//         </TouchableOpacity>
//       </CardFooter>

//       {/* Fullscreen Image Modal */}
//       <Modal
//         visible={fullScreenImageVisible}
//         transparent
//         onRequestClose={() => setFullScreenImageVisible(false)}
//       >
//         <TouchableOpacity
//           className="flex-1 bg-black justify-center items-center"
//           onPress={() => setFullScreenImageVisible(false)}
//           activeOpacity={1}
//         >
//           <Image
//             source={{ uri: post.image ?? "" }}
//             className="w-full h-full"
//             style={{ resizeMode: "contain" }}
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
};

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  // Hide the entire card if user doesn't exist
  if (!post.user) return null;

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

  const handleOpenPost = () => router.push(`/(post)/${post.id}`);
  const handleOpenUser = () => router.push(`/(user)/${post.user_id}`);

  return (
    <Card className="w-full p-0 overflow-hidden shadow-sm mb-2">
      <CardHeader className="px-0 pt-4 pb-0">
        {/* User info */}
        <View className="flex-row justify-between items-center px-4">
          <TouchableOpacity
            onPress={handleOpenUser}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            {post.user.avatar && (
              <Image
                source={{ uri: post.user.avatar }}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <View>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {post.user.firstname || post.user.lastname
                  ? `${post.user.firstname ?? ""} ${post.user.lastname ?? ""}`.trim()
                  : post.user.username?.trim() ?? ""}
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
          <TouchableOpacity onPress={handleOpenPost} className="p-2">
            <AntDesign name="folderopen" size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* Title & Description */}
        <CardTitle className="text-base px-4 mt-2">{post.title}</CardTitle>

        {description.length > 0 && (
          <View className="mt-1 px-4">
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
      <CardContent className="px-0 mt-1">
        {post.image && (
          <View className="relative">
            <TouchableOpacity onPress={() => setFullScreenImageVisible(true)}>
              <Image
                source={{ uri: post.image }}
                className="w-full h-52 rounded"
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        )}
      </CardContent>

      <Separator className="my-1" />

      {/* Footer */}
      <CardFooter className="flex-row items-center justify-between px-4 pb-3 mt-2">
        <TouchableOpacity onPress={handleComments} className="flex-row items-center">
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
          className="flex-1 bg-black justify-center items-center"
          onPress={() => setFullScreenImageVisible(false)}
          activeOpacity={1}
        >
          <Image
            source={{ uri: post.image ?? "" }}
            className="w-full h-full"
            style={{ resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </Modal>
    </Card>
  );
}
