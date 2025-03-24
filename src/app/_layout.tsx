import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../../global.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Restore all fonts with improved error handling
  const [fontsLoaded, fontError] = useFonts({
    // Primary font - Poppins
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),

    // Secondary font - Lora
    'Lora-Regular': require('../assets/fonts/Lora-Regular.ttf'),
    'Lora-Medium': require('../assets/fonts/Lora-Medium.ttf'),
    'Lora-SemiBold': require('../assets/fonts/Lora-SemiBold.ttf'),
    'Lora-Bold': require('../assets/fonts/Lora-Bold.ttf'),

    // Code/AI Output font - FiraCode
    'FiraCode-Regular': require('../assets/fonts/FiraCode-Regular.ttf'),
    'FiraCode-Medium': require('../assets/fonts/FiraCode-Medium.ttf'),
    'FiraCode-SemiBold': require('../assets/fonts/FiraCode-SemiBold.ttf'),

    // Legacy font
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {
      });
    }
  }, [fontsLoaded, fontError]);

  // Show a loading indicator if fonts are still loading
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="debate/[id]" options={{ headerShown: true }} />
            <Stack.Screen name="debate/new" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
