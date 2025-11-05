import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/lib/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertPost } from "@/services/postService";
import { FormInput } from "@/components/ui/form-input";
import { ChipSelector } from "@/components/ui/chip-selector";
import { BedSelector } from "@/components/ui/bed-selector";
import { useSupabase } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { Skeleton } from "@/components/ui/skeleton";
import FeatherIcon from "@expo/vector-icons/Feather";

export default function CreatePost() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [accountType, setAccountType] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch user account type
  useEffect(() => {
    if (!user) return;
    const fetchUserType = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("account_type")
        .eq("id", user.id)
        .single();

      if (error) console.error(error);
      setAccountType(data?.account_type || null);
      setLoadingUser(false);
    };
    fetchUserType();
  }, [user]);

  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [uploadedImagePath, setUploadedImagePath] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price_per_night: "",
    beds: "Single Occupancy",
  });

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

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [loadingLoc, setLoadingLoc] = useState(true);

  const utilityOptions = ["WiFi/Internet", "Electricity Included", "Water Included", "Air Conditioning"];
  const featureOptions = [
    "Fully Furnished",
    "Semi-Furnished",
    "Unfurnished",
    "Kitchen Access",
    "Private Room",
    "Shared Room",
    "Boarding House",
    "Dormitory",
    "Female Only",
    "Male Only",
    "Co-ed/Mixed"
  ];
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       Alert.alert("Permission Denied", "Location permission is required.");
  //       setLoadingLoc(false);
  //       return;
  //     }
  //     const current = await Location.getCurrentPositionAsync({});
  //     setLocation({
  //       latitude: current.coords.latitude,
  //       longitude: current.coords.longitude,
  //     });
  //     setLoadingLoc(false);
  //   })();
  // }, []);
  useEffect(() => {
  (async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location access is required to create a post. Please enable it in your settings."
      );
      setLoadingLoc(false);
      return;
    }

    try {
      const current = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    } catch (err) {
      Alert.alert(
        "Error",
        "Unable to fetch your current location. Please ensure location is enabled."
      );
    } finally {
      setLoadingLoc(false);
    }
  })();
}, []);


  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      let userPost: string | undefined;

      if (selectedImage) {
        userPost = await uploadImage(selectedImage, "user-posts");
      }

      return insertPost(
        {
          title: form.title,
          description: form.description,
          price_per_night: Number(form.price_per_night),
          latitude: location?.latitude,
          longitude: location?.longitude,
          image: userPost || null,
          beds: form.beds,
          filters: [...selectedUtilities, ...selectedFeatures],
        },
        supabase
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setForm({ title: "", description: "", price_per_night: "", beds: "Single Occupancy" });
      setSelectedUtilities([]);
      setSelectedFeatures([]);
      setSelectedImage(undefined);
      setUploadedImagePath(undefined);
      router.push("/home")
    },
    onError: (err: any) => {
      console.error(err);
      Alert.alert("Error", "Failed to create post.");
    },
  });

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      const path = await uploadImage(uri, "user-posts");
      if (path) setUploadedImagePath(path);
    }
  };

  // const handlePost = () => {
  //   if (!form.title || !form.description)
  //     return Alert.alert("Missing Fields", "Please fill all required fields.");
  //   mutate();
  // };

  const handlePost = () => {
  if (!form.title || !form.description || !form.price_per_night) {
    return Alert.alert("Missing Fields", "Please fill all required fields.");
  }

  if (!location?.latitude || !location?.longitude) {
    return Alert.alert(
      "Location Required",
      "Please turn on your location services and try again."
    );
  }

  mutate();
};

  // --- Conditional rendering ---
  if (loadingUser) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (accountType === "student") {
    return (
      <SafeAreaView className="flex-1">
         <View
            className="flex-row items-center justify-between px-4 py-3 border-b"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <TouchableOpacity
              onPress={() => router.push("/home")}
              className={`w-10 h-10 rounded-full items-center justify-center mr-4`}
              >
              <Ionicons
                name="close"
                size={25}
                color={colors.foreground}
              />
            </TouchableOpacity>
                      
          </View>
      <ScrollView contentContainerClassName="flex-1 align-center justify-center p-4 pb-10">

        <Text className="text-lg font-semibold text-gray-500 dark:text-gray-300 text-center mb-5">
          Unavailable — For Students.
        </Text>
       <TouchableOpacity
        onPress={() => router.push("/(createLandlord)")}
        disabled={isPending}
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 12,
          paddingHorizontal: 50,
          borderRadius: 8,
          opacity: isPending ? 0.6 : 1,
          alignItems: "center",
        }}
      >
        <Text className="text-white font-semibold text-base">
          {isPending ? "Loading..." : "Apply as Landlord"}
        </Text>
      </TouchableOpacity>

      </ScrollView>
      </SafeAreaView>
    );
  }

  if (loadingLoc) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="mt-2 text-gray-500">Fetching your location...</Text>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View
        className="flex-row items-center justify-between px-4 py-3 border-b"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className={`w-10 h-10 rounded-full items-center justify-center mr-4`}
          >
          <Ionicons
            name="close"
            size={25}
            color={colors.foreground}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePost}
          disabled={isPending}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            opacity: isPending ? 0.6 : 1,
          }}
        >
          <Text className="text-white font-semibold text-sm">Create Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName="p-4 pb-10">
        <FormInput
          label="Property Title"
          placeholder="e.g. Cozy Apartment"
          value={form.title}
          onChangeText={(v) => setForm({ ...form, title: v })}
          colorScheme={colors}
        />

        <FormInput
          label="Description"
          placeholder="Write something about your property"
          multiline
          value={form.description}
          onChangeText={(v) => setForm({ ...form, description: v })}
          colorScheme={colors}
        />

        <FormInput
          label="Price per Month"
          placeholder="Enter price"
          type="number"
          value={form.price_per_night}
          onChangeText={(v) => setForm({ ...form, price_per_night: v })}
          colorScheme={colors}
        />

        {/*  Beds Selector */}
        <Text className="text-sm mb-1 font-bold dark:text-white">Number of Beds</Text>
        <BedSelector
          label="Occupancy Type"
          value={form.beds}
          onChange={(val) => setForm({ ...form, beds: val })}
        />

        <Text className="text-sm my-2 font-bold dark:text-white">Property Image (Optional)</Text>
        <TouchableOpacity
          onPress={handleSelectImage}
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
                onPress={() => {
                  setSelectedImage(undefined);
                  setUploadedImagePath(undefined);
                }}
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
                <Text className="text-gray-500 text-center">
                  Select image (optional)
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>

        <ChipSelector
          options={utilityOptions}
          label="Utilities"
          selected={selectedUtilities}
          onChange={setSelectedUtilities}
          colorScheme={colors}
        />

        <ChipSelector
          options={featureOptions}
          label="Features"
          selected={selectedFeatures}
          onChange={setSelectedFeatures}
          colorScheme={colors}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
