import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ThemedText as Text } from '@/components/ui/typography/themed/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { GradientButton } from '@/components/ui/buttons/GradientButton';
import { features } from '@/constants/Homepage';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);


  // Safe way to get username
  const getUserName = () => {
    if (!user) return 'User';

    // Get from user_metadata if available
    const metadata = (user as any).user_metadata;
    if (metadata?.full_name) return metadata.full_name;

    // Get from email
    const email = user.email;
    if (email) return email.split('@')[0];

    return 'User';
  };

  const userName = getUserName();

  return (
    <View className="flex-1" style={{
      paddingTop: insets.top,
    }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        className="bg-gray-900"
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Header */}
          <View className="px-6 pt-8 pb-4">
            <Text
              className="text-gray-400 mb-1"
              style={{ color: '#A1A1AA', fontSize: 18 }}
            >
              Welcome back,
            </Text>
            <Text
              className="text-white text-3xl font-bold py-4"
              type="title"
              style={{ color: '#FFFFFF' }}
            >
              {userName}
            </Text>
          </View>

          {/* Main Debate CTA */}
          <View className="px-5 py-3">
            <Link href="../debate/new" asChild>
              <TouchableOpacity className="active:opacity-90">
                <View className="overflow-hidden rounded-2xl border border-blue-700/30 shadow-lg">
                  <LinearGradient
                    colors={['#101935', '#162350']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute inset-0"
                  />
                  <View className="p-6">
                    <View className="flex-row justify-between items-center mb-6">
                      <View className="w-14 h-14 rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(74, 108, 247, 0.2)' }}>
                        <IconSymbol name="brain" size={32} color="#4A6CF7" />
                      </View>
                    </View>
                    <Text className="text-white text-2xl font-semibold mb-3" type="subtitle" style={{ color: '#FFFFFF' }}>Start a Debate</Text>
                    <Text className="text-gray-300 mb-5 leading-5" style={{ color: '#E2E8F0' }}>Challenge your thinking with an AI-powered debate on any topic
                    </Text>
                    <GradientButton
                      text="New Debate"
                      onPress={() => { }}
                      size="md"
                      colors={['#4A6CF7', '#2556E8']}
                      fullWidth
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          </View>

          {/* My Debates */}
          <View className="px-5 pt-5 pb-3">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-semibold" type="subtitle" style={{ color: '#FFFFFF' }}>My Debates</Text>
              <Link href="/(tabs)/debates" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-400" style={{ color: '#4A6CF7' }}>See All</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <Link href="/(tabs)/debates" asChild>
              <TouchableOpacity className="active:opacity-90">
                <View className="overflow-hidden rounded-2xl border border-blue-700/30 shadow-lg">
                  <BlurView intensity={25} tint="dark" className="p-6 items-center">
                    <View className="w-16 h-16 rounded-full bg-[#1E2A5A] items-center justify-center mb-4">
                      <IconSymbol name="bubble.left.and.bubble.right" size={32} color="#4A6CF7" />
                    </View>
                    <Text className="text-white font-semibold mb-2 text-lg" style={{ color: '#FFFFFF' }}>View Your Debates</Text>
                    <Text className="text-gray-300 text-center text-sm" style={{ color: '#E2E8F0' }}>
                      Browse all your active and completed debate sessions
                    </Text>
                  </BlurView>
                </View>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Features */}
          <View className="px-5 pt-8 pb-5">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white text-2xl font-bold" type="subtitle" style={{ color: '#FFFFFF' }}>Features</Text>
            </View>
            <View className="flex-column" style={{ gap: 5 }}>
              {features.map(feature => (
                <Link key={feature.id} href={feature.route as any} asChild>
                  <TouchableOpacity
                    className="mb-5 active:opacity-90">
                    <View className="p-[1px] rounded-2xl overflow-hidden border border-blue-700/30 shadow-lg">
                      <BlurView intensity={25} tint="dark" className="rounded-2xl">
                        <View className="p-5">
                          <View
                            className="w-12 h-12 rounded-xl mb-4 items-center justify-center"
                            style={{
                              backgroundColor: `${feature.colors[0]}15`,
                              borderWidth: 1,
                              borderColor: `${feature.colors[0]}30`,
                            }}
                          >
                            <IconSymbol name={feature.icon as any} size={24} color={feature.colors[0]} />
                          </View>
                          <Text className="text-white font-bold mb-2 text-lg" style={{ color: '#FFFFFF' }}>{feature.title}</Text>
                          <Text className="text-gray-300 text-sm leading-5" style={{ color: '#E2E8F0' }}>{feature.description}</Text>
                        </View>
                      </BlurView>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </View>
        </Animated.View>

        <View className="h-16" />
      </ScrollView>
    </View>
  );
}