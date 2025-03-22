import React from 'react';
import { TouchableOpacity, View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from '../typography/themed/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
   onPress: () => void;
   text: string;
   colors?: [string, string];
   disabled?: boolean;
   loading?: boolean;
   fullWidth?: boolean;
   size?: 'sm' | 'md' | 'lg';
   textType?: 'default' | 'subtitle';
   borderRadius?: number;
   icon?: React.ReactNode;
   iconPosition?: 'left' | 'right';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
   onPress,
   text,
   colors = ['#00A3FF', '#0072FF'],
   disabled = false,
   loading = false,
   fullWidth = false,
   size = 'md',
   textType = 'default',
   borderRadius = 9999, // Default to full rounded (pill shape)
   icon,
   iconPosition = 'left',
}) => {
   const sizeStyles = {
      sm: { paddingVertical: 6, paddingHorizontal: 12 },
      md: { paddingVertical: 10, paddingHorizontal: 16 },
      lg: { paddingVertical: 14, paddingHorizontal: 24 },
   };

   const disabledColors: [string, string] = ['#404040', '#303030'];

   return (
      <TouchableOpacity
         onPress={onPress}
         disabled={disabled || loading}
         style={[
            fullWidth ? { width: '100%' } : {},
            { opacity: (disabled && !loading) ? 0.6 : 1 }
         ]}
      >
         <LinearGradient
            colors={disabled || loading ? disabledColors : colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
               styles.gradient,
               { borderRadius },
               sizeStyles[size],
            ]}
         >
            <View style={styles.content}>
               {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
               ) : (
                  <>
                     {icon && iconPosition === 'left' && (
                        <View style={styles.iconLeft}>{icon}</View>
                     )}
                     <ThemedText
                        type={textType}
                        style={styles.text}
                     >
                        {text}
                     </ThemedText>
                     {icon && iconPosition === 'right' && (
                        <View style={styles.iconRight}>{icon}</View>
                     )}
                  </>
               )}
            </View>
         </LinearGradient>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   gradient: {
      minWidth: 80,
      alignItems: 'center',
      justifyContent: 'center',
   },
   content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   text: {
      color: 'white',
      fontWeight: '600',
   },
   iconLeft: {
      marginRight: 8,
   },
   iconRight: {
      marginLeft: 8,
   },
}); 