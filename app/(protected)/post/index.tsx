import { View, Text, TextInput, TouchableOpacity, ScrollView, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function CreatePost() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const [checked, setChecked] = useState(false);

  // Define colors dynamically
  const colors = {
    background: isDark ? "#121212" : "#f5f5f5",
    card: isDark ? "#1f1f1f" : "#fff",
    border: isDark ? "#333" : "#ccc",
    text: isDark ? "#fff" : "#000",
    mutedText: isDark ? "#aaa" : "#555",
    primary: "#7c3aed", // purple
    secondary: "#6b7280", // gray
    input: isDark ? "#2c2c2c" : "#f2f2f2",
  };

  const utilityOptions = ["WiFi", "Electricity", "Water", "Air Conditioning", "TV", "Others"];
  const featureOptions = ["Furnished", "Shared Kitchen", "Private Kitchen", "Shared Bathroom", "Private Bathroom", "Others"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          padding: 16,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
          Create Post
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Property Details */}
        {["Property Name", "Property Type", "Complete Address", "Price per Month", "Gender Preference", "Capacity"].map((placeholder) => (
          <TextInput
            key={placeholder}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedText}
            style={{
              backgroundColor: colors.input,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginBottom: 12,
              color: colors.text,
            }}
          />
        ))}

        {/* Utilities */}
        <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 8 }}>Utilities</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {utilityOptions.map((item) => (
            <TouchableOpacity
              key={item}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                margin: 4,
                backgroundColor: colors.card,
              }}
            >
              <Text style={{ color: colors.text }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features */}
        <Text style={{ color: colors.text, fontWeight: "600", marginTop: 16, marginBottom: 8 }}>Features</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {featureOptions.map((item) => (
            <TouchableOpacity
              key={item}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                margin: 4,
                backgroundColor: colors.card,
              }}
            >
              <Text style={{ color: colors.text }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Photos */}
        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: colors.secondary,
            borderRadius: 8,
            paddingVertical: 32,
            marginTop: 16,
            alignItems: "center",
            backgroundColor: colors.card,
          }}
        >
          <Text style={{ color: colors.mutedText }}>+ Add Photos</Text>
        </TouchableOpacity>

        {/* Description */}
        <TextInput
          placeholder="Description"
          placeholderTextColor={colors.mutedText}
          multiline
          style={{
            backgroundColor: colors.input,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginTop: 16,
            minHeight: 120,
            color: colors.text,
          }}
        />

        {/* Contact Info */}
        <Text style={{ color: colors.text, fontWeight: "600", marginTop: 16, marginBottom: 8 }}>Contact Info</Text>
        {["Full Name (Landlord)", "Contact No.", "Email Address"].map((placeholder) => (
          <TextInput
            key={placeholder}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedText}
            style={{
              backgroundColor: colors.input,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginBottom: 12,
              color: colors.text,
            }}
          />
        ))}

        {/* Property Location */}
        <Text style={{ color: colors.text, fontWeight: "600", marginTop: 16, marginBottom: 8 }}>Property Location</Text>
        {["Street Address", "City", "Province", "ZIP Code"].map((placeholder) => (
          <TextInput
            key={placeholder}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedText}
            style={{
              backgroundColor: colors.input,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginBottom: 12,
              color: colors.text,
            }}
          />
        ))}

        {/* Agreement */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
          <TouchableOpacity
            onPress={() => setChecked(!checked)}
            style={{
              width: 20,
              height: 20,
              borderWidth: 1,
              borderRadius: 4,
              borderColor: checked ? colors.primary : colors.border,
              backgroundColor: checked ? colors.primary : "transparent",
              marginRight: 8,
            }}
          />
          <Text style={{ color: colors.text }}>I agree to the Terms and Conditions</Text>
        </View>

        {/* Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.primary,
              paddingVertical: 12,
              borderRadius: 8,
              marginRight: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Post Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.secondary,
              paddingVertical: 12,
              borderRadius: 8,
              marginLeft: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Discard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
