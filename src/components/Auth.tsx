import React, { useState } from 'react'
import { Alert, StyleSheet, View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../contexts/AuthContext'

interface AuthProps {
   mode?: 'login' | 'register'
}

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
      <View style={styles.container}>
         {mode === 'register' && (
            <View style={[styles.verticallySpaced, styles.mt20]}>
               <Text style={styles.label}>Username</Text>
               <TextInput
                  style={styles.input}
                  onChangeText={(text: string) => setUsername(text)}
                  value={username}
                  placeholder="username"
                  autoCapitalize="none"
                  editable={!loading}
               />
            </View>
         )}
         <View style={[styles.verticallySpaced, styles.mt20]}>
            <Text style={styles.label}>Email</Text>
            <TextInput
               style={styles.input}
               onChangeText={(text: string) => setEmail(text)}
               value={email}
               placeholder="email@address.com"
               autoCapitalize="none"
               keyboardType="email-address"
               editable={!loading}
            />
         </View>
         <View style={styles.verticallySpaced}>
            <Text style={styles.label}>Password</Text>
            <TextInput
               style={styles.input}
               onChangeText={(text: string) => setPassword(text)}
               value={password}
               secureTextEntry={true}
               placeholder="Password"
               autoCapitalize="none"
               editable={!loading}
            />
         </View>
         <View style={[styles.verticallySpaced, styles.mt20]}>
            <TouchableOpacity
               style={[styles.button, loading && styles.buttonDisabled]}
               disabled={loading}
               onPress={handleSubmit}>
               {loading ? (
                  <ActivityIndicator size="small" color="white" />
               ) : (
                  <Text style={styles.buttonText}>
                     {mode === 'login' ? 'Sign in' : 'Sign up'}
                  </Text>
               )}
            </TouchableOpacity>
         </View>
         <View style={styles.verticallySpaced}>
            {mode === 'login' ? (
               <TouchableOpacity
                  style={styles.linkButton}
                  disabled={loading}
                  onPress={navigateToRegister}>
                  <Text style={styles.linkText}>Don't have an account? Sign up</Text>
               </TouchableOpacity>
            ) : (
               <TouchableOpacity
                  style={styles.linkButton}
                  disabled={loading}
                  onPress={navigateToLogin}>
                  <Text style={styles.linkText}>Already have an account? Sign in</Text>
               </TouchableOpacity>
            )}
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      marginTop: 20,
      padding: 12,
   },
   verticallySpaced: {
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
   },
   mt20: {
      marginTop: 20,
   },
   input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginTop: 4,
   },
   label: {
      marginBottom: 4,
      fontWeight: '500',
   },
   button: {
      backgroundColor: '#0284c7',
      padding: 10,
      borderRadius: 4,
      alignItems: 'center',
   },
   buttonDisabled: {
      backgroundColor: '#9ca3af',
   },
   buttonText: {
      color: 'white',
      fontWeight: '600',
   },
   linkButton: {
      padding: 10,
      alignItems: 'center',
   },
   linkText: {
      color: '#0284c7',
   },
}) 