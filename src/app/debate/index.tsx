import { Redirect } from 'expo-router';

export default function DebateIndex() {
   // Redirect to debates tab
   return <Redirect href="/(tabs)/debates" />;
} 