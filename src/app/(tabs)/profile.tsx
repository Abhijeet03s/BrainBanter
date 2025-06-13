import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { getUserDisplayName } from '@/lib/utils';

export default function ProfileScreen() {
   const insets = useSafeAreaInsets();
   const { user, signOut } = useAuth();
   const router = useRouter();
   const [isLoggingOut, setIsLoggingOut] = useState(false);

   const userName = getUserDisplayName(user);

   // Handle logout
   const handleLogout = async () => {
      try {
         setIsLoggingOut(true);
         await signOut();
         router.replace('/auth/login');
      } catch (error) {
         Alert.alert('Error', 'Failed to logout. Please try again.');
         console.error('Logout error:', error);
      } finally {
         setIsLoggingOut(false);
      }
   };

   return (
      <View className="flex-1" style={{ paddingTop: insets.top }}>
         <BlurView intensity={30} tint="dark" className="w-full">
            <View className="px-6 py-8 bg-gray-900 border-b border-gray-800/30">
               <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Poppins' }}>
                  Profile
               </Text>
            </View>
         </BlurView>

         <View className="px-6 py-8 bg-gray-900 flex-1">
            {/* User Info Card */}
            <View className="mb-8 rounded-xl overflow-hidden border border-blue-700/30">
               <BlurView intensity={25} tint="dark" className="p-6">
                  <View className="items-center mb-4">
                     <View className="h-24 w-24 rounded-full bg-gray-800/60 items-center justify-center mb-4 border-2 border-blue-500/30">
                        <Text className="text-white text-3xl font-bold">
                           {userName.charAt(0).toUpperCase()}
                        </Text>
                     </View>
                     <Text className="text-white text-xl font-bold mb-1" style={{ fontFamily: 'Poppins' }}>
                        {userName}
                     </Text>
                     {user?.email && (
                        <Text className="text-gray-400 text-sm">
                           {user.email}
                        </Text>
                     )}
                  </View>
               </BlurView>
            </View>

            {/* Account Settings Section */}
            <View className="mb-8">
               <Text className="text-white text-lg font-semibold mb-4">
                  Account Settings
               </Text>
               <View className="rounded-xl overflow-hidden border border-blue-700/30">
                  <BlurView intensity={25} tint="dark">
                     {/* Logout Button */}
                     <TouchableOpacity
                        onPress={handleLogout}
                        disabled={isLoggingOut}
                        className="p-4 flex-row items-center justify-between"
                     >
                        <View className="flex-row items-center">
                           <Text className="text-white text-base">Logout</Text>
                        </View>
                        {isLoggingOut ? (
                           <ActivityIndicator size="small" color="#FF6B6B" />
                        ) : (
                           <IconSymbol name="arrow.right.square" size={22} color="#FF6B6B" />
                        )}
                     </TouchableOpacity>
                  </BlurView>
               </View>
            </View>

            {/* Version Info */}
            <View className="items-center mt-auto pt-10">
               <Text className="text-gray-500 text-xs">
                  BrainBanter v1.0.0
               </Text>
            </View>
         </View>
      </View>
   );
} 