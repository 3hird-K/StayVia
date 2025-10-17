import React, { useEffect, useState } from "react";
import { Image, ActivityIndicator, View } from "react-native";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

interface DownloadImageProps {
  path?: string | null; // Supabase storage path
  supabase: SupabaseClient<Database>;
  fallbackUri?: string; // Default image
  className?: string;
  style?: object;
}

export default function DownloadImage({
  path,
  supabase,
  fallbackUri,
  className,
  style,
}: DownloadImageProps) {
  const [uri, setUri] = useState<string | undefined>(fallbackUri);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!path) return;

    const fetchImage = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.storage
          .from("user-profiles")
          .download(path);

        if (error || !data) throw error || new Error("Failed to download");

        const reader = new FileReader();
        reader.onloadend = () => setUri(reader.result as string);
        reader.onerror = (err) => {
          console.error("FileReader error:", err);
          setUri(fallbackUri);
        };
        reader.readAsDataURL(data);
      } catch (err) {
        console.error("Download image error:", err);
        setUri(fallbackUri);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [path]);

  if (loading) {
    return (
      <View
        className={className}
        style={[{ justifyContent: "center", alignItems: "center" }, style]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return <Image source={{ uri }} className={className} style={style} />;
}
