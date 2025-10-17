import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/lib/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertPost } from "@/services/postService";
import { FormInput } from "@/components/ui/form-input";
import { ChipSelector } from "@/components/ui/chip-selector";
import { SubmitButton } from "@/components/ui/submit-btn";
import { useSupabase } from "@/lib/supabase";

export default function CreatePost() {
 
  const router = useRouter();
  const { colors } = useAppTheme();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price_per_night: "",
    beds: 1,
  });

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(true);

  // Options
  const utilityOptions = ["WiFi", "Electricity", "Water", "Air Conditioning"];
  const featureOptions = ["Furnished", "Shared Kitchen", "Private", "Boarding", "Dormitory"];

  // Selected filters
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Random image
  const random = Math.floor(Math.random() * 1000);

  // Location fetch
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        setLoadingLoc(false);
        return;
      }
      const current = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
      setLoadingLoc(false);
    })();
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      insertPost(
        {
          title: form.title,
          description: form.description,
          price_per_night: Number(form.price_per_night),
          latitude: location?.latitude,
          longitude: location?.longitude,
          image: `https://picsum.photos/id/${random}/400/300`,
          beds: form.beds,
          filters: [...selectedUtilities, ...selectedFeatures],
        },
        supabase
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setForm({
        title: "",
        description: "",
        price_per_night: "",
        beds: 1,
      });
      setSelectedUtilities([]);
      setSelectedFeatures([]);

      router.back();
    },
    onError: (err: any) => {
      console.error(err);
      Alert.alert("Error", "Failed to create post.");
    },
  });

  const handlePost = () => {
    if (!form.title || !form.title) return Alert.alert("Missing Fields", "Please fill all required fields.");
    mutate();
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 py-2 border-b"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <Ionicons name="close" size={25} color={colors.foreground} onPress={() => router.back()} />
        <Text className="font-bold text-lg" style={{ color: colors.foreground }}>
          New Post
        </Text>
        <View style={{ width: 25 }} />
      </View>

      {/* Form */}
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

        {/* ✅ Filter selectors */}
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

        <SubmitButton
          title="Post Listing"
          loading={isPending}
          onPress={handlePost}
          colorScheme={colors}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
