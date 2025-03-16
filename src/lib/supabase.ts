import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and anon key (from .env file)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a custom storage adapter for AsyncStorage
const AsyncStorageAdapter = {
   getItem: (key: string) => AsyncStorage.getItem(key),
   setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
   removeItem: (key: string) => AsyncStorage.removeItem(key),
};

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
   auth: {
      storage: AsyncStorageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
   },
});

// Backend API URL
const API_URL = 'http://localhost:8000';

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