import { Link, Stack, Tabs, useLocalSearchParams } from 'expo-router';
import { View, Text, Image } from 'react-native';
import channels from '@/data/channels';
import messages from '@/data/messages';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';

// import { Ionicons } from '@expo/vector-icons';

export default function ChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const channel = channels.find((c) => c.id === id);

  if (!channel) {
    return (
      <View>
        <Text>Channel not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
      options={{ title: channel.name,
       }}
      />

      <MessageList />
      <MessageInput />
    </>
  );
}
