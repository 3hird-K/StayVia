import { Database, TablesInsert } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

// FETCH POSTS
export const fetchPostsWithUser = async (supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase.from("posts")
        .select("*, post_user:users!posts_user_id_fkey(*)")
        .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};

// FETCH POST BY ID
export const fetchPostsById = async (id: string, supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, post_user:users!posts_user_id_fkey(*)")
    .eq('id', id)
    .single();
  if (error) throw error;
  return data ?? null;
}

// FETCH POSTS BY USER ID
export const fetchPostsByUserId = async (user_id: string, supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, post_user:users!posts_user_id_fkey(*)")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// INSERT POST
export const insertPost = async (
  post_data: TablesInsert<"posts">,
  supabase: SupabaseClient<Database>
) => {
  const { data, error } = await supabase.from("posts").insert(post_data).select();
  if (error) throw error;
  return data;
};

// DELETE POST
export const deletePost = async (
  post_id: string,
  user_id: string,
  supabase: SupabaseClient<Database>
) => {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", post_id)
    .eq("user_id", user_id); 

  if (error) throw error;
  return true;
};


// export const fetchPostsById = async (id: string, supabase: SupabaseClient<Database>) => {
//     const { data, error } = await supabase
//       .from("posts")
//       .select("*, user:!posts_user_id_fkey(*)")
//       .eq('id', id)
//       .single();
//     if (error) throw error;
//     return data ?? [];
// };


// export const fetchPostsByUserId = async (id: string) => {
//   const { data, error } = await supabase
//     .from("posts")
//     .select("*, user:users!posts_user_id_fkey(*)")
//     .eq("user_id", id);    
//   if (error) throw error;
//   return data ?? [];
// };



// export const fetchPostsByType = async (type: string) => {
//   const { data, error } = await supabase
//     .from("posts")
//     .select("*, user:users!posts_user_id_fkey(*)")
//     .eq("type", type);    
//   if (error) throw error;
//   return data ?? [];
// };


// // export const fetchPostsByFilters = async (selectedFilters: string[]) => {
// //   const { data, error } = await supabase
// //     .from("posts")
// //     .select("*, user:users!posts_user_id_fkey(*)")
// //     .contains("filters", selectedFilters);

// //   if (error) throw error;
// //   return data ?? [];
// // };

// // Custom Filters

// export const fetchAllFilters = async (): Promise<string[]> => {
//   const { data, error } = await supabase
//     .from("posts")
//     .select("filters");

//   if (error) throw error;

//   const allFilters = (data ?? [])
//     .map((post) => post.filters ?? [])
//     .flat()
//     .filter((filter): filter is string => typeof filter === "string");

//   const uniqueFilters = Array.from(new Set(allFilters));
//   return uniqueFilters;
// };

// // Fetch posts filtered by selected filters
// export const fetchPostsByFilters = async (filters: string) => {
//   const { data, error } = await supabase
//     .from("posts")
//     .select("*, user:users!posts_user_id_fkey(*)")
//     .contains("filters", filters);   
//   if (error) throw error;
//   return data ?? [];
// };
