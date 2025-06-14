import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, ScrollView, TextInput, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { debateAPI } from '@/services/api';
import { DebateMode } from '@/types/debate';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { GradientButton } from '@/components/ui/buttons/GradientButton';
import { debateModes } from '@/constants/Debates';

export default function NewDebateScreen() {
   const insets = useSafeAreaInsets();
   const params = useLocalSearchParams<{ topic?: string; category?: string }>();
   const [topic, setTopic] = useState('');
   const [mode, setMode] = useState<DebateMode>('creative');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   // Set initial topic based on URL params
   useEffect(() => {
      if (params.topic) {
         setTopic(params.topic);
      }

      // Set appropriate mode based on category if provided
      if (params.category) {
         const categoryId = params.category;
         const matchingMode = debateModes.find(m => m.id === categoryId);
         if (matchingMode) {
            setMode(matchingMode.id);
         }
      }
   }, [params.topic, params.category]);

   const startDebate = async () => {
      if (!topic.trim()) {
         setError('Please enter a topic for your debate');
         return;
      }

      try {
         setLoading(true);
         setError(null);
         const response = await debateAPI.startDebateSession(topic, mode);

         if (!response?.session?.id) {
            throw new Error('Failed to create debate session');
         }

         // Clear the topic input
         setTopic('');

         // Navigate to the debate session
         router.push(`/debate/${response.session.id}`);
      } catch (error) {
         console.error('Failed to start debate:', error);
         setError('Failed to start the debate. Please try again.');

         // Still clear the topic even if there's an error
         setTopic('');
      } finally {
         setLoading(false);
      }
   };

   const handleBack = () => {
      router.back();
   };

   return (
      <View className="flex-1" style={{ paddingTop: insets.top }}>
         <BlurView intensity={30} tint="dark" className="w-full">
            <View className="px-6 pt-8 pb-4 border-b border-gray-800/30 bg-gray-900">
               <View className="mb-4">
                  <TouchableOpacity
                     onPress={handleBack}
                     className="h-10 w-10 items-center justify-center rounded-xl"
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  >
                     <IconSymbol name="chevron.left" size={22} color="#00A3FF" />
                  </TouchableOpacity>
               </View>

               <View>
                  <Text
                     className="text-white text-2xl font-semibold mb-2"
                     style={{ color: '#FFFFFF', fontFamily: 'Poppins' }}
                  >
                     Start a New Debate
                  </Text>
                  <Text
                     className="text-gray-300"
                     style={{ color: '#D1D5DB', fontFamily: 'Poppins' }}
                  >
                     Select a topic and mode for your AI debate
                  </Text>
               </View>
            </View>
         </BlurView>

         <ScrollView showsVerticalScrollIndicator={false} className="bg-gray-900">
            <View className="px-6 pt-6">
               {/* Topic Input */}
               <Text
                  style={{
                     fontFamily: 'Poppins-Medium',
                     color: '#E5E7EB',
                     fontSize: 16,
                     marginBottom: 8
                  }}
                  className="text-gray-300"
               >
                  Debate Topic
               </Text>
               <View className="mb-8 rounded-2xl">
                  <BlurView intensity={40} tint="dark">
                     <TextInput
                        className="text-white px-6 py-5 min-h-[100px] rounded-2xl"
                        placeholder="What would you like to debate about?"
                        placeholderTextColor="#9CA3AF"
                        value={topic}
                        onChangeText={setTopic}
                        multiline
                        style={{
                           fontFamily: 'Lora-Regular',
                           color: '#FFFFFF',
                           fontSize: 16,
                           lineHeight: 24,
                           textAlignVertical: 'top',
                           borderWidth: 1,
                           borderColor: 'rgba(255, 255, 255, 0.1)',
                           borderRadius: 12,
                           padding: 12
                        }}
                     />
                  </BlurView>
               </View>

               {/* Mode Selection */}
               <Text
                  className="text-gray-300 mb-2"
                  style={{ color: '#E5E7EB', fontSize: 16, fontFamily: 'Poppins-Medium' }}
               >
                  Debate Mode
               </Text>
               <View className="mb-8">
                  {debateModes.map((debateMode) => (
                     <TouchableOpacity
                        key={debateMode.id}
                        className={`mb-3 ${mode === debateMode.id ? 'opacity-100' : 'opacity-70'}`}
                        onPress={() => setMode(debateMode.id)}
                     >
                        <View
                           style={{
                              borderWidth: 1,
                              borderColor: mode === debateMode.id ? debateMode.colors[0] : 'rgba(255, 255, 255, 0.1)',
                              borderRadius: 16,
                              overflow: 'hidden',
                           }}
                        >
                           <BlurView
                              intensity={mode === debateMode.id ? 60 : 40}
                              tint="dark"
                              className="p-4 rounded-xl"
                              style={{
                                 padding: 18,
                                 backgroundColor: mode === debateMode.id ? `${debateMode.colors[0]}15` : 'rgba(30, 30, 30, 0.5)'
                              }}
                           >
                              <View className="flex-row items-center">
                                 <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl" style={{
                                    backgroundColor: mode === debateMode.id ? `${debateMode.colors[0]}15` : 'rgba(255, 255, 255, 0.05)'
                                 }}>
                                    <IconSymbol
                                       name={debateMode.icon as any}
                                       size={26}
                                       color={mode === debateMode.id ? debateMode.colors[0] : '#999'}
                                       style={{
                                          opacity: mode === debateMode.id ? 1 : 0.7
                                       }}
                                    />
                                 </View>
                                 <View className="flex-1">
                                    <Text
                                       className="font-medium text-base mb-1"
                                       style={{ color: mode === debateMode.id ? '#FFFFFF' : '#E5E7EB', fontSize: 16, fontFamily: 'Poppins-Medium' }}
                                    >
                                       {debateMode.name}
                                    </Text>
                                    <Text
                                       className="text-sm"
                                       style={{ color: '#D1D5DB', fontSize: 14, fontFamily: 'Poppins-Regular' }}
                                    >
                                       {debateMode.description}
                                    </Text>
                                 </View>
                              </View>
                           </BlurView>
                        </View>
                     </TouchableOpacity>
                  ))}
               </View>

               {/* Submit Button */}
               <GradientButton
                  text="Start Debate"
                  onPress={startDebate}
                  disabled={!topic.trim() || loading}
                  loading={loading}
                  fullWidth
                  size="lg"
               />

               <View className="h-16" />
            </View>
         </ScrollView>

         {loading && (
            <View className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-2xl ">
               <View className="bg-gray-800/80 p-16 rounded-2xl items-center">
                  <ActivityIndicator size="large" color="#00A3FF" />
                  <Text style={{ color: '#FFFFFF', fontFamily: 'Poppins-Medium' }} className="mt-4 text-lg">
                     Starting debate...
                  </Text>
               </View>
            </View>
         )}
      </View>
   );
} 