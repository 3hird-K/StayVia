import { Database, TablesInsert } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

// INSERT REQUEST BY USER ID
// INSERT REQUEST BY USER ID
export const insertRequestByUserId = async (
  userId: string,
  postId: string,
  supabase: SupabaseClient<Database>
) => {
  const { data, error } = await supabase
    .from("requests")
    .insert({
      user_id: userId,
      post_id: postId,
    })
    .select(); 

  if (error) throw error;
  return data ?? [];
};


// FETCH REQUEST5 BY USER ID
export const fetchRequestByUserId = async (user_id: string, supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase.from("requests")
        .select("*, post_user:users!posts_user_id_fkey(*)")
        // .eq("post_id", post_id)
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};