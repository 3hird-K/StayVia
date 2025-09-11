import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import FeatherIcon from "@expo/vector-icons/Feather";
import { useUser, useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Account() {
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  const { user } = useUser();
  const { signOut } = useAuth();

  const [locationLabel, setLocationLabel] = useState<string>("Turn on the location");
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const resources = [
    { key: "location", label: "Location", route: null }, // modal only
    { key: "settings", label: "Account Settings", route: "../../(profile)/settings" },
    { key: "requests", label: "My Request", route: "../../(profile)/request" },
    { key: "favorites", label: "My Favorites", route: "/account/Favorites" },
  ];

  const truncate = (str: string, max: number) =>
    str.length > max ? str.substring(0, max) + "..." : str;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationLabel("Permission denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [place] = await Location.reverseGeocodeAsync(loc.coords);

      const label =
        [place.city, place.region].filter(Boolean).join(", ") ||
        place.country ||
        "";
      setLocationLabel(label);
    })();
  }, []);

  const defaultAvatar = "https://i.pravatar.cc/150";
  const avatarUrl =
    !user?.imageUrl || user.imageUrl.includes("clerk.dev/static")
      ? defaultAvatar
      : user.imageUrl;

  return (
    <SafeAreaView
      className="flex-1 bg-gray-100 dark:bg-black"
      edges={["top", "left", "right"]}
    >
      <ScrollView className="px-4 mb-0 pb-0">
        {/* Account Section */}
        <View className="py-4 mt-6">
          <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-2">
            Account
          </Text>
          <TouchableOpacity
            onPress={() => router.push(`../../(profile)/editProfile`)}
            className="flex-row items-center bg-white dark:bg-neutral-900 rounded-2xl px-4 py-7 shadow"
          >
            <Image
              alt="Profile Avatar"
              source={{ uri: avatarUrl }}
              className="w-16 h-16 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                {user?.fullName}
              </Text>
              <Text className="text-base text-gray-500 dark:text-gray-400">
                {user?.emailAddresses?.[0]?.emailAddress || user?.username}
              </Text>
            </View>
            <FeatherIcon
              name="chevron-right"
              size={22}
              color="#9ca3af" // neutral in both modes
            />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View className="py-4">
          <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-2">
            Preferences
          </Text>
          <View className="bg-white dark:bg-neutral-900 rounded-2xl shadow">
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <Text className="text-base text-gray-800 dark:text-white">
                Push Notifications
              </Text>
              <View className="flex-1" />
              <Switch
                onValueChange={(pushNotifications) =>
                  setForm({ ...form, pushNotifications })
                }
                value={form.pushNotifications}
              />
            </View>
          </View>
        </View>

        {/* Location Modal */}
        <Modal
          visible={isLocationModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLocationModalVisible(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white dark:bg-neutral-900 w-4/5 rounded-2xl p-6 items-center shadow-lg">
              <Text className="text-lg font-semibold mb-2 dark:text-white">
                Location
              </Text>
              <Text className="text-center text-base text-gray-600 dark:text-gray-300">
                {locationLabel}
              </Text>
              <Pressable
                onPress={() => setLocationModalVisible(false)}
                className="mt-4"
              >
                <Text className="text-red-600 text-base font-medium">
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Resources Section */}
        <View className="py-4">
          <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase mb-2">
            Resources
          </Text>
          <View className="bg-white dark:bg-neutral-900 rounded-2xl shadow">
            {resources.map((item, idx) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => {
                  if (item.key === "location") {
                    setLocationModalVisible(true);
                  } else if (item.route) {
                    router.push(item.route as never);
                  }
                }}
                className={`flex-row items-center px-4 py-3 ${
                  idx !== resources.length - 1
                    ? "border-b border-gray-100 dark:border-gray-800"
                    : ""
                }`}
              >
                <Text className="text-base text-gray-800 dark:text-white">
                  {item.label}
                </Text>
                <View className="flex-1" />
                {item.key === "location" && (
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    {truncate(locationLabel, 20)}
                  </Text>
                )}
                <FeatherIcon name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View className="py-4">
          <View className="bg-white dark:bg-neutral-900 rounded-2xl shadow">
            <TouchableOpacity
              onPress={() => signOut()}
              className="flex-row items-center justify-center px-4 py-3"
            >
              <Text className="text-base font-semibold text-red-600">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text className="text-sm text-gray-400 dark:text-gray-500 text-center mt-6 mb-8">
          Version: Beta
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
