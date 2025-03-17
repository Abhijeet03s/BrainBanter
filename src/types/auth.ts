export interface User {
   id: string;
   username: string;
   email: string;
   role: string;
}

export type AuthContextType = {
   user: User | null;
   loading: boolean;
   signIn: (email: string, password: string) => Promise<void>;
   signUp: (username: string, email: string, password: string) => Promise<void>;
   signOut: () => Promise<void>;
};


export interface AuthProps {
   mode?: 'login' | 'register'
}