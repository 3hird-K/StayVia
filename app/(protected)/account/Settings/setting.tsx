import ScreenWrapper from "@/components/ScreenWrapper";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

export default function setting() {

    const insets = useSafeAreaInsets();
    const [mode, setMode] = useState({
        darkMode: true,
        lightMode: false,
      });

    return (
        <ScreenWrapper>
            <SafeAreaView
                className="flex-1 bg-white px-4"
                style={{ paddingTop: insets.top || 22 }}
            >
                {/* Back Button */}
                <View className="flex-row items-center w-full mb-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="#4B5563" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-gray-800 ml-2">
                    Account Settings
                </Text>
                </View>

                {/* Account Security */}
                <View className="py-4">
                    <Text className="text-xs font-medium text-gray-400 uppercase mb-2">
                    Account & Security
                    </Text>
                    <View className="bg-white rounded-2xl shadow">
                    <TouchableOpacity
                        // onPress={() => router.push("/account/settings/personal-info")}
                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                    >
                        <Text className="text-base text-gray-800">Change Password</Text>
                        <View className="flex-1" />
                        <Ionicons name="chevron-forward" size={20} color="#bcbcbc" />
                    </TouchableOpacity>
                    </View>
                </View>

                {/* Help & Support */}
                <View className="py-4">
                    <Text className="text-xs font-medium text-gray-400 uppercase mb-2">
                    Help & Support
                    </Text>
                    <View className="bg-white rounded-2xl shadow">
                    <TouchableOpacity
                        // onPress={() => router.push("/account/settings/personal-info")}
                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                    >
                        <Text className="text-base text-gray-800">Help & FAQs</Text>
                        <View className="flex-1" />
                        <Ionicons name="chevron-forward" size={20} color="#bcbcbc" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        // onPress={() => router.push("/account/settings/personal-info")}
                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                    >
                        <Text className="text-base text-gray-800">Contact Support</Text>
                        <View className="flex-1" />
                        <Ionicons name="chevron-forward" size={20} color="#bcbcbc" />
                    </TouchableOpacity>
                    </View>
                </View>


                {/* Theme */}
                <View className="py-4">
                    <Text className="text-xs font-medium text-gray-400 uppercase mb-2">
                    Theme
                    </Text>
                    <View className="bg-white rounded-2xl shadow">
                        <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                            <Text className="text-base text-gray-800">Dark Mode</Text>
                            <View className="flex-1" />
                            <Switch
                            onValueChange={(lightMode) =>
                                setMode({ ...mode, lightMode })
                            }
                            value={mode.lightMode}
                            />
                        </View>
                    </View>
                </View>

                {/* About App */}
                <View className="py-4">
                    <Text className="text-xs font-medium text-gray-400 uppercase mb-2">
                    About App
                    </Text>
                    <View className="bg-white rounded-2xl shadow">
                    <TouchableOpacity
                        // onPress={() => router.push("/account/settings/personal-info")}
                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                    >
                        <Text className="text-base text-gray-800">Terms & Condition</Text>
                        <View className="flex-1" />
                        <Ionicons name="chevron-forward" size={20} color="#bcbcbc" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        // onPress={() => router.push("/account/settings/personal-info")}
                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                    >
                        <Text className="text-base text-gray-800">Privacy Policy</Text>
                        <View className="flex-1" />
                        <Ionicons name="chevron-forward" size={20} color="#bcbcbc" />
                    </TouchableOpacity>
                    </View>
                </View>

               

               
            </SafeAreaView>
        </ScreenWrapper>
    );
}
