import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Message } from '@/types/debate';

const { width: screenWidth } = Dimensions.get('window');

interface MessageBubbleProps {
   message: Message;
   index: number;
   onLongPress?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
   message,
   index,
   onLongPress
}) => {
   const isUser = message.sender === 'user';
   const maxWidth = screenWidth * 0.75;
   const fadeAnim = useRef(new Animated.Value(0)).current;
   const slideAnim = useRef(new Animated.Value(20)).current;

   useEffect(() => {
      Animated.parallel([
         Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            delay: index * 50,
            useNativeDriver: true,
         }),
         Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            delay: index * 50,
            useNativeDriver: true,
         }),
      ]).start();
   }, []);

   const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
         hour: '2-digit',
         minute: '2-digit',
      });
   };

   return (
      <Animated.View
         style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
         }}
         className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}
      >
         <TouchableOpacity
            onLongPress={onLongPress}
            activeOpacity={0.8}
            style={{ maxWidth }}
         >
            <View
               style={{
                  borderRadius: 20,
                  overflow: 'hidden',
               }}
            >
               {isUser ? (
                  <View
                     style={{
                        borderRadius: 20,
                        padding: 1,
                     }}
                  >
                     <View
                        style={{
                           backgroundColor: '#00A3FF',
                           borderRadius: 20,
                           padding: 12,
                        }}
                     >
                        <Text
                           style={{
                              color: '#FFFFFF',
                              fontFamily: 'Lora-Regular',
                              fontSize: 16,
                              lineHeight: 20,
                              fontWeight: '400',
                           }}
                        >
                           {message.content}
                        </Text>
                     </View>
                  </View>
               ) : (
                  <View
                     style={{
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        overflow: 'hidden',
                     }}
                  >
                     <View className="p-3">
                        <View className="flex-row items-center mb-2">
                           <View
                              className="w-5 h-5 rounded-full items-center justify-center mr-2"
                              style={{ backgroundColor: '#00A3FF30' }}
                           >
                              <IconSymbol name="brain" size={12} color="#00A3FF" />
                           </View>
                           <Text
                              style={{
                                 color: '#00A3FF',
                                 fontFamily: 'Poppins-Medium',
                                 fontSize: 11,
                              }}
                           >
                              AI Assistant
                           </Text>
                        </View>
                        <Text
                           style={{
                              color: '#FFFFFF',
                              fontFamily: 'FiraCode-Regular',
                              fontSize: 16,
                              lineHeight: 22,
                           }}
                        >
                           {message.content}
                        </Text>
                     </View>
                  </View>
               )}
            </View>
         </TouchableOpacity>

         {/* Timestamp */}
         <Text
            style={{
               color: '#6B7280',
               fontFamily: 'Lora-Regular',
               fontSize: 10,
               marginTop: 2,
               marginHorizontal: 8,
            }}
         >
            {formatTime(message.createdAt)}
         </Text>
      </Animated.View>
   );
}; 