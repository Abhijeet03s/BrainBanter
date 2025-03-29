import React, { useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { debateAPI } from '@/services/api';
import { DebateSession } from '@/types/debate';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { DebateCard } from '@/components/ui/cards/DebateCard';
import { GradientButton } from '@/components/ui/buttons/GradientButton';
import { useFocusEffect } from '@react-navigation/native';

export default function DebatesScreen() {
   const insets = useSafeAreaInsets();
   const [sessions, setSessions] = useState<DebateSession[]>([]);
   const [savedDebates, setSavedDebates] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();
   const [activeFilter, setActiveFilter] = useState<'all' | 'saved'>('all');

   useFocusEffect(
      useCallback(() => {
         fetchSessions();
         fetchSavedDebates();
         return () => {
         };
      }, [])
   );

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

   const fetchSavedDebates = async () => {
      try {
         const response = await debateAPI.getSavedDebates();
         setSavedDebates(response.savedDebates);
      } catch (error) {
         console.error('Failed to fetch saved debates:', error);
      }
   };

   const handleDeleteSession = async () => {
      fetchSessions();
   };

   const handleSaveSession = async () => {
      // Refresh both regular and saved debates
      fetchSessions();
      fetchSavedDebates();
   };

   // Convert saved debate format to standard debate session format
   const mapToDebateSession = (savedDebate: any): DebateSession => {
      return {
         ...savedDebate.debateSession,
         saved: {
            id: savedDebate.id,
            createdAt: savedDebate.createdAt
         }
      };
   };

   const renderSessionItem = ({ item }: { item: DebateSession }) => (
      <DebateCard
         session={item}
         onDelete={handleDeleteSession}
         onSave={handleSaveSession}
      />
   );

   const toggleFilter = (filter: 'all' | 'saved') => {
      setActiveFilter(filter);
   };

   const renderEmpty = () => {
      const isSavedFilter = activeFilter === 'saved';

      return (
         <View className="flex-1 justify-center items-center py-10">
            <View className="w-20 h-20 rounded-full bg-gray-800 items-center justify-center mb-4">
               <IconSymbol
                  name={isSavedFilter ? "bookmark" : "bubble.left.and.bubble.right"}
                  size={40}
                  color="#00A3FF"
               />
            </View>
            <Text className="text-gray-400 text-center mb-6" style={{ color: '#D1D5DB' }}>
               {isSavedFilter
                  ? 'You don\'t have any saved debates yet.'
                  : 'You don\'t have any debate sessions yet.'}
            </Text>
            {isSavedFilter ? (
               <TouchableOpacity onPress={() => toggleFilter('all')}>
                  <GradientButton
                     text="View All Debates"
                     size="md"
                     onPress={() => toggleFilter('all')}
                  />
               </TouchableOpacity>
            ) : (
               <TouchableOpacity>
                  <GradientButton
                     text="Start a Debate"
                     size="md"
                     onPress={() => router.push('/debate/new')}
                  />
               </TouchableOpacity>
            )}
         </View>
      );
   };

   if (loading) {
      return (
         <View className="flex-1 justify-center items-center bg-gray-900" style={{ paddingTop: insets.top }}>
            <ActivityIndicator size="large" color="#00A3FF" />
         </View>
      );
   }

   // Determine which data to display based on the active filter
   const displayData = activeFilter === 'all'
      ? sessions
      : savedDebates.map(mapToDebateSession);

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
                        className="w-10 h-10 items-center justify-center rounded-full bg-blue-500 active:bg-blue-600"
                     >
                        <IconSymbol
                           name="plus"
                           size={18}
                           color="white"
                        />
                     </TouchableOpacity>
                  </Link>
               </View>

               {/* Filter Tabs */}
               <View className="flex-row rounded-xl overflow-hidden mb-2 border border-gray-700">
                  <TouchableOpacity
                     className={`flex-1 py-2 px-4 ${activeFilter === 'all' ? 'bg-blue-500' : 'bg-gray-800'}`}
                     onPress={() => toggleFilter('all')}
                  >
                     <Text
                        className="text-center font-medium"
                        style={{
                           color: activeFilter === 'all' ? '#FFFFFF' : '#A0AEC0',
                           fontFamily: 'Poppins-Medium'
                        }}
                     >
                        All Debates
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     className={`flex-1 py-2 px-4 ${activeFilter === 'saved' ? 'bg-blue-500' : 'bg-gray-800'}`}
                     onPress={() => toggleFilter('saved')}
                  >
                     <Text
                        className="text-center font-medium"
                        style={{
                           color: activeFilter === 'saved' ? '#FFFFFF' : '#A0AEC0',
                           fontFamily: 'Poppins-Medium'
                        }}
                     >
                        Saved
                     </Text>
                  </TouchableOpacity>
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
                  data={displayData}
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