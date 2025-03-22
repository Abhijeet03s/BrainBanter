import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { debateAPI } from '@/services/api';
import { DebateSession } from '@/types/debate';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { DebateCard } from '@/components/ui/cards/DebateCard';
import { GradientButton } from '@/components/ui/buttons/GradientButton';

export default function DebatesScreen() {
   const insets = useSafeAreaInsets();
   const [sessions, setSessions] = useState<DebateSession[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      fetchSessions();
   }, []);

   const fetchSessions = async () => {
      try {
         setLoading(true);
         const response = await debateAPI.getUserSessions();
         setSessions(response.sessions);
         setError(null);
      } catch (error) {
         console.error('Failed to fetch debate sessions:', error);
         setError('Failed to load your debate sessions. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteSession = async () => {
      // Refresh the sessions list after deletion
      fetchSessions();
   };

   const renderSessionItem = ({ item }: { item: DebateSession }) => (
      <DebateCard
         session={item}
         onDelete={handleDeleteSession}
      />
   );

   const renderEmpty = () => (
      <View className="flex-1 justify-center items-center py-10">
         <View className="w-20 h-20 rounded-full bg-gray-800 items-center justify-center mb-4">
            <IconSymbol name="bubble.left.and.bubble.right" size={40} color="#00A3FF" />
         </View>
         <Text className="text-gray-400 text-center mb-6" style={{ color: '#D1D5DB' }}>
            You don't have any debate sessions yet.
         </Text>
         <Link href="/debate/new" asChild>
            <TouchableOpacity>
               <GradientButton
                  text="Start a Debate"
                  size="md"
                  onPress={() => { }}
               />
            </TouchableOpacity>
         </Link>
      </View>
   );

   if (loading) {
      return (
         <View className="flex-1 justify-center items-center bg-gray-900" style={{ paddingTop: insets.top }}>
            <ActivityIndicator size="large" color="#00A3FF" />
         </View>
      );
   }

   return (
      <View className="flex-1" style={{ paddingTop: insets.top }}>
         <BlurView intensity={30} tint="dark" className="w-full">
            <View className="px-6 pt-8 pb-4 border-b border-gray-800/30 bg-gray-900">
               <View className="flex-row justify-between items-center">
                  <View className="px-2">
                     <Text
                        className="text-white text-3xl font-bold py-4"
                        style={{ color: '#FFFFFF', fontFamily: 'Poppins' }}
                     >
                        Your Debates
                     </Text>
                     <Text className="text-gray-300 mb-6" style={{ color: '#D1D5DB', fontFamily: 'Poppins' }}>
                        View and manage your debate sessions
                     </Text>
                  </View>
                  <Link href="/debate/new" asChild>
                     <TouchableOpacity
                        className="w-12 h-12 items-center justify-center rounded-full bg-blue-500 active:bg-blue-600"
                     >
                        <IconSymbol
                           name="plus"
                           size={24}
                           color="white"
                        />
                     </TouchableOpacity>
                  </Link>
               </View>
            </View>
         </BlurView>

         <View className="flex-1 px-4 bg-gray-900">
            {error ? (
               <View className="flex-1 justify-center items-center py-10">
                  <View className="p-6 rounded-xl bg-red-900/20 border border-red-800 max-w-md">
                     <Text className="text-red-400 text-center mb-4" style={{ color: '#F87171' }}>{error}</Text>
                     <GradientButton
                        text="Try Again"
                        onPress={fetchSessions}
                     />
                  </View>
               </View>
            ) : (
               <FlatList
                  data={sessions}
                  renderItem={renderSessionItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={renderEmpty}

               />
            )}
         </View>
      </View>
   );
} 