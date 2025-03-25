import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { GradientButton } from '@/components/ui/buttons/GradientButton';
import { featuredTopics, categories } from '@/constants/Explore';
import { LinearGradient } from 'expo-linear-gradient';

export default function ExploreScreen() {
   const insets = useSafeAreaInsets();

   const handleStartDebate = (topicTitle: string) => {
      router.push({
         pathname: '/debate/new',
         params: {
            topic: topicTitle
         }
      });
   };

   const handleCategoryPress = (categoryId: string) => {
      // Navigate to filtered view of this category
      router.push({
         pathname: '/debate/new',
         params: {
            category: categoryId
         }
      });
   };

   return (
      <View className="flex-1" style={{ paddingTop: insets.top }}>
         <BlurView intensity={30} tint="dark" className="w-full">
            <View className="px-6 pt-8 pb-4 border-b border-gray-800/30 bg-gray-900">
               <Text
                  className="text-white text-3xl font-bold py-4"
                  style={{ color: '#FFFFFF', fontFamily: 'Poppins' }}
               >
                  Explore Topics
               </Text>
               <Text className="text-gray-300 mb-6" style={{ color: '#D1D5DB', fontFamily: 'Poppins' }}>
                  Discover trending debates and challenging ideas
               </Text>
            </View>
         </BlurView>

         <ScrollView showsVerticalScrollIndicator={false} className="bg-gray-900" >
            <View className="px-6 pt-6 pb-12">
               {/* Featured Topics */}
               <Text className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                  Featured Topics
               </Text>
               <View className="mb-8">
                  {featuredTopics.map((topic) => (
                     <TouchableOpacity
                        key={topic.id}
                        className="mb-4 active:opacity-90"
                        onPress={() => handleStartDebate(topic.title)}
                     >
                        <BlurView intensity={30} tint="dark" className="rounded-xl overflow-hidden border border-gray-800">
                           <View className="p-5">
                              <View className="flex-row items-center mb-3">
                                 <View
                                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                    style={{ backgroundColor: `${topic.gradient[0]}30` }}
                                 >
                                    <IconSymbol name={topic.icon} size={20} color={topic.gradient[0]} />
                                 </View>
                                 <Text className="font-bold text-lg" style={{ color: '#FFFFFF' }}>{topic.title}</Text>
                              </View>
                              <Text className="text-sm mb-4" style={{ color: '#E5E7EB' }}>{topic.description}</Text>
                              <GradientButton
                                 text="Start Debate"
                                 onPress={() => handleStartDebate(topic.title)}
                                 size="sm"
                                 colors={topic.gradient as [string, string]}
                              />
                           </View>
                        </BlurView>
                     </TouchableOpacity>
                  ))}
               </View>

               {/* Debate Modes */}
               <Text className="text-xl font-semibold mb-4" style={{ color: '#FFFFFF' }}>
                  Debate Modes
               </Text>
               <View className="flex-row flex-wrap justify-between">
                  {categories.map((category) => (
                     <TouchableOpacity
                        key={category.id}
                        className="w-[48%] mb-5"
                        onPress={() => handleCategoryPress(category.id)}
                        style={{ shadowColor: category.color, shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } }}
                     >
                        <View
                           className="rounded-2xl overflow-hidden border border-gray-800/30"
                           style={{ backgroundColor: 'rgba(18, 18, 18, 0.85)' }}
                        >
                           <View className="p-4 items-center py-6">
                              <View
                                 className="w-12 h-12 rounded-lg overflow-hidden mb-4 items-center justify-center"
                                 style={{ backgroundColor: `${category.color}20` }}
                              >
                                 <LinearGradient
                                    colors={category.gradient as [string, string]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                       width: '100%',
                                       height: '100%',
                                       position: 'absolute',
                                    }}
                                 />
                                 <IconSymbol
                                    name={category.icon}
                                    size={22}
                                    color="#FFFFFF"
                                 />
                              </View>
                              <Text
                                 className="font-semibold text-base mb-2 text-center text-white"
                                 style={{ fontFamily: 'Poppins' }}
                              >
                                 {category.name}
                              </Text>
                              <Text
                                 className="text-xs text-center text-gray-300"
                                 style={{ lineHeight: 16 }}
                              >
                                 {category.id === 'creative' && 'Brainstorming and lateral thinking'}
                                 {category.id === 'business' && 'Strategic and data-driven discussions'}
                                 {category.id === 'philosophy' && 'Ethical and conceptual debates'}
                                 {category.id === 'casual' && 'Light, friendly argumentation'}
                              </Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>
            <View className="h-16" />
         </ScrollView>
      </View>
   );
} 