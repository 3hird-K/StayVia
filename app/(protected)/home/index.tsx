import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function HomeScreen() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  return (
    <ScreenWrapper>
    <ScrollView
      style={{ paddingTop: insets.top || 22 }}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.header}>Hi, {user?.username || user?.firstName || "User"}!</Text>
      <Text style={styles.sub}>Welcome</Text>

      
    </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  sub: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff59",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
  },
  activeTab: {
    backgroundColor: "#ffffff",
  },
  activeTabText: {
    color: "#000",
  },
});


