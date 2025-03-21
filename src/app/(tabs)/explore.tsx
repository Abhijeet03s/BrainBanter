import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText as Text } from '@/components/ui/typography/themed/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { GradientButton } from '@/components/ui/buttons/GradientButton';
import { featuredTopics, categories } from '@/constants/Explore';

export default function ExploreScreen() {
   const insets = useSafeAreaInsets();

   return (
      <View className="flex-1" style={{ paddingTop: insets.top }}>
         <ScrollView showsVerticalScrollIndicator={false} className="bg-gray-900" >
            <View className="px-6 pt-8 pb-4">
               <Text
                  className="text-white text-3xl font-bold py-4"
                  type="title"
                  style={{ color: '#FFFFFF' }}
               >
                  Explore Topics
               </Text>

               <Text className="text-gray-300 mb-6" style={{ color: '#D1D5DB' }}>
                  Discover trending debates and challenging ideas
               </Text>

               {/* Featured Topics */}
               <Text className="text-lg font-semibold mb-4" type="subtitle" style={{ color: '#FFFFFF' }}>
                  Featured Topics
               </Text>
               <View className="mb-8">
                  {featuredTopics.map((topic) => (
                     <TouchableOpacity key={topic.id} className="mb-4 active:opacity-90">
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
                                 onPress={() => { }}
                                 size="sm"
                                 colors={topic.gradient as [string, string]}
                              />
                           </View>
                        </BlurView>
                     </TouchableOpacity>
                  ))}
               </View>

               {/* Categories */}
               <Text className="text-lg font-semibold mb-4" type="subtitle" style={{ color: '#FFFFFF' }}>
                  Browse Categories
               </Text>
               <View className="flex-row flex-wrap justify-between">
                  {categories.map((category) => (
                     <TouchableOpacity key={category.id} className="w-[48%] mb-4">
                        <BlurView intensity={30} tint="dark" className="rounded-xl overflow-hidden border border-gray-800">
                           <View className="p-4 items-center">
                              <View
                                 className="w-12 h-12 rounded-full items-center justify-center mb-2"
                                 style={{ backgroundColor: `${category.color}30` }}
                              >
                                 <IconSymbol name={category.icon} size={24} color={category.color} />
                              </View>
                              <Text className="font-medium" style={{ color: '#FFFFFF' }}>{category.name}</Text>
                              <Text className="text-xs text-center mt-1" style={{ color: '#D1D5DB' }}>
                                 Explore topics in {category.name.toLowerCase()}
                              </Text>
                           </View>
                        </BlurView>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>
            <View className="h-16" />
         </ScrollView>
      </View>
   );
} 