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


export const fetchPostsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, user:users!posts_user_id_fkey(*)")
    .eq("user_id", userId);    
  if (error) throw error;
  return data ?? [];
};
