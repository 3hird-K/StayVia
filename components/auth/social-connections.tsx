// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { useSSO, type StartSSOFlowParams } from '@clerk/clerk-expo';
// import * as AuthSession from 'expo-auth-session';
// import { router } from 'expo-router';
// import * as WebBrowser from 'expo-web-browser';
// import { useColorScheme } from 'nativewind';
// import * as React from 'react';
// import { Image, Platform, View } from 'react-native';
// import { Text } from '../ui/text';

// WebBrowser.maybeCompleteAuthSession();

// type SocialConnectionStrategy = Extract<
//   StartSSOFlowParams['strategy'],
//   'oauth_google'
// >;

// const GOOGLE_STRATEGY = {
//   type: 'oauth_google' as SocialConnectionStrategy,
//   source: { uri: 'https://img.clerk.com/static/google.png?width=160' },
// };

// export function SocialConnections() {
//   useWarmUpBrowser();
//   const { colorScheme } = useColorScheme();
//   const { startSSOFlow } = useSSO();

//   async function onGoogleLoginPress() {
//     try {
//       const { createdSessionId, setActive } = await startSSOFlow({
//         strategy: 'oauth_google',
//         redirectUrl: AuthSession.makeRedirectUri(),
//       });

//       if (createdSessionId && setActive) {
//         setActive({ session: createdSessionId });
//         return;
//       }
//     } catch (err) {
//       console.error(JSON.stringify(err, null, 2));
//     }
//   }

//   return (
//     <View className="gap-2 sm:flex-row sm:gap-3">
//       <Button
//         variant="outline"
//         size="lg"
//         className="sm:flex-1"
//         onPress={onGoogleLoginPress}>
//           <Text>Sign in with Google</Text>
//         <Image
//           className={cn('size-4')}
//           source={GOOGLE_STRATEGY.source}
//         />
//       </Button>
//     </View>
//   );
// }

// const useWarmUpBrowser = Platform.select({
//   web: () => {},
//   default: () => {
//     React.useEffect(() => {
//       void WebBrowser.warmUpAsync();
//       return () => {
//         void WebBrowser.coolDownAsync();
//       };
//     }, []);
//   },
// });

import * as React from 'react';
import { Image, Platform, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useSSO, type StartSSOFlowParams } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useColorScheme } from 'nativewind';

WebBrowser.maybeCompleteAuthSession();

type SocialConnectionStrategy = Extract<
  StartSSOFlowParams['strategy'],
  'oauth_google'
>;

const GOOGLE_STRATEGY = {
  type: 'oauth_google' as SocialConnectionStrategy,
  source: { uri: 'https://img.clerk.com/static/google.png?width=160' },
};

export function SocialConnections() {
  useWarmUpBrowser();
  const { colorScheme } = useColorScheme();
  const { startSSOFlow } = useSSO();

  const onGoogleLoginPress = async () => {
    try {
      // Make sure "scheme" matches the value in your app.json
      const redirectUri = AuthSession.makeRedirectUri({ scheme: 'stayvia' });

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: redirectUri,
      });

      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
      }
    } catch (err) {
      console.error('Google SSO error:', err);
    }
  };

  return (
    <View className="gap-2 sm:flex-row sm:gap-3">
      <Button
        variant="outline"
        size="lg"
        className="sm:flex-1 flex-row items-center justify-center"
        onPress={onGoogleLoginPress}
      >
        <Image
          source={GOOGLE_STRATEGY.source}
          className={cn('size-4 mr-2')}
        />
        <Text>Sign in with Google</Text>
      </Button>
    </View>
  );
}

const useWarmUpBrowser = Platform.select({
  web: () => {},
  default: () => {
    React.useEffect(() => {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }, []);
  },
});
