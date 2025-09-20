// import React, { useState, useMemo, useEffect } from "react";
// import {
//   SafeAreaView,
//   FlatList,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   Image,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { Text } from "@/components/ui/text";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { PostCard } from "@/components/home/PostCard";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Link } from "expo-router";
// // import type { Post } from "@/utils/types";
// import { getAllPosts } from "@/utils/api";
// import { useAppTheme } from "@/lib/theme"; 
// import { supabase } from "@/lib/supabase";
// import { Tables } from "@/types/database.types"
// import { useQuery } from "@tanstack/react-query";


// type Post = Tables<'posts'> & { 
//   user: Tables<'users'> | null;
// };

// // async function fetchPosts() {
// //   const { data, error } = await supabase
// //     .from("posts")
// //     .select("*, user:users!posts_user_id_fkey(*)");
// //   if (error) throw error;
// //   return data ?? [];
// // }


// export default function Home() {

//   const insets = useSafeAreaInsets();
//   const { colors} = useAppTheme();

//   // const [posts, setPosts] = useState<Post[]>([]);
//   // const [activeFilters, setActiveFilters] = useState<string[]>([]);
//   // const [activeType, setActiveType] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [filterModalVisible, setFilterModalVisible] = useState(false);
//   const [loading, setLoading] = useState(true);


//   // useEffect(() => {
//   //   fetchPosts();
//   // }, []);

//   const fetchPosts = async () =>{
//     // setLoading(true);
//     const {data, error} = await supabase.from('posts').select('*, user:users!posts_user_id_fkey(*)');
//     // console.log(error)
//     console.log("data", JSON.stringify(data, null, 2));

//     if(error){
//       console.error('Supabase error:', error);
//       // setPosts([]);
//     } else {
//       // setPosts(data);
//       return data;
//     }
//     // setLoading(false);
//   }

  
//   const { data: posts } = useQuery({
//     queryKey: ['posts'],
//     queryFn: () => fetchPosts(),
//   })

//   // console.log("data", JSON.stringify(posts, null, 2));
//   // console.log(data);

//   // console.log(posts[0].user)


//   // Unique filters across all posts
//   // const allFilters = useMemo(() => {
//   //   const set = new Set<string>();
//   //   posts.forEach((item) => item.filters?.forEach((f) => set.add(f)));
//   //   return Array.from(set).sort();
//   // }, [posts]);

//   // const toggleFilter = (filter: string) => {
//   //   setActiveFilters((prev) =>
//   //     prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
//   //   );
//   // };

//   // Property types
//   // const allTypes = useMemo(() => {
//   //   const set = new Set<string>();
//   //   posts.forEach((p) => {
//   //     if (p.type) set.add(p.type);
//   //   });
//   //   return Array.from(set);
//   // }, [posts]);

//   // const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
//   //   "Boarding House": "home",
//   //   "Shared Room": "people",
//   //   "Private Room": "bed",
//   //   Dormitory: "school",
//   //   Apartment: "business",
//   //   Studio: "grid",
//   // };

//   // const selectType = (type: string) => {
//   //   setActiveType((prev) => (prev === type ? null : type));
//   // };

//   // Filtered posts
//   // const filteredListings = useMemo(() => {
//   //   const q = search.trim().toLowerCase();
//   //   return posts.filter((item) => {
//   //     const matchesFilter =
//   //       activeFilters.length === 0 ||
//   //       activeFilters.every((f) => item.filters?.includes(f));

//   //     const matchesSearch =
//   //       !q ||
//   //       item.title?.toLowerCase().includes(q) ||
//   //       item.location?.toLowerCase().includes(q) ||
//   //       item.user?.firstname?.toLowerCase().includes(q) ||
//   //       item.user?.username?.toLowerCase().includes(q);

//   //     const matchesType = !activeType || item.type === activeType;

//   //     return matchesFilter && matchesSearch && matchesType;
//   //   });
//   // }, [activeFilters, search, activeType, posts]);

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         paddingTop: insets.top || 22,
//         backgroundColor: colors.background,
//       }}
//     >
//       {/* Account Section */}
//       <View className="flex-col items-center px-1 py-0"
//             style={{ backgroundColor: colors.primary }}>
//         <Image
//           alt="App Logo"
//           source={require("@/assets/images/icon-white.png")}
//           className="w-40 h-24 top-2"
//         />
//       </View>

