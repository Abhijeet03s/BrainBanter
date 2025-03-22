import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { DebateSession } from '@/types/debate';
import { debateAPI } from '@/services/api';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface DebateCardProps {
   session: DebateSession;
   onPress?: () => void;
   onDelete?: () => void;
}

export const DebateCard: React.FC<DebateCardProps> = ({ session, onPress, onDelete }) => {
   const [isDeleting, setIsDeleting] = useState(false);

   const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
         month: 'short',
         day: 'numeric',
         year: 'numeric',
      });
   };

   const getModeColor = (mode: string): [string, string] => {
      switch (mode) {
         case 'creative': return ['#4158D0', '#C850C0'];
         case 'business': return ['#0093E9', '#80D0C7'];
         case 'philosophy': return ['#8E2DE2', '#4A00E0'];
         case 'casual': return ['#00DBDE', '#FC00FF'];
         default: return ['#00A3FF', '#0072FF'];
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'active': return '#2EFF9A';
         case 'completed': return '#00A3FF';
         case 'archived': return '#8A8A8A';
         default: return '#00A3FF';
      }
   };

   const handleDelete = async () => {
      Alert.alert(
         "Delete Debate",
         "Are you sure you want to delete this debate? This action cannot be undone.",
         [
            {
               text: "Cancel",
               style: "cancel"
            },
            {
               text: "Delete",
               style: "destructive",
               onPress: async () => {
                  try {
                     setIsDeleting(true);
                     await debateAPI.deleteSession(session.id);
                     onDelete?.();
                  } catch (error) {
                     Alert.alert(
                        "Error",
                        "Failed to delete debate session. Please check your internet connection and try again.",
                        [{ text: "OK" }]
                     );
                     console.error('Delete session error:', error);
                  } finally {
                     setIsDeleting(false);
                  }
               }
            }
         ]
      );
   };

   const renderCard = () => (
      <View className="rounded-2xl overflow-hidden border border-gray-800/30">
         <LinearGradient
            colors={[
               'rgba(0, 163, 255, 0.08)',
               'rgba(138, 43, 226, 0.12)'
            ]}
            className="overflow-hidden"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
         >
            <View
               className="p-6 backdrop-blur-sm"
               style={{
                  backgroundColor: 'rgba(18, 18, 18, 0.85)'
               }}
            >
               <View className="flex-row justify-between items-center mb-4">
                  <Text
                     className="text-white text-xs font-medium"
                     style={{ fontFamily: 'Lora', fontSize: 12, color: getModeColor(session.mode)[0] }}
                  >
                     {session.mode.charAt(0).toUpperCase() + session.mode.slice(1)}
                  </Text>

                  <TouchableOpacity
                     onPress={handleDelete}
                     disabled={isDeleting}
                     className="p-2 rounded-full bg-red-500/10"
                  >
                     {isDeleting ? (
                        <ActivityIndicator size="small" color="#EF4444" />
                     ) : (
                        <IconSymbol name="trash" size={18} color="#EF4444" />
                     )}
                  </TouchableOpacity>
               </View>

               <Text
                  className="text-white font-bold text-2xl mb-3"
                  style={{
                     color: '#FFFFFF',
                     fontFamily: 'Poppins'
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
               >
                  {session.title}
               </Text>

               <View className="flex-row justify-between items-center mb-4">
                  <View
                     className="flex-row items-center"
                     style={{
                        backgroundColor: getStatusColor(session.status) + '15',
                        borderRadius: 20,
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                     }}
                  >
                     <View
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: getStatusColor(session.status) }}
                     />
                     <Text
                        className="text-xs font-medium"
                        style={{
                           color: getStatusColor(session.status),
                           fontFamily: 'Lora'
                        }}
                     >
                        {session.status.toUpperCase()}
                     </Text>
                  </View>

                  <Text
                     className="text-gray-400 text-sm"
                     style={{
                        color: '#9CA3AF',
                        fontFamily: 'Lora'
                     }}
                  >
                     {formatDate(session.createdAt)}
                  </Text>
               </View>

               <View className="mt-2">
                  <View className="flex-row items-center justify-center py-3 px-4 bg-gray-800/30 rounded-full">
                     <Text
                        className="text-white text-base font-medium mr-2"
                        style={{ fontFamily: 'Poppins' }}
                     >
                        View Details
                     </Text>
                     <IconSymbol name="chevron.right" size={16} color="#FFFFFF" />
                  </View>
               </View>
            </View>
         </LinearGradient>
      </View>
   );

   if (onPress) {
      return (
         <TouchableOpacity className="mb-4" onPress={onPress}>
            {renderCard()}
         </TouchableOpacity>
      );
   }

   return (
      <Link href={`/debate/${session.id}`} asChild>
         <TouchableOpacity className="mb-4">
            {renderCard()}
         </TouchableOpacity>
      </Link>
   );
}; 