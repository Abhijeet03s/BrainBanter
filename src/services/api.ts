import { supabase } from '@/lib/supabase';

// Use environment-based API URL with production fallback
const API_URL = process.env.NODE_ENV === 'production'
   ? 'https://brainbanter-backend.onrender.com/api'
   : process.env.EXPO_PUBLIC_API_URL || 'https://brainbanter-backend.onrender.com/api';

// Helper function to get auth token
async function getAuthToken() {
   const { data } = await supabase.auth.getSession();
   return data.session?.access_token;
}

// Generic fetch function with authentication
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
   const token = await getAuthToken();

   const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
   };

   const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
   });

   if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Something went wrong');
   }

   return response.json();
}

// Auth API calls
export const authAPI = {
   // Get current user profile
   getCurrentUser: async () => {
      try {
         return await fetchWithAuth('/auth/me');
      } catch (error) {
         console.error('Error getting current user:', error);
         throw error;
      }
   },

   // Register user in our backend after Supabase auth
   registerUser: async () => {
      try {
         return await fetchWithAuth('/auth/callback', { method: 'POST' });
      } catch (error) {
         console.error('Error registering user:', error);
         throw error;
      }
   },
};

// Debate API calls
export const debateAPI = {
   // Get all debate sessions for the current user
   getUserSessions: async () => {
      try {
         return await fetchWithAuth('/debates/sessions');
      } catch (error) {
         console.error('Error getting user sessions:', error);
         throw error;
      }
   },

   // Get a specific debate session with messages
   getDebateSession: async (sessionId: string) => {
      try {
         return await fetchWithAuth(`/debates/sessions/${sessionId}`);
      } catch (error) {
         console.error('Error getting debate session:', error);
         throw error;
      }
   },

   // Start a new debate session
   startDebateSession: async (topic: string, mode: string = 'creative') => {
      try {
         return await fetchWithAuth('/debates/sessions', {
            method: 'POST',
            body: JSON.stringify({ topic, mode }),
         });
      } catch (error) {
         console.error('Error starting debate session:', error);
         throw error;
      }
   },

   // Send a message in a debate session
   sendMessage: async (sessionId: string, message: string) => {
      try {
         return await fetchWithAuth(`/debates/sessions/${sessionId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ message }),
         });
      } catch (error) {
         console.error('Error sending message:', error);
         throw error;
      }
   },

   // Delete a debate session
   deleteSession: async (sessionId: string) => {
      try {
         return await fetchWithAuth(`/debates/sessions/${sessionId}`, {
            method: 'DELETE',
         });
      } catch (error) {
         console.error('Error deleting session:', error);
         throw error;
      }
   },

   // Save a debate session
   saveDebate: async (sessionId: string) => {
      try {
         return await fetchWithAuth(`/debates/sessions/${sessionId}/save`, {
            method: 'POST',
         });
      } catch (error) {
         // Just pass through the error with the original message
         console.error('Error saving debate session:', error);
         throw error;
      }
   },

   // Get saved debates
   getSavedDebates: async () => {
      try {
         return await fetchWithAuth('/debates/saved');
      } catch (error) {
         console.error('Error getting saved debates:', error);
         throw error;
      }
   },

   // Remove saved debate
   removeSavedDebate: async (savedId: string) => {
      try {
         return await fetchWithAuth(`/debates/saved/${savedId}`, {
            method: 'DELETE',
         });
      } catch (error) {
         console.error('Error removing saved debate:', error);
         throw error;
      }
   },
};
