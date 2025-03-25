import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { debateAPI } from '@/services/api';
import { Message, DebateSession } from '@/types/debate';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView } from 'expo-blur';
import { GradientButton } from '@/components/ui/buttons/GradientButton';

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

   useEffect(() => {
      if (id) {
         fetchDebateSession(id);
      }
   }, [id]);

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
         const response = await debateAPI.sendMessage(id, newMessage);

         // Append the new messages to the existing messages
         setMessages(prevMessages => [...prevMessages, ...response.messages]);
         setNewMessage('');

         // Scroll to the bottom
         setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
         }, 100);
      } catch (error) {
         console.error('Failed to send message:', error);
         setError(error instanceof Error ? error : new Error('Failed to send your message'));
      } finally {
         setSending(false);
      }
   };

   const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
         hour: '2-digit',
         minute: '2-digit',
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

   const handleBack = () => {
      router.back();
   };

   const scrollToBottom = () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
   };

   if (error || !session) {
      return (
         <View className="flex-1 justify-center items-center bg-gray-900" style={{ paddingTop: insets.top }}>
            <View className="p-6 rounded-xl bg-red-900/20 border border-red-800 m-4">
               <Text className="text-center mb-4" style={{ color: '#F87171' }}>{error?.message || 'Session not found'}</Text>
               <GradientButton
                  text="Go Back"
                  onPress={handleBack}
                  size="md"
               />
            </View>
         </View>
      );
   }

   return (
      <KeyboardAvoidingView
         className="flex-1 bg-gray-900"
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         keyboardVerticalOffset={insets.bottom}
      >
         <Stack.Screen options={{
            title: session.title,
            headerShown: false
         }} />

         {/* Header */}
         <BlurView intensity={40} tint="dark" className="w-full">
            <View className="px-4 py-4 border-b border-gray-800/30" style={{ paddingTop: insets.top }}>
               <View className="flex-row items-center">
                  <TouchableOpacity
                     onPress={handleBack}
                     className="mr-4 h-10 w-10 items-center justify-center rounded-xl"
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  >
                     <IconSymbol name="chevron.left" size={22} color="#00A3FF" />
                  </TouchableOpacity>
                  <View className="flex-1">
                     <Text
                        className="font-semibold text-lg mb-1"
                        style={{
                           color: '#FFFFFF',
                           fontFamily: 'Poppins-SemiBold'
                        }}
                     >
                        {session.title}
                     </Text>
                     <View className="flex-row items-center">
                        {/* Mode pill */}
                        <View
                           className="rounded-full mr-2 px-3 py-1 flex-row items-center"
                           style={{
                              backgroundColor: `${getModeColor(session.mode)[0]}15`,
                              borderWidth: 1,
                              borderColor: getModeColor(session.mode)[0],
                           }}
                        >
                           <Text
                              className="text-xs font-medium"
                              style={{
                                 color: getModeColor(session.mode)[0],
                                 fontFamily: 'Poppins-Medium'
                              }}
                           >
                              {session.mode.charAt(0).toUpperCase() + session.mode.slice(1)}
                           </Text>
                        </View>

                        {/* Status indicator */}
                        <View
                           className="flex-row items-center rounded-full px-3 py-1"
                           style={{
                              backgroundColor: getStatusColor(session.status) + '15',
                              borderWidth: 1,
                              borderColor: getStatusColor(session.status)
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
                                 fontFamily: 'Poppins-Medium'
                              }}
                           >
                              {session.status.toUpperCase()}
                           </Text>
                        </View>
                     </View>
                  </View>
               </View>
            </View>
         </BlurView>

         {/* Message List */}
         <View className="flex-1 px-4 py-4">
            {error ? (
               <View className="flex-1 justify-center items-center">
                  <Text
                     className="text-center mb-4"
                     style={{ color: '#F87171' }}
                  >
                     Error loading debate
                  </Text>
                  <GradientButton
                     text="Go Back"
                     onPress={() => router.back()}
                     size="md"
                  />
               </View>
            ) : loading ? (
               <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#00A3FF" />
                  <Text
                     className="mt-4"
                     style={{
                        color: '#D1D5DB',
                        fontFamily: 'Lora-Regular'
                     }}
                  >
                     Loading debate...
                  </Text>
               </View>
            ) : (
               <>
                  <ScrollView
                     className="flex-1"
                     ref={scrollViewRef}
                     onContentSizeChange={() => scrollToBottom()}
                  >
                     {messages.map((msg, index) => (
                        <View key={index} className={`mb-4 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                           <View
                              style={{
                                 borderWidth: 1,
                                 borderColor: msg.sender === 'user' ? '#00A3FF' : 'rgba(255, 255, 255, 0.1)',
                                 borderRadius: 16,
                                 overflow: 'hidden',
                              }}
                           >
                              <BlurView
                                 intensity={msg.sender === 'user' ? 50 : 30}
                                 tint="dark"
                                 className="max-w-[80%] p-4 rounded-2xl"
                              >
                                 <Text
                                    style={{
                                       color: '#FFFFFF',
                                       fontFamily: msg.sender === 'user' ? 'Lora-Regular' : 'FiraCode-Regular',
                                       lineHeight: 22,
                                    }}
                                 >
                                    {msg.content}
                                 </Text>
                              </BlurView>
                           </View>
                        </View>
                     ))}
                  </ScrollView>
               </>
            )}
         </View>

         {/* Input Area */}
         <BlurView intensity={50} tint="dark">
            <View className="p-4 border-t border-gray-800/30">
               <View className="flex-row items-end">
                  <View className="flex-1 mr-3">
                     <BlurView
                        intensity={40}
                        tint="dark"
                        className="rounded-2xl"
                        style={{
                           borderWidth: 1,
                           borderColor: 'rgba(255, 255, 255, 0.1)',
                           borderRadius: 16
                        }}
                     >
                        <TextInput
                           className="p-4 min-h-10 rounded-2xl"
                           placeholder="Type your message..."
                           placeholderTextColor="#9CA3AF"
                           value={newMessage}
                           onChangeText={setNewMessage}
                           multiline
                           maxLength={500}
                           style={{
                              color: '#FFFFFF',
                              fontFamily: 'Lora-Regular',
                              maxHeight: 100,
                              fontSize: 16,
                              textAlignVertical: 'top'
                           }}
                        />
                     </BlurView>
                  </View>
                  <TouchableOpacity
                     onPress={sendMessage}
                     disabled={sending || !newMessage.trim()}
                     className={`h-12 w-12 items-center justify-center rounded-full ${sending || !newMessage.trim() ? 'opacity-50' : 'opacity-100'}`}
                     style={{
                        backgroundColor: sending || !newMessage.trim() ? '#2A2A2A' : '#00A3FF',
                        borderWidth: 1,
                        borderColor: sending || !newMessage.trim() ? 'rgba(255, 255, 255, 0.1)' : '#0072FF'
                     }}
                  >
                     {sending ? (
                        <ActivityIndicator size="small" color="#fff" />
                     ) : (
                        <IconSymbol name="arrow.up" size={20} color="white" />
                     )}
                  </TouchableOpacity>
               </View>
            </View>
         </BlurView>
      </KeyboardAvoidingView >
   );
} 