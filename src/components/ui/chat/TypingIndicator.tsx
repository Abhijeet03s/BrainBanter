import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface TypingIndicatorProps {
   isVisible: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
   const typingDots = useRef([
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0)
   ]).current;

   useEffect(() => {
      if (isVisible) {
         const animations = typingDots.map((dot, index) =>
            Animated.loop(
               Animated.sequence([
                  Animated.delay(index * 200),
                  Animated.timing(dot, {
                     toValue: 1,
                     duration: 400,
                     useNativeDriver: true,
                  }),
                  Animated.timing(dot, {
                     toValue: 0,
                     duration: 400,
                     useNativeDriver: true,
                  }),
               ])
            )
         );

         Animated.parallel(animations).start();
      } else {
         typingDots.forEach(dot => dot.setValue(0));
      }
   }, [isVisible]);

   if (!isVisible) return null;

   return (
      <View className="mb-4 items-start">
         <View
            style={{
               borderWidth: 1,
               borderColor: 'rgba(255, 255, 255, 0.1)',
               borderRadius: 20,
               backgroundColor: 'rgba(255, 255, 255, 0.05)',
               overflow: 'hidden',
               maxWidth: screenWidth * 0.6,
            }}
         >
            <View className="px-3 py-3">
               <View className="flex-row items-center mb-1">
                  <View
                     className="w-5 h-5 rounded-full items-center justify-center mr-2"
                     style={{ backgroundColor: '#00A3FF30' }}
                  >
                     <Text style={{ color: '#00A3FF', fontSize: 8 }}>AI</Text>
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
               <View className="flex-row items-center">
                  <Text
                     style={{
                        color: '#9CA3AF',
                        fontFamily: 'FiraCode-Regular',
                        fontSize: 13,
                        marginRight: 8,
                     }}
                  >
                     Thinking
                  </Text>
                  {typingDots.map((dot, index) => (
                     <Animated.View
                        key={index}
                        style={{
                           width: 5,
                           height: 5,
                           borderRadius: 2.5,
                           backgroundColor: '#00A3FF',
                           marginHorizontal: 1,
                           opacity: dot,
                        }}
                     />
                  ))}
               </View>
            </View>
         </View>
      </View>
   );
}; 