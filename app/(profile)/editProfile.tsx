import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/input';
import HeaderBtn from '@/components/HeaderBtn';
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/services/userService';
import { useSupabase } from '@/lib/supabase';

export default function ProfileEditScreen() {
  const { user } = useUser();
  const supabase = useSupabase();
  const colorScheme = useColorScheme(); 
  const darkMode = colorScheme === 'dark';
   const colors = {
    bg: darkMode ? 'bg-gray-900' : 'bg-white',
    cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
    textPrimary: darkMode ? 'text-gray-100' : 'text-gray-700',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-500',
    inputBg: darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-700',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    icon: darkMode ? '#ccc' : '#bcbcbc',
  };
  const validateUsername = (name: string) => {
    if (name.trim().length < 4) return 'Username must be at least 4 characters long.';
    if (name.trim().length > 64) return 'Username must be less than 64 characters.';
    if (!/^[a-zA-Z0-9_\-^$!.`#+~]+$/.test(name))
      return 'Only letters, numbers, _, -, and ^$!.`#+~ are allowed.';
    return '';
  };

  const user_id = user?.id;

  const { data, error, isLoading } = useQuery({
      queryKey: ["users", user_id],
      queryFn: () => getUserById(user_id as string, supabase),
      enabled: !!user_id,
    });

  console.log(JSON.stringify(user?.id, null , 2))
  console.log(JSON.stringify(data, null , 2))

 

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <ScrollView className="px-4 mb-0 pb-0">
          <HeaderBtn title="Edit Profile" />

    
          {/* <TouchableOpacity onPress={openModal} className="my-6 items-center">
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                className="w-[110px] h-[110px] rounded-full mb-3"
              />
            )}
            <Text className="text-indigo-600 text-sm font-semibold">Upload Picture</Text>
          </TouchableOpacity> */}

       
          {/* <Text className={`font-medium mb-1 ${colors.textPrimary}`}>Username</Text>
          <Input
            value={username}
            onChangeText={(text) => { setUsername(text); setUsernameError(''); }}
            placeholder="Enter username"
            className={`${colors.inputBg}`}
            aria-invalid={!!usernameError}
          />
          {usernameError !== '' && <Text className="text-red-500 text-xs mt-1">{usernameError}</Text>} */}

       
          {/* <Text className={`font-medium mb-1 mt-4 ${colors.textPrimary}`}>First Name</Text>
          <Input
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
            className={`${colors.inputBg}`}
            aria-invalid={!!firstNameError}
          />
          {firstNameError !== '' && <Text className="text-red-500 text-xs mt-1">{firstNameError}</Text>} */}

     
          {/* <Text className={`font-medium mb-1 mt-4 ${colors.textPrimary}`}>Last Name</Text>
          <Input
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
            className={`${colors.inputBg}`}
            aria-invalid={!!lastNameError}
          /> */}

      
          {/* <TouchableOpacity
            disabled={loading}
            onPress={handleUpdate}
            className={`py-3 rounded-lg mt-6 items-center ${loading ? 'bg-indigo-400' : 'bg-indigo-600'}`}
          >
            {loading ? (
              <View className="flex-row items-center justify-center space-x-2">
                <ActivityIndicator size="small" color="#fff" />
                <Text className="text-white font-bold text-base">Saving...</Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-base">Save</Text>
            )}
          </TouchableOpacity> */}

        
          {/* <Modal
            isVisible={isModalVisible}
            onBackdropPress={closeModal}
            className="m-0 justify-end"
          >
            <View className={`${colors.cardBg} p-6 rounded-2xl`}>
              <Text className={`text-lg font-semibold mb-4 ${colors.textPrimary}`}>
                Edit profile picture
              </Text>
              <TouchableOpacity onPress={takePhoto}>
                <Text className="text-indigo-600 text-base py-3">Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={pickFromLibrary}>
                <Text className="text-indigo-600 text-base py-3">Photo Library</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal}>
                <Text className="text-gray-400 text-base py-3 mt-2">Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
