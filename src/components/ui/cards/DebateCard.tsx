import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert, ActivityIndicator, Animated } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { DebateSession } from '@/types/debate';
import { debateAPI } from '@/services/api';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface DebateCardProps {
   session: DebateSession;
   onPress?: () => void;
   onDelete?: () => void;
   onSave?: () => void;
}

export const DebateCard: React.FC<DebateCardProps> = ({ session, onPress, onDelete, onSave }) => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [isSaved, setIsSaved] = useState(!!session.saved);
   const [savedId, setSavedId] = useState(session.saved?.id);
   const [showSavedFeedback, setShowSavedFeedback] = useState(false);

   // Animation values
   const scaleAnim = useRef(new Animated.Value(1)).current;

   useEffect(() => {
      if (showSavedFeedback) {
         // Play animation
         Animated.sequence([
            Animated.timing(scaleAnim, {
               toValue: 1.3,
               duration: 150,
               useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
               toValue: 1,
               duration: 150,
               useNativeDriver: true,
            }),
         ]).start(() => {
            // Reset feedback flag after animation completes
            setTimeout(() => {
               setShowSavedFeedback(false);
            }, 500);
         });
      }
   }, [showSavedFeedback]);

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

   const handleSaveDebate = async () => {
      try {
         setIsSaving(true);

         if (isSaved && savedId) {
            // Unsave the debate
            await debateAPI.removeSavedDebate(savedId);
            setIsSaved(false);
            setSavedId(undefined);
         } else {
            // Save the debate
            try {
               const response = await debateAPI.saveDebate(session.id);
               setIsSaved(true);
               setSavedId(response.savedDebate.id);
            } catch (error) {
               // If the error is "already saved", just set the UI to saved state
               if (error instanceof Error && error.message.includes('already saved')) {
                  // Get saved debates to find the correct savedId
                  const savedResponse = await debateAPI.getSavedDebates();
                  const savedDebate = savedResponse.savedDebates.find(
                     (sd: { id: string; debateSessionId: string }) => sd.debateSessionId === session.id
                  );

                  if (savedDebate) {
                     setIsSaved(true);
                     setSavedId(savedDebate.id);
                     setShowSavedFeedback(true);
                  }
               } else {
                  throw error; // Re-throw for other errors
               }
            }
         }

         // Notify parent component if callback exists
         if (onSave) onSave();
      } catch (error) {
         // Don't show alerts for "already saved" errors
         if (!(error instanceof Error && error.message.includes('already saved'))) {
            Alert.alert(
               "Error",
               "Failed to save/unsave debate. Please try again.",
               [{ text: "OK" }]
            );
         }
         console.error('Save/unsave debate error:', error);
      } finally {
         setIsSaving(false);
      }
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
               <View className="flex-row justify-between items-start mb-2">
                  <Text
                     className="text-white text-xs font-medium"
                     style={{ fontFamily: 'Lora', fontSize: 12, color: getModeColor(session.mode)[0] }}
                  >
                     {session.mode.charAt(0).toUpperCase() + session.mode.slice(1)}
                  </Text>

                  <View className="flex-row">
                     {/* Save/Bookmark Button */}
                     <TouchableOpacity
                        className="p-2 mr-2"
                        onPress={handleSaveDebate}
                        disabled={isSaving}
                     >
                        {isSaving ? (
                           <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                           <Animated.View style={{ transform: [{ scale: isSaved && showSavedFeedback ? scaleAnim : 1 }] }}>
                              <IconSymbol
                                 name={isSaved ? "bookmark.fill" : "bookmark"}
                                 size={18}
                                 color={isSaved ? "#00A3FF" : "#FFF"}
                              />
                           </Animated.View>
                        )}
                     </TouchableOpacity>

                     {/* Delete Button */}
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