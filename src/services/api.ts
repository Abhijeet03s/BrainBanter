import { supabase } from '../lib/supabase';

const API_URL = 'http://localhost:8000/api';

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
   getCurrentUser: () => fetchWithAuth('/auth/me'),

   // Register user in our backend after Supabase auth
   registerUser: () => fetchWithAuth('/auth/callback', { method: 'POST' }),
};
