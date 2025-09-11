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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/input';
import HeaderBtn from '@/components/HeaderBtn';

import { SafeAreaView } from "react-native-safe-area-context";


export default function ProfileEditScreen() {

  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setUsername(user.username || '');
      setImageUri(user.imageUrl || null);
    }
  }, [user]);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const pickFromLibrary = async () => {
    closeModal();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setNewImageFile({
        uri: asset.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as unknown as File);
    }
  };

  const takePhoto = async () => {
    closeModal();
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setNewImageFile({
        uri: asset.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as unknown as File);
    }
  };

  const validateUsername = (name: string) => {
    if (name.trim().length < 4) {
      return 'Username must be at least 4 characters long.';
    }
    if (name.trim().length > 64) {
      return 'Username must be less than 64 characters.';
    }
    if (!/^[a-zA-Z0-9_\-^$!.`#+~]+$/.test(name)) {
      return 'Only letters, numbers, _, -, and ^$!.`#+~ are allowed.';
    }
    return '';
  };

  const handleUpdate = async () => {
    setLoading(true);
    setUsernameError('');
    setFirstNameError('');
    setLastNameError('');
    let hasError = false;

    if (firstName.trim() === '') {
      setFirstNameError('First name is required.');
      hasError = true;
    } else if (!/^[a-zA-Z\s'-]+$/.test(firstName.trim())) {
      setFirstNameError('Contains invalid characters.');
      hasError = true;
    }

    if (lastName.trim() === '') {
      setLastNameError('Last name is required.');
      hasError = true;
    } else if (!/^[a-zA-Z\s'-]+$/.test(lastName.trim())) {
      setLastNameError('Contains invalid characters.');
      hasError = true;
    }


    const usernameValidation = validateUsername(username);
    if (usernameValidation) {
      setUsernameError(usernameValidation);
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const updates: any = {};
      if (firstName !== user?.firstName) updates.firstName = firstName;
      if (lastName !== user?.lastName) updates.lastName = lastName;
      if (username !== user?.username) updates.username = username;

      if (Object.keys(updates).length > 0) {
        await user?.update(updates);
      }
      if (newImageFile) {
        await user?.setProfileImage({ file: newImageFile });
      }

      Alert.alert('Success', 'Your profile has been updated.');
      router.back();
    } catch (error: any) {
      if (
        error.errors &&
        Array.isArray(error.errors) &&
        error.errors[0]?.code === 'form_identifier_exists'
      ) {
        setUsernameError('This username is already taken.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <ScrollView className="px-4 mb-0 pb-0" >

          <HeaderBtn title="Edit Profile" />

            {/* Profile Image */}
            <TouchableOpacity onPress={openModal} className="my-6 items-center">
              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  className="w-[110px] h-[110px] rounded-full mb-3"
                />
              )}
              <Text className="text-indigo-600 text-sm font-semibold">
                Upload Picture
              </Text>
            </TouchableOpacity>

            {/* Username */}
            <Text className="text-gray-700 font-medium mb-1">Username</Text>
            <Input
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setUsernameError('');
              }}
              placeholder="Enter username"
              aria-invalid={!!usernameError}
            />
            {usernameError !== '' && (
              <Text className="text-red-500 text-xs mt-1">{usernameError}</Text>
            )}

            {/* First Name */}
            <Text className="text-gray-700 font-medium mb-1 mt-4">First Name</Text>
            <Input
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              aria-invalid={!!firstNameError}
            />
            {firstNameError !== '' && (
              <Text className="text-red-500 text-xs mt-1">{firstNameError}</Text>
            )}

            {/* Last Name */}
            <Text className="text-gray-700 font-medium mb-1 mt-4">Last Name</Text>
            <Input
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              aria-invalid={!!lastNameError}
            />

            {/* Save Button */}
            <TouchableOpacity
              disabled={loading}
              onPress={handleUpdate}
              className={`py-3 rounded-lg mt-6 items-center ${
                loading ? 'bg-indigo-400' : 'bg-indigo-600'
              }`}
            >
              {loading ? (
                <View className="flex-row items-center justify-center space-x-2">
                  <ActivityIndicator size="small" color="#fff" />
                  <Text className="text-white font-bold text-base">Saving...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-base">Save</Text>
              )}
            </TouchableOpacity>

            {/* Modal */}
            <Modal
              isVisible={isModalVisible}
              onBackdropPress={closeModal}
              className="m-0 justify-end"
            >
              <View className="bg-white p-6 rounded-2xl">
                <Text className="text-lg font-semibold mb-4 text-black">
                  Edit profile picture
                </Text>
                <TouchableOpacity onPress={takePhoto}>
                  <Text className="text-indigo-600 text-base py-3">Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={pickFromLibrary}>
                  <Text className="text-indigo-600 text-base py-3">Photo Library</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal}>
                  <Text className="text-gray-500 text-base py-3 mt-2">Cancel</Text>
                </TouchableOpacity>
              </View>
            </Modal>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    
  );
}
