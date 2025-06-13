// Utility function to safely extract username from user data
export const getUserDisplayName = (user: any): string => {
   if (!user) return 'User';

   // Check for username field from backend
   if (user.username) return user.username;

   // Get from user_metadata if available (Supabase format)
   const metadata = user.user_metadata;
   if (metadata?.username) return metadata.username;
   if (metadata?.full_name) return metadata.full_name;

   // Get from email as fallback
   const email = user.email;
   if (email) return email.split('@')[0];

   return 'User';
}; 