//       {/* Search + Filter */}
//       <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <View
//             style={{
//               flex: 1,
//               flexDirection: "row",
//               alignItems: "center",
//               backgroundColor: colors.card,
//               borderRadius: 9999,
//               paddingHorizontal: 16,
//               borderWidth: 1,
//               borderColor: colors.border,
//             }}
//           >
//             <Input
//               placeholder="Search..."
//               placeholderTextColor={colors.mutedForeground}
//               value={search}
//               onChangeText={setSearch}
//               style={{ flex: 1, borderWidth: 0, color: colors.foreground }}
//             />
//             <Ionicons name="search" size={20} color={colors.mutedForeground} />
//           </View>

//           <TouchableOpacity
//             onPress={() => setFilterModalVisible(true)}
//             style={{
//               marginLeft: 12,
//               backgroundColor: colors.primary,
//               padding: 12,
//               borderRadius: 12,
//             }}
//           >
//             <Ionicons name="filter" size={20} color={colors.primaryForeground} />
//           </TouchableOpacity>
//         </View>

//         {/* Property Types TabBar */}
//         {/* {allTypes.length > 0 && (
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={{ marginTop: 12 }}
//             contentContainerStyle={{ paddingRight: 8 }}
//           >
//             {["Apartment", "Studio", "Boarding House", "Shared Room", "Private Room", "Dormitory"].map(
//               (type) => {
//                 const selected = activeType === type;
//                 const color = selected ? colors.primary : colors.mutedForeground;
//                 return (
//                   <TouchableOpacity
//                     key={type}
//                     onPress={() => selectType(type)}
//                     style={{
//                       flexDirection: "column",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       marginRight: 16,
//                       paddingVertical: 4,
//                       borderBottomWidth: selected ? 2 : 0,
//                       borderBottomColor: selected ? colors.primary : "transparent",
//                     }}
//                   >
//                     <Ionicons name={typeIcons[type]} size={24} color={color} />
//                     <Text style={{ color, fontSize: 12, marginTop: 4 }}>
//                       {type.split(" ")[0]}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               }
//             )}
//           </ScrollView>
//         )} */}

//         {/* Active filter chips */}
//         {/* {activeFilters.length > 0 && (
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={{ marginTop: 12 }}
//             contentContainerStyle={{ paddingRight: 8 }}
//           >
//             {activeFilters.map((f) => (
//               <Badge
//                 key={f}
//                 variant="secondary"
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   borderRadius: 9999,
//                   paddingHorizontal: 12,
//                   paddingVertical: 4,
//                   backgroundColor: colors.card,
//                   marginRight: 8,
//                 }}
//               >
//                 <Text style={{ color: colors.mutedForeground }}>
//                   {f.replace("-", " ")}
//                 </Text>
//                 <TouchableOpacity onPress={() => toggleFilter(f)}>
//                   <Ionicons name="close" size={14} color={colors.mutedForeground} />
//                 </TouchableOpacity>
//               </Badge>
//             ))}
//           </ScrollView>
//         )} */}
//       </View>

//       {/* Filter Modal */}
//       <Modal
//         animationType="slide"
//         transparent
//         visible={filterModalVisible}
//         onRequestClose={() => setFilterModalVisible(false)}
//       >
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: "rgba(0,0,0,0.5)",
//             justifyContent: "flex-end",
//           }}
//         >
//           <View
//             style={{
//               backgroundColor: colors.card,
//               borderTopLeftRadius: 20,
//               borderTopRightRadius: 20,
//               padding: 20,
//               maxHeight: "60%",
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 18,
//                 fontWeight: "600",
//                 color: colors.foreground,
//                 marginBottom: 12,
//               }}
//             >
//               Select Filters
//             </Text>

//             <ScrollView
//               contentContainerStyle={{
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 paddingBottom: 16,
//               }}
//             >
//               {/* {allFilters.map((filter) => {
//                 const selected = activeFilters.includes(filter);
//                 return (
//                   <TouchableOpacity
//                     key={filter}
//                     onPress={() => toggleFilter(filter)}
//                     style={{
//                       paddingHorizontal: 12,
//                       paddingVertical: 6,
//                       borderRadius: 9999,
//                       borderWidth: 1,
//                       borderColor: selected ? colors.primary : colors.border,
//                       backgroundColor: selected ? colors.primary : "transparent",
//                       marginRight: 8,
//                       marginBottom: 8,
//                     }}
//                   >
//                     <Text
//                       style={{
//                         color: selected ? colors.primaryForeground : colors.foreground,
//                       }}
//                     >
//                       {filter.replace("-", " ")}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })} */}
//             </ScrollView>

