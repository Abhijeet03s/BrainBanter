import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, ScrollView, Text, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { debateAPI } from '@/services/api';
import { Message, DebateSession } from '@/types/debate';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView } from 'expo-blur';
import { GradientButton } from '@/components/ui/buttons/GradientButton';
import { MessageBubble } from '@/components/ui/chat/MessageBubble';
import { TypingIndicator } from '@/components/ui/chat/TypingIndicator';

export default function DebateScreen() {
   const { id } = useLocalSearchParams<{ id: string }>();
   const insets = useSafeAreaInsets();
   const [session, setSession] = useState<DebateSession | null>(null);
   const [messages, setMessages] = useState<Message[]>([]);
   const [newMessage, setNewMessage] = useState('');
   const [loading, setLoading] = useState(true);
   const [sending, setSending] = useState(false);
   const [error, setError] = useState<Error | null>(null);
   const scrollViewRef = useRef<ScrollView>(null);
   const [isSaved, setIsSaved] = useState(false);
   const [savedId, setSavedId] = useState<string | undefined>();
   const [isSaving, setIsSaving] = useState(false);
   const [showSavedFeedback, setShowSavedFeedback] = useState(false);
   const [isTyping, setIsTyping] = useState(false);

   // Animation values
   const scaleAnim = useRef(new Animated.Value(1)).current;
   const fadeAnim = useRef(new Animated.Value(0)).current;
   const slideAnim = useRef(new Animated.Value(50)).current;

   useEffect(() => {
      if (id) {
         fetchDebateSession(id);
      }
   }, [id]);

   useEffect(() => {
      if (session?.saved) {
         setIsSaved(true);
         setSavedId(session.saved.id);
      } else {
         setIsSaved(false);
         setSavedId(undefined);
      }
   }, [session]);

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

   // Animate messages on load
   useEffect(() => {
      if (messages.length > 0) {
         Animated.parallel([
            Animated.timing(fadeAnim, {
               toValue: 1,
               duration: 600,
               useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
               toValue: 0,
               duration: 600,
               useNativeDriver: true,
            }),
         ]).start();
      }
   }, [messages]);

   const fetchDebateSession = async (sessionId: string) => {
      try {
         setLoading(true);
         setError(null);
         const response = await debateAPI.getDebateSession(sessionId);
         setSession(response.session);
         setMessages(response.session.messages || []);
      } catch (error) {
         console.error('Failed to fetch debate session:', error);
         setError(error instanceof Error ? error : new Error('Failed to load the debate session'));
      } finally {
         setLoading(false);
      }
   };

   const sendMessage = async () => {
      if (!newMessage.trim() || !id) return;

      try {
         setSending(true);
         setIsTyping(true);

         // Add user message immediately for better UX
         const userMessage: Message = {
            id: `temp-${Date.now()}`,
            debateSessionId: id,
            content: newMessage,
            sender: 'user',
            createdAt: new Date().toISOString()
         };
         setMessages(prevMessages => [...prevMessages, userMessage]);
         setNewMessage('');

         const response = await debateAPI.sendMessage(id, newMessage);

         // Remove the temporary user message and add the actual response
         setMessages(prevMessages => {
            const withoutTemp = prevMessages.slice(0, -1);
            return [...withoutTemp, ...response.messages];
         });

         // Scroll to the bottom
         setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
         }, 100);
      } catch (error) {
         console.error('Failed to send message:', error);
         setError(error instanceof Error ? error : new Error('Failed to send your message'));
         setMessages(prevMessages => prevMessages.slice(0, -1));
         setNewMessage(newMessage);
      } finally {
         setSending(false);
         setIsTyping(false);
      }
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

   const handleBack = () => {
      router.back();
   };

   const scrollToBottom = () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
   };

   const handleSaveDebate = async () => {
      if (!id) return;

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
               const response = await debateAPI.saveDebate(id);
               setIsSaved(true);
               setSavedId(response.savedDebate.id);
            } catch (error) {
               // If the error is "already saved", just set the UI to saved state
               if (error instanceof Error && error.message.includes('already saved')) {
                  // Get saved debates to find the correct savedId
                  const savedResponse = await debateAPI.getSavedDebates();
                  const savedDebate = savedResponse.savedDebates.find(
                     (sd: { id: string; debateSessionId: string }) => sd.debateSessionId === id
                  );

                  if (savedDebate) {
                     setIsSaved(true);
                     setSavedId(savedDebate.id);
                     setShowSavedFeedback(true);
                  }
               } else {
                  console.error('Error saving debate:', error);
               }
            }
         }
      } catch (error) {
         console.error('Error saving/unsaving debate:', error);
      } finally {
         setIsSaving(false);
      }
   };

   if (loading) {
      return (
         <View className="flex-1 justify-center items-center bg-gray-900" style={{ paddingTop: insets.top }}>
            <View className="items-center">
               <View
                  className="w-20 h-20 rounded-full items-center justify-center mb-6"
                  style={{ backgroundColor: '#00A3FF20' }}
               >
                  <ActivityIndicator size="large" color="#00A3FF" />
               </View>
               <Text
                  className="text-xl font-semibold mb-2"
                  style={{
                     color: '#FFFFFF',
                     fontFamily: 'Poppins-SemiBold'
                  }}
               >
                  Loading Debate
               </Text>
               <Text
                  style={{
                     color: '#9CA3AF',
                     fontFamily: 'Lora-Regular',
                     textAlign: 'center',
                  }}
               >
                  Preparing your intellectual conversation...
               </Text>
            </View>
         </View>
      );
   }

   if (error || (!session && !loading)) {
      return (
         <View className="flex-1 justify-center items-center bg-gray-900" style={{ paddingTop: insets.top }}>
            <BlurView intensity={40} tint="dark" className="rounded-2xl overflow-hidden border border-red-500/30 m-6">
               <View className="p-8 items-center">
                  <View
                     className="w-16 h-16 rounded-full items-center justify-center mb-4"
                     style={{ backgroundColor: '#EF444420' }}
                  >
                     <IconSymbol name="exclamationmark.triangle" size={32} color="#EF4444" />
                  </View>
                  <Text
                     className="text-xl font-semibold mb-2 text-center"
                     style={{ color: '#EF4444', fontFamily: 'Poppins-SemiBold' }}
                  >
                     Oops! Something went wrong
                  </Text>
                  <Text
                     className="text-center mb-6"
                     style={{ color: '#9CA3AF', fontFamily: 'Lora-Regular' }}
                  >
                     {error?.message || 'Session not found'}
                  </Text>
                  <GradientButton
                     text="Go Back"
                     onPress={handleBack}
                     size="md"
                     colors={['#EF4444', '#DC2626']}
                  />
               </View>
            </BlurView>
         </View>
      );
   }

   const debate = session as DebateSession;

   return (
      <>
         <StatusBar style="dark" />
         <View className="flex-1 bg-white">
            {/* Light status bar area */}
            <View className="bg-white" style={{ height: insets.top }} />

            <Stack.Screen
               options={{
                  title: debate?.title || 'Debate',
                  headerShown: false,
               }}
            />

            {/* Fixed Header with consistent dark background */}
            <View className="bg-gray-900 border-b border-gray-800/50">
               <View className="px-6 pt-4 pb-4">
                  <View className="flex-row items-center justify-between mb-4">
                     <TouchableOpacity
                        onPress={handleBack}
                        className="h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                     >
                        <IconSymbol name="chevron.left" size={20} color="#00A3FF" />
                     </TouchableOpacity>

                     <TouchableOpacity
                        onPress={handleSaveDebate}
                        disabled={isSaving}
                        className="h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                     >
                        {isSaving ? (
                           <ActivityIndicator size="small" color="#00A3FF" />
                        ) : (
                           <Animated.View style={{ transform: [{ scale: isSaved && showSavedFeedback ? scaleAnim : 1 }] }}>
                              <IconSymbol
                                 name={isSaved ? "bookmark.fill" : "bookmark"}
                                 size={20}
                                 color={isSaved ? "#00A3FF" : "#9CA3AF"}
                              />
                           </Animated.View>
                        )}
                     </TouchableOpacity>
                  </View>

                  <View>
                     <Text
                        className="text-white text-xl font-bold mb-2"
                        style={{
                           color: '#FFFFFF',
                           fontFamily: 'Poppins-Bold',
                           fontSize: 20,
                           lineHeight: 28,
                        }}
                        numberOfLines={2}
                     >
                        {debate.title}
                     </Text>
                     <View className="flex-row items-center">
                        {/* Mode pill */}
                        <Text
                           className="rounded-full mr-3 px-3 py-1"
                           style={{
                              backgroundColor: getModeColor(debate.mode)[0],
                              borderWidth: 1,
                              borderColor: getModeColor(debate.mode)[1]
                           }}
                        >
                           <Text
                              className="text-xs font-bold"
                              style={{
                                 color: '#FFFFFF',
                                 fontFamily: 'Poppins-Bold'
                              }}
                           >
                              {debate.mode.charAt(0).toUpperCase() + debate.mode.slice(1)}
                           </Text>
                        </Text>

                        {/* Status indicator */}
                        <View
                           className="flex-row items-center rounded-full px-3 py-1"
                           style={{
                              backgroundColor: getStatusColor(debate.status) + '20',
                              borderWidth: 1,
                              borderColor: getStatusColor(debate.status)
                           }}
                        >
                           <View
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: getStatusColor(debate.status) }}
                           />
                           <Text
                              className="text-xs font-bold"
                              style={{
                                 color: getStatusColor(debate.status),
                                 fontFamily: 'Poppins-Bold'
                              }}
                           >
                              {debate.status.toUpperCase()}
                           </Text>
                        </View>
                     </View>
                  </View>
               </View>
            </View>

            {/* Message List */}
            <KeyboardAvoidingView
               className="flex-1"
               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
               keyboardVerticalOffset={insets.bottom}
            >
               <View className="flex-1 bg-gray-900">
                  <ScrollView
                     className="flex-1 px-4 py-4"
                     ref={scrollViewRef}
                     onContentSizeChange={() => scrollToBottom()}
                     showsVerticalScrollIndicator={false}
                     contentContainerStyle={{ paddingBottom: 20 }}
                  >
                     {messages.map((msg, index) => (
                        <MessageBubble
                           key={msg.id || index}
                           message={msg}
                           index={index}
                        />
                     ))}
                     <TypingIndicator isVisible={isTyping} />
                  </ScrollView>
               </View>

               {/* Input Area */}
               <View className="bg-gray-900 border-t border-gray-800/50">
                  <View
                     className="px-4 py-4"
                     style={{ paddingBottom: Math.max(insets.bottom, 16) }}
                  >
                     <View className="flex-row items-end gap-3">
                        <View className="flex-1">
                           <View
                              style={{
                                 borderRadius: 24,
                                 borderWidth: 1,
                                 borderColor: newMessage.trim() ? '#00A3FF' : 'rgba(255, 255, 255, 0.2)',
                                 backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                 overflow: 'hidden',
                              }}
                           >
                              <TextInput
                                 className="px-4 py-3 min-h-12"
                                 placeholder="Share your thoughts..."
                                 placeholderTextColor="#6B7280"
                                 value={newMessage}
                                 onChangeText={setNewMessage}
                                 multiline
                                 maxLength={1000}
                                 style={{
                                    color: '#FFFFFF',
                                    fontFamily: 'Lora-Regular',
                                    maxHeight: 100,
                                    fontSize: 16,
                                    lineHeight: 20,
                                    textAlignVertical: 'top'
                                 }}
                              />
                           </View>
                        </View>

                        <TouchableOpacity
                           onPress={sendMessage}
                           disabled={sending || !newMessage.trim()}
                           style={{
                              width: 48,
                              height: 48,
                              borderRadius: 24,
                              backgroundColor: newMessage.trim() ? '#00A3FF' : 'rgba(255, 255, 255, 0.1)',
                              justifyContent: 'center',
                              alignItems: 'center',
                           }}
                        >
                           {sending ? (
                              <ActivityIndicator size="small" color="#fff" />
                           ) : (
                              <IconSymbol
                                 name="arrow.up"
                                 size={20}
                                 color={newMessage.trim() ? "white" : "#6B7280"}
                              />
                           )}
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>
            </KeyboardAvoidingView>
         </View>
      </>
   );
} 