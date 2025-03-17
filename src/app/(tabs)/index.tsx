import React from 'react';
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { ThemedText } from '../../components/ui/typography/themed/ThemedText';

export default function HomeTab() {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert(
        'Sign Out Error',
        'There was a problem signing you out. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0284c7" />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-5 items-center justify-center">
        <ThemedText className="text-2xl font-bold mb-2.5" type="title" fontFamily="poppins" fontWeight="medium" style={{ marginBottom: 10 }}>
          Welcome to BrainBanter
        </ThemedText>

        <ThemedText className="text-lg mb-8 opacity-70" type="subtitle" fontFamily="lora" style={{ marginBottom: 32, opacity: 0.7 }}>
          Your AI Debate Partner
        </ThemedText>

        <View className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg w-full">
          <ThemedText>Logged in as: {user?.email || 'Not available'}</ThemedText>
          <ThemedText>User ID: {user?.id || 'Not available'}</ThemedText>
        </View>

        <TouchableOpacity
          className={`${isSigningOut ? 'bg-gray-400' : 'bg-blue-600'} p-4 rounded-lg w-full items-center`}
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <ThemedText style={{ color: 'white' }} fontFamily="poppins" fontWeight="semibold">
              Sign Out
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}