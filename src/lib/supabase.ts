import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a platform-specific storage adapter
const createStorageAdapter = () => {
   if (Platform.OS === 'web') {
      // Web storage adapter using localStorage
      return {
         getItem: (key: string) => {
            if (typeof window !== 'undefined') {
               return Promise.resolve(localStorage.getItem(key));
            }
            return Promise.resolve(null);
         },
         setItem: (key: string, value: string) => {
            if (typeof window !== 'undefined') {
               localStorage.setItem(key, value);
            }
            return Promise.resolve();
         },
         removeItem: (key: string) => {
            if (typeof window !== 'undefined') {
               localStorage.removeItem(key);
            }
            return Promise.resolve();
         },
      };
   } else {
      // Native storage adapter using AsyncStorage
      return {
         getItem: (key: string) => AsyncStorage.getItem(key),
         setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
         removeItem: (key: string) => AsyncStorage.removeItem(key),
      };
   }
};

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
   auth: {
      storage: createStorageAdapter(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
   },
});

// Backend API URL - use production URL from app config
const API_URL = process.env.NODE_ENV === 'production'
   ? 'https://brainbanter-backend.onrender.com'
   : 'http://localhost:8000';

interface User {
   id: string;
   username: string;
   email: string;
   role: string;
}

// Auth API functions
export const authAPI = {
   // Login user with Supabase
   login: async (email: string, password: string): Promise<User> => {
      try {
         const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
         });

         if (error) throw error;

         // Sync with backend
         await authAPI.syncUserWithBackend();

         // Get user profile from backend
         const user = await authAPI.getCurrentUser();
         if (!user) throw new Error('Failed to get user profile');
         return user;
      } catch (error) {
         throw error;
      }
   },

   // Register user with Supabase
   register: async (username: string, email: string, password: string): Promise<any> => {
      try {
         const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
               data: {
                  username,
               },
            },
         });

         if (error) throw error;

         return data;
      } catch (error) {
         throw error;
      }
   },

   // Logout user
   logout: async (): Promise<void> => {
      await supabase.auth.signOut();
   },

   // Sync user with backend after successful auth
   syncUserWithBackend: async (): Promise<void> => {
      try {
         const { data: sessionData } = await supabase.auth.getSession();
         if (!sessionData.session) return;

         const token = sessionData.session.access_token;

         await fetch(`${API_URL}/api/auth/callback`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
         });
      } catch (error) {
         console.error('Error syncing user with backend:', error);
      }
   },

   // Forgot password function
   forgotPassword: async (email: string): Promise<void> => {
      try {
         // Call our backend API for password reset
         const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to send password reset email');
         }
      } catch (error) {
         console.error('Error in forgotPassword:', error);
         throw error;
      }
   },

   // Get current user from backend
   getCurrentUser: async (): Promise<User | null> => {
      try {
         const { data: sessionData } = await supabase.auth.getSession();
         if (!sessionData.session) return null;

         const token = sessionData.session.access_token;

         const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });

         if (!response.ok) {
            return null;
         }

         return await response.json();
      } catch (error) {
         return null;
      }
   }
}; 