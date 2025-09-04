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
  { key: "settings", label: "Account Settings", route: "/account/Settings" },
  { key: "requests", label: "My Request", route: "/account/Requests" },
  { key: "favorites", label: "My Favorites", route: "/account/Favorites" },
];

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
    <ScreenWrapper>
      <ScrollView className="px-3">
        {/* Account Section */}
        <View className="py-4 mt-6">
          <Text className="text-xs font-medium text-gray-400 uppercase mb-2">
            Account
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/account/update/updateUser")}
            className="flex-row items-center bg-white rounded-2xl p-3 shadow"
          >
            <Image
              alt="Profile Avatar"
              source={{ uri: avatarUrl }}
              className="w-16 h-16 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                {user?.fullName}
              </Text>
              <Text className="text-base text-gray-500">
                {user?.emailAddresses?.[0]?.emailAddress || user?.username}
              </Text>
            </View>
            <FeatherIcon name="chevron-right" size={22} color="#bcbcbc" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View className="py-4">
          <Text className="text-xs font-medium text-gray-400 uppercase mb-2">
            Preferences
          </Text>
          <View className="bg-white rounded-2xl shadow">
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
              <Text className="text-base text-gray-800">Push Notifications</Text>
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
            <View className="bg-white w-4/5 rounded-2xl p-6 items-center shadow-lg">
              <Text className="text-lg font-semibold mb-2">Location</Text>
              <Text className="text-center text-base text-gray-600">
                {locationLabel}
              </Text>
              <Pressable
                onPress={() => setLocationModalVisible(false)}
                className="mt-4"
              >
                <Text className="text-red-600 text-base font-medium">Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Resources Section */}
        <View className="py-4">
          <Text className="text-xs font-medium text-gray-400 uppercase mb-2">
            Resources
          </Text>
          <View className="bg-white rounded-2xl shadow">
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
                  idx !== resources.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <Text className="text-base text-gray-800">{item.label}</Text>
                <View className="flex-1" />
                {item.key === "location" && (
                  <Text className="text-sm text-gray-500 mr-2">{locationLabel}</Text>
                )}
                <FeatherIcon name="chevron-right" size={20} color="#bcbcbc" />
              </TouchableOpacity>
              // <TouchableOpacity
              //   key={item.key}
              //   onPress={() => {
              //     if (item.key === "location") setLocationModalVisible(true);
              //     // 🔹 plug in other handlers here if needed
              //   }}
              //   className={`flex-row items-center px-4 py-3 ${
              //     idx !== resources.length - 1 ? "border-b border-gray-100" : ""
              //   }`}
              // >
              //   <Text className="text-base text-gray-800">{item.label}</Text>
              //   <View className="flex-1" />
              //   {item.key === "location" && (
              //     <Text className="text-sm text-gray-500 mr-2">{locationLabel}</Text>
              //   )}
              //   <FeatherIcon name="chevron-right" size={20} color="#bcbcbc" />
              // </TouchableOpacity>

            ))}
          </View>
        </View>


        {/* Logout */}
        <View className="py-4">
          <View className="bg-white rounded-2xl shadow">
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
        <Text className="text-sm text-gray-400 text-center mt-6 mb-8">
          Version: Beta
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
}
