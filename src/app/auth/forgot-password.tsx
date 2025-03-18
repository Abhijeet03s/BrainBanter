import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPasswordScreen() {
   const [email, setEmail] = useState('');
   const [loading, setLoading] = useState(false);
   const [submitted, setSubmitted] = useState(false);
   const { forgotPassword } = useAuth();
   const router = useRouter();

   const handleSubmit = async () => {
      if (!email) {
         Alert.alert('Please enter your email address');
         return;
      }

      setLoading(true);
      try {
         await forgotPassword(email);
         setSubmitted(true);
      } catch (error: any) {
         Alert.alert('Error', error.message || 'Failed to send reset email');
      } finally {
         setLoading(false);
      }
   };

   const navigateToLogin = () => {
      router.push('/auth/login');
   };

   return (
      <SafeAreaView className="flex-1 bg-gray-950" edges={['top', 'bottom', 'left', 'right']}>
         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' || Platform.OS === 'android' ? 'padding' : 'height'}
            className="flex-1"
         >
            <ScrollView
               className="flex-1 bg-gray-950"
               contentContainerStyle={{ flexGrow: 1 }}
               keyboardShouldPersistTaps="handled"
            >
               <LinearGradient
                  colors={['rgba(138, 43, 226, 0.05)', 'rgba(0, 163, 255, 0.05)']}
                  className="absolute top-0 left-0 right-0 bottom-0"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
               />

               <View className="flex-1 px-8 justify-center">
                  {/* Logo/App Icon */}
                  <View className="items-center mb-8">
                     <View className="w-20 h-20 bg-[#00A3FF] rounded-2xl items-center justify-center mb-4">
                        <Image
                           source={require('@/assets/images/icon.png')}
                           className="w-12 h-12"
                           resizeMode="contain"
                        />
                     </View>
                     <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-4xl font-bold text-white mb-1 text-center">
                        Reset Password
                     </Text>
                     <Text style={{ fontFamily: 'Lora-Regular' }} className="text-gray-300 mb-2 text-center">
                        {submitted
                           ? 'Check your email for reset instructions'
                           : 'Enter your email to receive a password reset link'}
                     </Text>
                  </View>

                  {!submitted ? (
                     <View className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800/50 shadow-lg mb-6">
                        <View className="mb-5">
                           <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-sm font-medium text-gray-300 mb-2">
                              Email
                           </Text>
                           <TextInput
                              style={{ fontFamily: 'Lora-Regular' }}
                              className="bg-gray-900 rounded-xl border border-gray-800 px-4 py-4 text-white"
                              onChangeText={(text: string) => setEmail(text)}
                              value={email}
                              placeholder="Enter your email address"
                              placeholderTextColor="#9CA3AF"
                              autoCapitalize="none"
                              keyboardType="email-address"
                              editable={!loading}
                           />
                        </View>

                        <TouchableOpacity
                           disabled={loading}
                           onPress={handleSubmit}
                           className={`py-4 px-4 rounded-xl items-center justify-center mb-4 ${loading ? 'bg-blue-700' : 'bg-[#00A3FF]'}`}
                        >
                           {loading ? (
                              <ActivityIndicator size="small" color="white" />
                           ) : (
                              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white font-bold text-base">
                                 Send Reset Link
                              </Text>
                           )}
                        </TouchableOpacity>
                     </View>
                  ) : (
                     <View className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800/50 shadow-lg mb-6">
                        <Text style={{ fontFamily: 'Lora-Regular' }} className="text-white mb-4 text-center">
                           If an account exists with that email, we've sent instructions on how to reset your password.
                        </Text>
                        <TouchableOpacity
                           onPress={navigateToLogin}
                           className="py-4 px-4 rounded-xl items-center justify-center mb-4 bg-[#00A3FF]"
                        >
                           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white font-bold text-base">
                              Return to Login
                           </Text>
                        </TouchableOpacity>
                     </View>
                  )}

                  <View className="flex-row justify-center">
                     <TouchableOpacity
                        className="p-2"
                        disabled={loading}
                        onPress={navigateToLogin}
                     >
                        <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-300">
                           Remember your password? <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2EFF9A] font-bold">Sign in</Text>
                        </Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </ScrollView>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
} 