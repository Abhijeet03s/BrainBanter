import React, { useState } from 'react'
import { Alert, View, TextInput, TouchableOpacity, ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import { AuthProps } from '@/types/auth'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

export default function Auth({ mode = 'login' }: AuthProps) {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [username, setUsername] = useState('')
   const [loading, setLoading] = useState(false)
   const [passwordVisible, setPasswordVisible] = useState(false)
   const router = useRouter()
   const { signIn, signUp } = useAuth()

   async function signInWithEmail() {
      if (!email || !password) {
         Alert.alert('Please enter both email and password')
         return
      }

      setLoading(true)
      try {
         await signIn(email, password)
         router.replace('/(tabs)')
      } catch (error: any) {
         Alert.alert('Error', error.message || 'Failed to sign in')
      } finally {
         setLoading(false)
      }
   }

   async function signUpWithEmail() {
      if (!email || !password || (mode === 'register' && !username)) {
         Alert.alert('Please fill in all fields')
         return
      }

      setLoading(true)
      try {
         await signUp(username, email, password)
         Alert.alert('Success', 'Account created successfully!')
         router.replace('/auth/login')
      } catch (error: any) {
         Alert.alert('Error', error.message || 'Failed to sign up')
      } finally {
         setLoading(false)
      }
   }

   const handleSubmit = () => {
      if (mode === 'login') {
         signInWithEmail()
      } else {
         signUpWithEmail()
      }
   }

   const navigateToRegister = () => {
      router.push('/auth/register')
   }

   const navigateToLogin = () => {
      router.push('/auth/login')
   }

   const navigateToForgotPassword = () => {
      router.push('/auth/forgot-password')
   }

   const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible)
   }

   return (
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
               {/* Logo/App Icon  */}
               <View className="items-center mb-8">
                  <View className="w-20 h-20 rounded-2xl overflow-hidden mb-6 shadow-lg"
                     style={{
                        shadowColor: '#00A3FF',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.7,
                        shadowRadius: 10,
                        elevation: 10
                     }}>
                     <Image
                        source={require('@/assets/images/bb-logo.png')}
                        className="w-full h-full"
                        resizeMode="cover"
                     />
                  </View>

                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-4xl font-bold text-white mb-1 text-center">
                     {mode === 'login' ? 'Welcome' : 'Join BrainBanter'}
                  </Text>
                  <Text style={{ fontFamily: 'Lora-Regular' }} className="text-gray-300 mb-2 text-center">
                     {mode === 'login'
                        ? 'Challenge your thinking with AI-powered debates'
                        : 'Create an account to start intellectual conversations'}
                  </Text>
               </View>

               {/* Form Fields */}
               <View className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800/50 shadow-lg mb-6">
                  {mode === 'register' && (
                     <View className="mb-5">
                        <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-sm font-medium text-gray-300 mb-2">
                           Username <Text style={{ color: '#ff4040' }}>*</Text>
                        </Text>
                        <TextInput
                           style={{ fontFamily: 'Lora-Regular' }}
                           className="bg-gray-900 rounded-xl border border-gray-800 px-4 py-4 text-white"
                           onChangeText={(text: string) => setUsername(text)}
                           value={username}
                           placeholder="Choose a unique username"
                           placeholderTextColor="#9CA3AF"
                           autoCapitalize="none"
                           editable={!loading}
                        />
                     </View>
                  )}

                  <View className="mb-5">
                     <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-sm font-medium text-gray-300 mb-2">
                        Email {mode === 'register' && <Text style={{ color: '#ff4040' }}>*</Text>}
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

                  <View className="mb-6">
                     <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-sm font-medium text-gray-300 mb-2">
                        Password {mode === 'register' && <Text style={{ color: '#ff4040' }}>*</Text>}
                     </Text>
                     <View className="relative flex-row bg-gray-900 rounded-xl border border-gray-800">
                        <TextInput
                           style={{ fontFamily: 'Lora-Regular', flex: 1 }}
                           className="px-4 py-4 text-white"
                           onChangeText={(text: string) => setPassword(text)}
                           value={password}
                           secureTextEntry={!passwordVisible}
                           placeholder="Enter your password"
                           placeholderTextColor="#9CA3AF"
                           autoCapitalize="none"
                           editable={!loading}
                        />
                        <TouchableOpacity
                           onPress={togglePasswordVisibility}
                           className="pr-4 justify-center"
                           disabled={loading}
                        >
                           <Ionicons
                              name={passwordVisible ? "eye-off" : "eye"}
                              size={20}
                              color={loading ? "#666" : "#9CA3AF"}
                           />
                        </TouchableOpacity>
                     </View>
                  </View>

                  {/* Sign in button */}
                  <TouchableOpacity
                     disabled={loading}
                     onPress={handleSubmit}
                     className={`py-4 px-4 rounded-xl items-center justify-center mb-4 ${loading ? 'bg-blue-700' : 'bg-[#00A3FF]'}`}
                  >
                     {loading ? (
                        <ActivityIndicator size="small" color="white" />
                     ) : (
                        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white font-bold text-base">
                           {mode === 'login' ? 'Sign In' : 'Create Account'}
                        </Text>
                     )}
                  </TouchableOpacity>

                  {mode === 'login' && (
                     <TouchableOpacity
                        className="items-end mb-2"
                        onPress={navigateToForgotPassword}
                        disabled={loading}
                     >
                        <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#00A3FF] text-sm">
                           Forgot password?
                        </Text>
                     </TouchableOpacity>
                  )}
               </View>

               {/* Footer links */}
               <View className="flex-row justify-center items-center mb-4">
                  <View className="h-[1px] flex-1 bg-gray-800/50" />
                  <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-400 mx-3">or</Text>
                  <View className="h-[1px] flex-1 bg-gray-800/50" />
               </View>

               <View className="flex-row justify-center">
                  {mode === 'login' ? (
                     <TouchableOpacity
                        className="p-2"
                        disabled={loading}
                        onPress={navigateToRegister}>
                        <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-300">
                           Don't have an account? <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2EFF9A] font-bold">Sign up</Text>
                        </Text>
                     </TouchableOpacity>
                  ) : (
                     <TouchableOpacity
                        className="p-2"
                        disabled={loading}
                        onPress={navigateToLogin}>
                        <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-300">
                           Already have an account? <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2EFF9A] font-bold">Sign in</Text>
                        </Text>
                     </TouchableOpacity>
                  )}
               </View>
            </View>
         </ScrollView>
      </KeyboardAvoidingView>
   )
} 