//             <TouchableOpacity
//               onPress={() => setFilterModalVisible(false)}
//               style={{
//                 marginTop: 16,
//                 backgroundColor: colors.primary,
//                 paddingVertical: 12,
//                 borderRadius: 12,
//               }}
//             >
//               <Text
//                 style={{
//                   color: colors.primaryForeground,
//                   fontWeight: "600",
//                   textAlign: "center",
//                 }}
//               >
//                 Apply Filters
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Listings */}
//       <View style={{ flex: 1, marginTop: 16 }}>
//         {loading ? (
//           <View style={{ paddingHorizontal: 16 }}>
//             {[...Array(5)].map((_, i) => (
//               <View key={i} style={{ marginBottom: 16 }}>
//                 <Skeleton style={{ height: 160, width: "100%", borderRadius: 16, marginBottom: 8 }} />
//                 <Skeleton style={{ height: 16, width: "75%", marginBottom: 4 }} />
//                 <Skeleton style={{ height: 16, width: "50%" }} />
//               </View>
//             ))}
//           </View>
//         ) : (
//           <FlatList
//             // data={filteredListings}
//             data={posts}
//             // keyExtractor={(item) => item.id.toString()}
//             keyExtractor={(item) => String(item.id)}

//             renderItem={({ item }) => (
//               <Link href={`/home/post/${item.id}`} asChild>
//                 <PostCard post={item} />
//               </Link>
//             )}
//             ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
//             contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 40 }}
//             showsVerticalScrollIndicator={false}
//             ListEmptyComponent={() => (
//               <Text style={{ textAlign: "center", color: colors.mutedForeground, marginTop: 40 }}>
//                 No listings found
//               </Text>
//             )}
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

import React, { useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/home/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "expo-router";
import { useAppTheme } from "@/lib/theme";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/database.types";
import { useQuery } from "@tanstack/react-query";

// type Post = Tables<"posts"> & {
//   user: Tables<"users"> | null;
// };

export default function Home() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const [search, setSearch] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Fetch function for React Query
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user:users!posts_user_id_fkey(*)");
    if (error) throw error;
    return data ?? [];
  };

  // TanStack Query usage
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60, 
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top || 22,
        backgroundColor: colors.background,
      }}
    >
      {/* Header / Logo */}
      <View
        className="flex-col items-center px-1 py-0"
        style={{ backgroundColor: colors.primary }}
      >
        <Image
          alt="App Logo"
          source={require("@/assets/images/icon-white.png")}
          className="w-40 h-24 top-2"
        />
      </View>

      {/* Search + Filter */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.card,
              borderRadius: 9999,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Input
              placeholder="Search..."
              placeholderTextColor={colors.mutedForeground}
              value={search}
              onChangeText={setSearch}
              style={{ flex: 1, borderWidth: 0, color: colors.foreground }}
            />
            <Ionicons name="search" size={20} color={colors.mutedForeground} />
          </View>

          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            style={{
              marginLeft: 12,
              backgroundColor: colors.primary,
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Ionicons name="filter" size={20} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "60%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.foreground,
                marginBottom: 12,
              }}
            >
              Select Filters
            </Text>

            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingBottom: 16,
              }}
            >
              {/* filter chips would go here */}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setFilterModalVisible(false)}
              style={{
                marginTop: 16,
                backgroundColor: colors.primary,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: colors.primaryForeground,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Listings */}
      <View style={{ flex: 1, marginTop: 16 }}>
        {isLoading ? (
          <View style={{ paddingHorizontal: 16 }}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={{ marginBottom: 16 }}>
                <Skeleton
                  style={{ height: 160, width: "100%", borderRadius: 16, marginBottom: 8 }}
                />
                <Skeleton style={{ height: 16, width: "75%", marginBottom: 4 }} />
                <Skeleton style={{ height: 16, width: "50%" }} />
              </View>
            ))}
          </View>
        ) : isError ? (
          <Text
            style={{
              textAlign: "center",
              color: colors.mutedForeground,
              marginTop: 40,
            }}
          >
            Error loading posts: {String((error as Error).message)}
          </Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Link href={`/home/post/${item.id}`} asChild>
                <PostCard post={item} />
              </Link>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text
                style={{
                  textAlign: "center",
                  color: colors.mutedForeground,
                  marginTop: 40,
                }}
              >
                No listings found
              </Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
