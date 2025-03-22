import { FeatureItem } from "@/types";

export const features: FeatureItem[] = [
   {
      id: 'debate',
      title: 'AI Debate',
      description: 'Challenge your thinking with engaging AI debates',
      icon: 'bubble.left.and.bubble.right.fill',
      colors: ['#4A6CF7', '#2556E8'],
      route: '../debate/new'
   },
   {
      id: 'explore',
      title: 'Explore',
      description: 'Discover trending topics and debates',
      icon: 'paperplane.fill',
      colors: ['#8A3FFC', '#6929C4'],
      route: '/(tabs)/explore'
   }
];