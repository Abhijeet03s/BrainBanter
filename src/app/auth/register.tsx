import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Auth from '../../components/auth/Auth';
import { ThemedText } from '../../components/ui/typography/themed/ThemedText';

export default function RegisterScreen() {
   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.content}>
            <ThemedText style={styles.title}>Join BrainBanter</ThemedText>
            <ThemedText style={styles.subtitle}>Create your account</ThemedText>
            <Auth mode="register" />
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   content: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
   },
   title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
   },
   subtitle: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 30,
      opacity: 0.7,
   },
}); 