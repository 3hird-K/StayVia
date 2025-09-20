import { supabase } from "@/lib/supabase";

export const fetchUserById = async (id: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq('id', id)
      .single();
    if (error) throw error;
    return data ?? [];
};

