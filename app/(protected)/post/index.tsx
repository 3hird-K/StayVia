// import React, { useState } from "react";
// import {
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Text,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useAppTheme } from "@/lib/theme"; // your hook
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function CreatePost() {
//   const router = useRouter();
//   const { colors } = useAppTheme();
//   const [checked, setChecked] = useState(false);

//   const utilityOptions = [
//     "WiFi",
//     "Electricity",
//     "Water",
//     "Air Conditioning",
//     "TV",
//     "Others",
//   ];
//   const featureOptions = [
//     "Furnished",
//     "Shared Kitchen",
//     "Private Kitchen",
//     "Shared Bathroom",
//     "Private Bathroom",
//     "Others",
//   ];

//   const textInputClasses =
//     "rounded-md px-3 py-2 mb-3 border text-base dark:text-white";
//   const chipClasses =
//     "rounded-md px-3 py-2 m-1 border";

//   return (
//     <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
//       {/* Header */}
//       <View
//         className="flex-row items-center justify-between px-4 py-4 border-b"
//         style={{ backgroundColor: colors.card, borderColor: colors.border }}
//       >
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="close" size={25} color={colors.foreground} />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => console.log("Post")} className="font-bold text-lg ml-auto mr-[-15px] p-2 px-5 rounded-full" style={{backgroundColor: colors.primary}}>
//           <Text className="text-white font-bold">
//             Post
//           </Text>
//         </TouchableOpacity>
//         <View className="w-5" />{/* spacer */}
//       </View>

//       <ScrollView contentContainerClassName="p-4">


//          {/* Property Location */}
//           <Text
//             className="font-semibold mt-4 mb-2"
//             style={{ color: colors.foreground }}
//           >
//             Property Location
//           </Text>
//           {["Street Address", "City", "Province", "ZIP Code"].map(
//             (placeholder) => (
//               <TextInput
//                 key={placeholder}
//                 placeholder={placeholder}
//                 placeholderTextColor={colors.mutedForeground}
//                 className={textInputClasses}
//                 style={{
//                   backgroundColor: colors.input,
//                   borderColor: colors.border,
//                   color: colors.foreground,
//                 }}
//               />
//             )
//           )}





//         {/* Property Details */}
//         {[
//           "Property Name",
//           "Property Type",
//           "Complete Address",
//           "Price per Month",
//           "Gender Preference",
//           "Capacity",
//         ].map((placeholder) => (
//           <TextInput
//             key={placeholder}
//             placeholder={placeholder}
//             placeholderTextColor={colors.mutedForeground}
//             className={textInputClasses}
//             style={{
//               backgroundColor: colors.input,
//               borderColor: colors.border,
//               color: colors.foreground,
//             }}
//           />
//         ))}

//         {/* Utilities */}
//         <Text
//           className="font-semibold mb-2"
//           style={{ color: colors.foreground }}
//         >
//           Utilities
//         </Text>
//         <View className="flex-row flex-wrap">
//           {utilityOptions.map((item) => (
//             <TouchableOpacity
//               key={item}
//               className={chipClasses}
//               style={{
//                 backgroundColor: colors.card,
//                 borderColor: colors.border,
//               }}
//             >
//               <Text style={{ color: colors.foreground }}>{item}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Features */}
//         <Text
//           className="font-semibold mt-4 mb-2"
//           style={{ color: colors.foreground }}
//         >
//           Features
//         </Text>
//         <View className="flex-row flex-wrap">
//           {featureOptions.map((item) => (
//             <TouchableOpacity
//               key={item}
//               className={chipClasses}
//               style={{
//                 backgroundColor: colors.card,
//                 borderColor: colors.border,
//               }}
//             >
//               <Text style={{ color: colors.foreground }}>{item}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Add Photos */}
//         <TouchableOpacity
//           className="rounded-md mt-4 items-center justify-center border-2 border-dashed py-8"
//           style={{
//             borderColor: colors.secondary,
//             backgroundColor: colors.card,
//           }}
//         >
//           <Text style={{ color: colors.mutedForeground }}>+ Add Photos</Text>
//         </TouchableOpacity>

//         {/* Description */}
//         <TextInput
//           placeholder="Description"
//           placeholderTextColor={colors.mutedForeground}
//           multiline
//           className={`${textInputClasses} mt-4 min-h-[120px]`}
//           style={{
//             backgroundColor: colors.input,
//             borderColor: colors.border,
//             color: colors.foreground,
//           }}
//         />

//         {/* Contact Info */}
//         <Text
//           className="font-semibold mt-4 mb-2"
//           style={{ color: colors.foreground }}
//         >
//           Contact Info
//         </Text>
//         {["Full Name (Landlord)", "Contact No.", "Email Address"].map(
//           (placeholder) => (
//             <TextInput
//               key={placeholder}
//               placeholder={placeholder}
//               placeholderTextColor={colors.mutedForeground}
//               className={textInputClasses}
//               style={{
//                 backgroundColor: colors.input,
//                 borderColor: colors.border,
//                 color: colors.foreground,
//               }}
//             />
//           )
//         )}

       

