import { supabase } from "@/lib/supabase";

export const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user:users!posts_user_id_fkey(*)");
    if (error) throw error;
    return data ?? [];
};

export const fetchPostsById = async (id: string) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user:users!posts_user_id_fkey(*)")
      .eq('id', id)
      .single();
    if (error) throw error;
    return data ?? [];
};


export const fetchPostsByUserId = async (id: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, user:users!posts_user_id_fkey(*)")
    .eq("user_id", id);    
  if (error) throw error;
  return data ?? [];
};



export const fetchPostsByType = async (type: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, user:users!posts_user_id_fkey(*)")
    .eq("type", type);    
  if (error) throw error;
  return data ?? [];
};


// export const fetchPostsByFilters = async (selectedFilters: string[]) => {
//   const { data, error } = await supabase
//     .from("posts")
//     .select("*, user:users!posts_user_id_fkey(*)")
//     .contains("filters", selectedFilters);

//   if (error) throw error;
//   return data ?? [];
// };

// Custom Filters

export const fetchAllFilters = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("filters");

  if (error) throw error;

  const allFilters = (data ?? [])
    .map((post) => post.filters ?? [])
    .flat()
    .filter((filter): filter is string => typeof filter === "string");

  const uniqueFilters = Array.from(new Set(allFilters));
  return uniqueFilters;
};

// Fetch posts filtered by selected filters
export const fetchPostsByFilters = async (filters: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, user:users!posts_user_id_fkey(*)")
    .contains("filters", filters);   
  if (error) throw error;
  return data ?? [];
};
