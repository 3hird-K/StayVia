import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

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

// FETCH REQUEST BY USER ID AND POST ID
// export const fetchRequestByUserId = async (
//   user_id: string,
//   post_id: string,
//   supabase: SupabaseClient<Database>
// ) => {
//   const { data, error } = await supabase
//     .from("requests")
//     .select(
//       `
//       *,
//       user:users!requests_user_id_fkey(*),
//       post:posts!requests_post_id_fkey(*)
//       `
//     )
//     .eq("user_id", user_id)
//     .eq("post_id", post_id)
//     .order("created_at", { ascending: false });

//   if (error) throw error;
//   return data ?? [];
// };

export const fetchRequestByUserId = async (
  user_id: string,
  post_id: string | null,
  supabase: SupabaseClient<Database>
) => {
  let query = supabase.from("requests")
    .select("*, post:posts(*, post_user:users(*))")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (post_id) query = query.eq("post_id", post_id);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};
