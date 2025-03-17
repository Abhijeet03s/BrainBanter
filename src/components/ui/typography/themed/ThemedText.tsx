import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'aiOutput';
  fontFamily?: 'poppins' | 'lora' | 'firaCode';
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  fontFamily,
  fontWeight = 'regular',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // Determine font family based on type if not explicitly provided
  let fontFamilyToUse = fontFamily;
  let fontWeightToUse = fontWeight;

  if (!fontFamilyToUse) {
    if (type === 'title' || type === 'subtitle') {
      fontFamilyToUse = 'poppins'; // Primary font for headlines
    } else if (type === 'aiOutput') {
      fontFamilyToUse = 'firaCode'; // Monospace for AI output
    } else {
      fontFamilyToUse = 'lora'; // Secondary font for regular text
    }
  }

  // Determine font weight based on type if not explicitly set
  if (type === 'title') {
    fontWeightToUse = 'bold';
  } else if (type === 'subtitle' || type === 'defaultSemiBold') {
    fontWeightToUse = 'semibold';
  }

  return (
    <Text
      style={[
        { color },
        getFontStyle(fontFamilyToUse, fontWeightToUse),
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'aiOutput' ? styles.aiOutput : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

// Helper function to get the appropriate font style based on family and weight
function getFontStyle(
  fontFamily: 'poppins' | 'lora' | 'firaCode' = 'lora',
  fontWeight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular'
) {
  // Create the font name using the pattern "{FontName}-{Weight}"
  let fontName = '';

  switch (fontFamily) {
    case 'poppins':
      switch (fontWeight) {
        case 'medium': fontName = 'Poppins-Medium'; break;
        case 'semibold': fontName = 'Poppins-SemiBold'; break;
        case 'bold': fontName = 'Poppins-Bold'; break;
        default: fontName = 'Poppins-Regular'; break;
      }
      break;

    case 'firaCode':
      switch (fontWeight) {
        case 'medium': fontName = 'FiraCode-Medium'; break;
        case 'semibold': fontName = 'FiraCode-SemiBold'; break;
        case 'bold': fontName = 'FiraCode-SemiBold'; break; // FiraCode might not have Bold
        default: fontName = 'FiraCode-Regular'; break;
      }
      break;

    case 'lora':
    default:
      switch (fontWeight) {
        case 'medium': fontName = 'Lora-Medium'; break;
        case 'semibold': fontName = 'Lora-SemiBold'; break;
        case 'bold': fontName = 'Lora-Bold'; break;
        default: fontName = 'Lora-Regular'; break;
      }
      break;
  }

  return { fontFamily: fontName };
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  aiOutput: {
    fontSize: 14,
    lineHeight: 20,
  },
});

