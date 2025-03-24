import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { debateAPI } from '@/services/api';
import { ThemedText as Text } from '@/components/ui/typography/themed/ThemedText';
import { DebateMode } from '@/types/debate';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { GradientButton } from '@/components/ui/buttons/GradientButton';
import { debateModes } from '@/constants/Debates';

export default function NewDebateScreen() {
   const insets = useSafeAreaInsets();
   const [topic, setTopic] = useState('');
   const [mode, setMode] = useState<DebateMode>('creative');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const startDebate = async () => {
      if (!topic.trim()) {
         setError('Please enter a topic for your debate');
         return;
      }

      try {
         setLoading(true);
         setError(null);
         const response = await debateAPI.startDebateSession(topic, mode);

         // Navigate to the debate session
         router.push(`/debate/${response.session.id}`);
      } catch (error) {
         console.error('Failed to start debate:', error);
         setError('Failed to start the debate. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleClose = () => {
      router.back();
   };

   return (
      <View className="flex-1">
         {/* Header */}
         <BlurView intensity={30} className="w-full bg-gray-900" style={{ paddingTop: insets.top }}>
            <View className="flex-row justify-between items-center p-4 border-b border-gray-800/30">
               <TouchableOpacity onPress={handleClose}>
                  <Text className="text-blue-400 font-medium">Cancel</Text>
               </TouchableOpacity>
               <Text className="text-white font-semibold text-lg" type="subtitle">New Debate</Text>
               <TouchableOpacity
                  onPress={startDebate}
                  disabled={loading || !topic.trim()}
               >
                  <Text
                     className="font-semibold"
                     style={{
                        color: !topic.trim() ? '#5a5a5a' : '#00A3FF',
                        opacity: loading ? 0.5 : 1
                     }}
                  >
                     Start
                  </Text>
               </TouchableOpacity>
            </View>
         </BlurView>

         <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="px-4 py-2">
               <Text
                  className="text-lg font-bold"
                  type="title"
                  style={{ color: '#FFFFFF' }}
               >
                  Start a New Debate
               </Text>
               <Text
                  className="text-gray-400 mb-6"
                  style={{ color: '#D1D5DB' }}
               >
                  Select a topic and mode for your AI debate
               </Text>

               {/* Topic Input */}
               <Text
                  className="text-gray-300 mb-2"
                  style={{ color: '#E5E7EB' }}
               >
                  Debate Topic
               </Text>
               <View className="mb-6">
                  <LinearGradient
                     colors={['rgba(40,40,40,0.5)', 'rgba(20,20,20,0.5)']}
                     className="p-px rounded-xl"
                  >
                     <BlurView intensity={50} tint="dark" className="rounded-xl">
                        <TextInput
                           className="text-white p-4 min-h-12 rounded-xl"
                           placeholder="Enter a topic or question to debate..."
                           placeholderTextColor="#666"
                           value={topic}
                           onChangeText={setTopic}
                           multiline
                           style={{ color: '#FFFFFF' }}
                        />
                     </BlurView>
                  </LinearGradient>
               </View>

               {/* Mode Selection */}
               <Text
                  className="text-gray-300 mb-2"
                  style={{ color: '#E5E7EB' }}
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
                        <LinearGradient
                           colors={mode === debateMode.id ? debateMode.colors : ['#2A2A2A', '#1A1A1A']}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 1, y: 0 }}
                           className="p-px rounded-xl"
                        >
                           <BlurView
                              intensity={mode === debateMode.id ? 60 : 40}
                              tint="dark"
                              className="p-4 rounded-xl"
                           >
                              <View className="flex-row items-center">
                                 <View className="mr-3">
                                    <IconSymbol
                                       name={debateMode.icon as any}
                                       size={24}
                                       color={mode === debateMode.id ? debateMode.colors[0] : '#999'}
                                    />
                                 </View>
                                 <View className="flex-1">
                                    <Text
                                       className="font-medium text-base mb-1"
                                       style={{ color: mode === debateMode.id ? '#FFFFFF' : '#E5E7EB' }}
                                    >
                                       {debateMode.name}
                                    </Text>
                                    <Text
                                       className="text-sm"
                                       style={{ color: '#D1D5DB' }}
                                    >
                                       {debateMode.description}
                                    </Text>
                                 </View>
                                 {mode === debateMode.id && (
                                    <View className="h-6 w-6 rounded-full bg-blue-500 items-center justify-center">
                                       <IconSymbol name="checkmark" size={16} color="white" />
                                    </View>
                                 )}
                              </View>
                           </BlurView>
                        </LinearGradient>
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
            </View>
         </ScrollView>

         {loading && (
            <View className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
               <View className="bg-gray-800/80 p-6 rounded-2xl items-center">
                  <ActivityIndicator size="large" color="#00A3FF" />
                  <Text className="text-white mt-4">Starting debate...</Text>
               </View>
            </View>
         )}
      </View>
   );
} 