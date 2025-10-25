import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

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

// DELETE/DISAPPROVE REQUEST
export const deleteRequest = async (id: string, supabase: SupabaseClient<Database>) => {
  const {error} = await supabase
    .from("requests")
    .delete()
    .eq("id", id)

    if(error) throw error
  return true;           
}

// UPDATE REQUEST: mark requested === true
export const updateRequest = async (
  requestId: string,
  // userId: string,
  supabase: SupabaseClient<Database>
) => {
  const { data, error } = await supabase
    .from("requests")
    .update({ requested: true }) 
    .eq("id", requestId)
    // .eq("user_id", userId)
    .select("*"); 

  if (error) throw error;
  console.log(data)
  return data ?? [];
};

// FETCH REQUEST BY USERiD
type RequestWithUser = {
  id: string;
  title: string;
  avatar: string;
  time: string;
  postId: string;
  user: Database["public"]["Tables"]["users"]["Row"];
  requested: boolean;
  post: Database["public"]["Tables"]["posts"]["Row"]
};

export const fetchAllRequests = async (
  postIds: string[],
  supabase: SupabaseClient<Database>
): Promise<RequestWithUser[]> => {
  if (!postIds.length) return [];

  const { data, error } = await supabase
    .from("requests")
    .select(`
      *,
      user:user_id (*),
      post:post_id (*)
    `)
    .in("post_id", postIds)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  const defaultAvatar = "https://i.pravatar.cc/150";

  return data.map((r: any) => ({
    id: r.id,
    title: `${r.user?.firstname} requested your post "${r.post?.title}"`,
    avatar: r.user?.avatar || defaultAvatar,
    time: formatDistanceToNow(new Date(r.created_at), { addSuffix: true }),
    postId: r.post?.id,
    post: r.post,
    user: r.user,
    requested: r.requested ?? false,
  }));
};


// ---------------------------
// FETCH APPROVED REQUESTS FOR A USER
// requested === true && user_id === current user
// ---------------------------
export const fetchApprovedRequestsByUser = async (
  userId: string,
  supabase: SupabaseClient<Database>
): Promise<RequestWithUser[]> => {
  const { data, error } = await supabase
    .from("requests")
    .select(`
      *,
      user:user_id (*),
      post:post_id (*)
    `)
    .eq("requested", true)  // only approved requests
    .eq("user_id", userId)  // only requests by this user
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  const defaultAvatar = "https://i.pravatar.cc/150";

  return data.map((r: any) => ({
    id: r.id,
    title: `${r.user?.firstname} requested your post "${r.post?.title}"`,
    avatar: r.user?.avatar || defaultAvatar,
    time: formatDistanceToNow(new Date(r.created_at), { addSuffix: true }),
    postId: r.post?.id,
    post: r.post,
    user: r.user,
    requested: r.requested ?? false,
  }));
};

