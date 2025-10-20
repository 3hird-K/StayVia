import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

// ---------------------------
// INSERT REQUEST BY USER ID
// ---------------------------
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
    .select("*"); // select inserted row(s)

  if (error) throw error;
  return data ?? [];
};

// ---------------------------
// FETCH REQUESTS BY USER ID
// Optional: filter by postId if provided
// ---------------------------
export const fetchRequestByUserId = async (
  userId: string,
  postId: string | null,
  supabase: SupabaseClient<Database>
) => {
  let query = supabase
    .from("requests")
    .select("*, post:posts(*, post_user:users(*))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (postId) query = query.eq("post_id", postId);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};

// ---------------------------
// FETCH ALL REQUESTS FOR A POST
// Useful to disable request button for everyone
// ---------------------------
export const fetchAllRequestsByPostId = async (
  postId: string,
  supabase: SupabaseClient<Database>
) => {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("post_id", postId);

  if (error) throw error;
  return data ?? [];
};