//         {/* Agreement */}
//         <View className="flex-row items-center mt-3">
//           <TouchableOpacity
//             onPress={() => setChecked(!checked)}
//             className="w-5 h-5 mr-2 rounded border"
//             style={{
//               borderColor: checked ? colors.primary : colors.border,
//               backgroundColor: checked ? colors.primary : "transparent",
//             }}
//           />
//           <Text style={{ color: colors.foreground }}>
//             I agree to the Terms and Conditions
//           </Text>
//         </View>

//         {/* Buttons */}
//         <View className="flex-row justify-between mt-4">
//           <TouchableOpacity
//             className="flex-1 rounded-md py-3 mr-2 items-center"
//             style={{ backgroundColor: colors.primary }}
//           >
//             <Text className="font-bold text-white">Post Listing</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             className="flex-1 rounded-md py-3 ml-2 items-center"
//             style={{ backgroundColor: colors.secondary }}
//           >
//             <Text className="font-bold text-white">Discard</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/lib/theme";

export default function CreatePost() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [checked, setChecked] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(true);

  const utilityOptions = ["WiFi","Electricity","Water","Air Conditioning","TV","Others"];
  const featureOptions = ["Furnished","Shared Kitchen","Private Kitchen","Shared Bathroom","Private Bathroom","Others"];

  const textInputClasses =
    "rounded-md px-3 py-2 mb-3 border text-base dark:text-white";
  const chipClasses = "rounded-md px-3 py-2 m-1 border";

  // --- get current GPS location ---
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

  const handlePost = () => {
    console.log("Posting property with location:", location);
    // Add form submission logic here
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 py-4 border-b"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={25} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePost}
          className="ml-auto mr-[-15px] p-2 px-5 rounded-full"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-bold">Post</Text>
        </TouchableOpacity>
        <View className="w-5" />
      </View>

      <ScrollView contentContainerClassName="p-4">
        {/* Property Location section + Map */}
        <Text
          className="font-semibold mt-4 mb-2"
          style={{ color: colors.foreground }}
        >
          Property Location
        </Text>

        {/* Map with current GPS */}
        {loadingLoc ? (
          <View className="h-64 items-center justify-center mb-4">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.foreground, marginTop: 8 }}>
              Getting location…
            </Text>
          </View>
        ) : location ? (
          <View className="w-full h-64 rounded-md overflow-hidden mb-4">
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation
              showsMyLocationButton
            >
              <Marker coordinate={location} title="Current Location" />
            </MapView>
          </View>
        ) : null}

        {["Street Address", "City", "Province", "ZIP Code"].map((placeholder) => (
          <TextInput
            key={placeholder}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedForeground}
            className={textInputClasses}
            style={{
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.foreground,
            }}
          />
        ))}

        {/* Property Details */}
        {[
          "Property Name",
          "Property Type",
          "Complete Address",
          "Price per Month",
          "Gender Preference",
          "Capacity",
        ].map((placeholder) => (
          <TextInput
            key={placeholder}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedForeground}
            className={textInputClasses}
            style={{
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.foreground,
            }}
          />
        ))}

        {/* Utilities */}
        <Text className="font-semibold mb-2" style={{ color: colors.foreground }}>
          Utilities
        </Text>
        <View className="flex-row flex-wrap">
          {utilityOptions.map((item) => (
            <TouchableOpacity
              key={item}
              className={chipClasses}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.foreground }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features */}
        <Text className="font-semibold mt-4 mb-2" style={{ color: colors.foreground }}>
          Features
        </Text>
        <View className="flex-row flex-wrap">
          {featureOptions.map((item) => (
            <TouchableOpacity
              key={item}
              className={chipClasses}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.foreground }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Photos */}
        <TouchableOpacity
          className="rounded-md mt-4 items-center justify-center border-2 border-dashed py-8"
          style={{
            borderColor: colors.secondary,
            backgroundColor: colors.card,
          }}
        >
          <Text style={{ color: colors.mutedForeground }}>+ Add Photos</Text>
        </TouchableOpacity>

        {/* Description */}
        <TextInput
          placeholder="Description"
          placeholderTextColor={colors.mutedForeground}
          multiline
          className={`${textInputClasses} mt-4 min-h-[120px]`}
          style={{
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.foreground,
          }}
        />

        {/* Contact Info */}
        <Text className="font-semibold mt-4 mb-2" style={{ color: colors.foreground }}>
          Contact Info
        </Text>
        {["Full Name (Landlord)", "Contact No.", "Email Address"].map((placeholder) => (
          <TextInput
            key={placeholder}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedForeground}
            className={textInputClasses}
            style={{
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.foreground,
            }}
          />
        ))}

        {/* Agreement */}
        <View className="flex-row items-center mt-3">
          <TouchableOpacity
            onPress={() => setChecked(!checked)}
            className="w-5 h-5 mr-2 rounded border"
            style={{
              borderColor: checked ? colors.primary : colors.border,
              backgroundColor: checked ? colors.primary : "transparent",
            }}
          />
          <Text style={{ color: colors.foreground }}>
            I agree to the Terms and Conditions
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between mt-4 mb-10">
          <TouchableOpacity
            className="flex-1 rounded-md py-3 mr-2 items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={handlePost}
          >
            <Text className="font-bold text-white">Post Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 rounded-md py-3 ml-2 items-center"
            style={{ backgroundColor: colors.secondary }}
            onPress={() => router.back()}
          >
            <Text className="font-bold text-white">Discard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
