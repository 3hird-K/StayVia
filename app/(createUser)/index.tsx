import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSupabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "@/services/userService";
import { TablesInsert } from "@/types/database.types";

type Form = TablesInsert<"users">;

type FormValues = {
  role: "student" | "landlord" | "";
  firstname?: string;
  lastname?: string;
  contact: number;
  student_id?: number;
  school?: string;
  landlord_proof_id?: string;
  avatar?: string; // 🆕 avatar image
};

export default function CreateUser() {
  const { user } = useUser();
  const supabase = useSupabase();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(); // landlord proof
  const [avatar, setAvatar] = useState<string | undefined>(); // 🆕 profile avatar

  const { control, watch, setValue } = useForm<FormValues>({
    defaultValues: { role: "" },
  });

  const role = watch("role");

  // 🆕 Avatar Picker
  const pickAvatarAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const removeAvatar = () => setAvatar(undefined);

  // Common image upload function
  const uploadImage = async (localUri: string, bucket: string) => {
    try {
      setUploading(true);
      const fileRes = await fetch(localUri);
      const arrayBuffer = await fileRes.arrayBuffer();
      const fileExt = localUri.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;

      const { error, data } = await supabase.storage
        .from(bucket)
        .upload(path, arrayBuffer, {
          contentType: `image/${fileExt}`,
        });

      if (error) throw error;
      return data.path;
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to upload image.");
      return undefined;
    } finally {
      setUploading(false);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      let avatarPath: string | undefined;
      let proofPath: string | undefined;

      // 🆕 Upload avatar if selected
      if (avatar) {
        avatarPath = await uploadImage(avatar, "user-profiles");
      }

      // Upload landlord proof if applicable
      if (role === "landlord" && selectedImage) {
        proofPath = await uploadImage(selectedImage, "user-profiles");
      }

      return registerUser(
        {
          firstname: watch("firstname"),
          lastname: watch("lastname"),
          contact: Number(watch("contact")),
          student_id: role === "student" ? Number(watch("student_id")) : null,
          school: role === "student" ? watch("school") : null,
          landlord_proof_id: proofPath,
          avatar: avatarPath, // 🆕 Save avatar path
          account_type: role || "",
          id: user?.id || "",
          username: user?.username || "",
          email: user?.emailAddresses?.[0]?.emailAddress || "",
        },
        supabase
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.replace("/(protected)/home");
      Alert.alert("Success", "Account created successfully!");
    },
    onError: (err: any) => {
      console.error(err);
      Alert.alert("Error", "Failed to register account.");
    },
  });

  const onSubmit = () => mutate();

  if (!user?.id) {
    return (
      <View className="flex-1 items-center justify-center">
        <Skeleton className="h-8 w-48 mb-4 rounded" />
      </View>
    );
  }


  if(isPending){
    return <ActivityIndicator size="large" className="flex-1 justify-center items-center" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* 🆕 Avatar Section */}
          <View className="items-center mb-6">
            <TouchableOpacity onPress={pickAvatarAsync}>
              <Image
                source={{
                  uri: avatar || user.imageUrl,
                }}
                className="w-24 h-24 rounded-full border-2 border-gray-300"
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#2563eb",
                  borderRadius: 9999,
                  padding: 4,
                }}
              >
                <Ionicons name="camera" size={18} color="white" />
              </View>
            </TouchableOpacity>

            {avatar && (
              <TouchableOpacity onPress={removeAvatar} className="mt-2">
                <Text className="text-red-500">Remove</Text>
              </TouchableOpacity>
            )}

            <Text className="text-lg font-semibold mt-3 dark:text-white">{user.username}</Text>
          </View>

          {/* Role Selection */}
          <Text className="text-base font-semibold mb-2">Register as:</Text>
          <View className="flex-row gap-3 mb-4">
            {["student", "landlord"].map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setValue("role", r as "student" | "landlord")}
                className={`flex-1 p-3 rounded-xl border  ${
                  role === r ? "border-blue-500 dark:bg-black" : "dark:bg-gray-500"
                }`}
              >
                <Text className="text-center capitalize font-medium dark:text-white">{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Common Fields */}
          <Label className="text-sm">Firstname</Label>
          <Controller
            control={control}
            name="firstname"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Enter your firstname"
                value={value}
                onChangeText={onChange}
                className="mb-4"
              />
            )}
          />

          <Label className="text-sm">Lastname</Label>
          <Controller
            control={control}
            name="lastname"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Enter your lastname"
                value={value}
                onChangeText={onChange}
                className="mb-4"
              />
            )}
          />

          <Label className="text-sm">Contact Number</Label>
          <Controller
            control={control}
            name="contact"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Enter your contact number"
                keyboardType="number-pad"
                value={value?.toString() || ""}
                onChangeText={onChange}
                className="mb-4"
              />
            )}
          />

          {/* Student Fields */}
          {role === "student" && (
            <>
              <Label className="text-sm">Student ID</Label>
              <Controller
                control={control}
                name="student_id"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Enter your Student ID"
                    keyboardType="number-pad"
                    value={value?.toString() || ""}
                    onChangeText={onChange}
                    className="mb-4"
                  />
                )}
              />
              <Label className="text-sm">School</Label>
              <Controller
                control={control}
                name="school"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Enter your school name"
                    value={value}
                    onChangeText={onChange}
                    className="mb-4"
                  />
                )}
              />
            </>
          )}

          {/* Landlord Proof */}
          {role === "landlord" && (
            <>
              <Text className="text-sm mb-2">Valid ID Proof</Text>
              <TouchableOpacity
                onPress={async () => {
                  const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (status !== "granted") {
                    alert("Permission required!");
                    return;
                  }
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 1,
                  });
                  if (!result.canceled && result.assets?.length > 0) {
                    setSelectedImage(result.assets[0].uri);
                  }
                }}
                className="p-3 rounded-xl border border-dashed border-gray-400 items-center justify-center mb-4 relative"
              >
                {selectedImage ? (
                  <View>
                    <Image
                      source={{ uri: selectedImage }}
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 10,
                        resizeMode: "cover",
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => setSelectedImage(undefined)}
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        borderRadius: 9999,
                        padding: 5,
                      }}
                    >
                      <Ionicons name="close" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="w-32 h-32 rounded bg-gray-200 items-center justify-center">
                    {uploading ? (
                      <Skeleton className="h-8 w-48 mb-4 rounded" />
                    ) : (
                      <Text className="text-gray-500">Tap to select image</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Submit */}
          <Button className="mt-4" disabled={isPending} onPress={onSubmit}>
            <Text className="text-white font-medium">
              {isPending ? "Registering..." : "Register Account"}
            </Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
