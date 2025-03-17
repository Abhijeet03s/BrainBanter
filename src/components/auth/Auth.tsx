import React, { useState } from 'react'
import { Alert, View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import { AuthProps } from '@/types/auth'

export default function Auth({ mode = 'login' }: AuthProps) {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [username, setUsername] = useState('')
   const [loading, setLoading] = useState(false)
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

   return (
      <View className="flex-1 px-6 pt-8 pb-8 bg-white dark:bg-gray-900">
         <View className="pt-32">
            <Text className="text-5xl font-bold text-center text-gray-900 dark:text-white mb-1">
               BrainBanter
            </Text>
         </View>

         <View className="flex-1 justify-center">
            <View className="mb-6 items-center">
               <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
               </Text>
               <Text className="text-gray-500 dark:text-gray-400 mb-6 text-center">
                  {mode === 'login'
                     ? 'Sign in to continue to BrainBanter'
                     : 'Fill in your details to get started'}
               </Text>
            </View>

            {mode === 'register' && (
               <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</Text>
                  <TextInput
                     className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                     onChangeText={(text: string) => setUsername(text)}
                     value={username}
                     placeholder="Username"
                     placeholderTextColor="#9CA3AF"
                     autoCapitalize="none"
                     editable={!loading}
                  />
               </View>
            )}

            <View className="mb-4">
               <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</Text>
               <TextInput
                  className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                  onChangeText={(text: string) => setEmail(text)}
                  value={email}
                  placeholder="Email address"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
               />
            </View>

            <View className="mb-6">
               <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</Text>
               <TextInput
                  className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                  onChangeText={(text: string) => setPassword(text)}
                  value={password}
                  secureTextEntry={true}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  editable={!loading}
               />
            </View>

            <TouchableOpacity
               className={`py-3 px-4 rounded-lg items-center justify-center mb-4 ${loading ? 'bg-blue-400' : 'bg-blue-500'}`}
               disabled={loading}
               onPress={handleSubmit}>
               {loading ? (
                  <ActivityIndicator size="small" color="white" />
               ) : (
                  <Text className="text-white font-semibold text-base">
                     {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </Text>
               )}
            </TouchableOpacity>

            <View className="flex-row justify-center">
               {mode === 'login' ? (
                  <TouchableOpacity
                     className="p-2"
                     disabled={loading}
                     onPress={navigateToRegister}>
                     <Text className="text-blue-600 dark:text-blue-400">Don't have an account? Sign up</Text>
                  </TouchableOpacity>
               ) : (
                  <TouchableOpacity
                     className="p-2"
                     disabled={loading}
                     onPress={navigateToLogin}>
                     <Text className="text-blue-600 dark:text-blue-400">Already have an account? Sign in</Text>
                  </TouchableOpacity>
               )}
            </View>
         </View>
      </View>
   )
} 