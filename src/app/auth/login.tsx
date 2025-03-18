import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Auth from '../../components/auth/Auth';

export default function LoginScreen() {
   return (
      <SafeAreaView className="flex-1 bg-gray-950" edges={['top', 'bottom', 'left', 'right']}>
         <Auth mode="login" />
      </SafeAreaView>
   );
} 