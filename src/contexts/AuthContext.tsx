import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { authAPI } from '@/lib/supabase';

interface User {
   id: string;
   username: string;
   email: string;
   role: string;
}

type AuthContextType = {
   user: User | null;
   loading: boolean;
   signIn: (email: string, password: string) => Promise<void>;
   signUp: (username: string, email: string, password: string) => Promise<void>;
   signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // Check for active session on mount
      const checkUser = async () => {
         try {
            const currentUser = await authAPI.getCurrentUser();
            setUser(currentUser);
         } catch (error) {
            console.error('Error fetching user:', error);
         } finally {
            setLoading(false);
         }
      };

      checkUser();
   }, []);

   const signIn = async (email: string, password: string) => {
      try {
         setLoading(true);
         const user = await authAPI.login(email, password);
         setUser(user);
      } catch (error) {
         console.error('Error signing in:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   };

   const signUp = async (username: string, email: string, password: string) => {
      try {
         setLoading(true);
         await authAPI.register(username, email, password);
         // Don't log in automatically after registration
         setUser(null);
      } catch (error) {
         console.error('Error signing up:', error);
         // Log more details about the error
         if (error instanceof Error) {
            console.error('Error details:', error.message);
         }
         throw error;
      } finally {
         setLoading(false);
      }
   };

   const signOut = async () => {
      try {
         setLoading(true);
         await authAPI.logout();
         setUser(null);
      } catch (error) {
         console.error('Error signing out:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   };

   return (
      <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
}