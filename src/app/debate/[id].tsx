import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { debateAPI } from '@/services/api';
import { ThemedText as Text } from '@/components/ui/typography/themed/ThemedText';
import { Message, DebateSession } from '@/types/debate';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
         style={{ paddingTop: insets.top }}
      >
         {/* Header */}
         <BlurView intensity={30} tint="dark">
            <View className="p-4 border-b border-gray-800/30">
               <View className="flex-row items-center">
                  <TouchableOpacity onPress={handleBack} className="mr-3">
                     <IconSymbol name="chevron.left" size={22} color="#00A3FF" />
                  </TouchableOpacity>
                  <View className="flex-1">
                     <Text className="font-semibold text-lg" type="subtitle" style={{ color: '#FFFFFF' }}>
                        {session.title}
                     </Text>
                     <View className="flex-row items-center">
                        {/* Mode pill */}
                        <LinearGradient
                           colors={getModeColor(session.mode)}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 1, y: 0 }}
                           className="rounded-full mr-2 px-2 py-0.5"
                        >
                           <Text className="text-xs" style={{ color: '#FFFFFF' }}>
                              {session.mode.charAt(0).toUpperCase() + session.mode.slice(1)}
                           </Text>
                        </LinearGradient>

                        {/* Status indicator */}
                        <View
                           className="flex-row items-center rounded-full px-2 py-0.5"
                           style={{
                              backgroundColor: getStatusColor(session.status) + '20',
                              borderWidth: 1,
                              borderColor: getStatusColor(session.status)
                           }}
                        >
                           <View
                              className="w-2 h-2 rounded-full mr-1"
                              style={{ backgroundColor: getStatusColor(session.status) }}
                           />
                           <Text
                              className="text-xs"
                              style={{ color: getStatusColor(session.status) }}
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
         <View className="flex-1 p-4">
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
                  <Text className="mt-4" style={{ color: '#D1D5DB' }}>Loading debate...</Text>
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
                              className="max-w-[80%] p-3 rounded-2xl"
                              style={{
                                 backgroundColor: msg.sender === 'user' ? '#2C2C2E' : '#1C1C1E',
                                 borderColor: msg.sender === 'user' ? '#00A3FF' : '#4A4A4E',
                                 borderWidth: 1,
                              }}
                           >
                              <Text style={{ color: '#FFFFFF' }}>{msg.content}</Text>
                           </View>
                        </View>
                     ))}
                  </ScrollView>
               </>
            )}
         </View>

         {/* Input Area */}
         <BlurView intensity={70} tint="dark">
            <View className="p-3 border-t border-gray-800/30">
               <View className="flex-row items-end">
                  <View className="flex-1 mr-2">
                     <LinearGradient
                        colors={['rgba(40,40,40,0.5)', 'rgba(20,20,20,0.5)']}
                        className="p-px rounded-2xl"
                     >
                        <BlurView intensity={30} tint="dark" className="rounded-2xl">
                           <TextInput
                              className="p-3 min-h-10 rounded-2xl"
                              placeholder="Type your message..."
                              placeholderTextColor="#666"
                              value={newMessage}
                              onChangeText={setNewMessage}
                              multiline
                              maxLength={500}
                              style={{ maxHeight: 100, color: '#FFFFFF' }}
                           />
                        </BlurView>
                     </LinearGradient>
                  </View>
                  <TouchableOpacity
                     onPress={sendMessage}
                     disabled={sending || !newMessage.trim()}
                     className="mb-1"
                  >
                     <LinearGradient
                        colors={sending || !newMessage.trim() ? ['#404040', '#303030'] : ['#0072FF', '#00A3FF']}
                        className="w-10 h-10 items-center justify-center rounded-full"
                     >
                        {sending ? (
                           <ActivityIndicator size="small" color="#fff" />
                        ) : (
                           <IconSymbol name="arrow.up" size={20} color="white" />
                        )}
                     </LinearGradient>
                  </TouchableOpacity>
               </View>
            </View>
         </BlurView>
      </KeyboardAvoidingView>
   );
} 