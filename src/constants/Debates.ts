import { DebateMode } from "@/types/debate";

export const debateModes: { id: DebateMode; name: string; description: string; colors: [string, string]; icon: string }[] = [
   {
      id: 'creative',
      name: 'Creative',
      description: 'Brainstorming and lateral thinking challenges',
      colors: ['#4158D0', '#C850C0'],
      icon: 'lightbulb.fill'
   },
   {
      id: 'business',
      name: 'Business',
      description: 'Data-driven arguments, strategic thinking prompts',
      colors: ['#0093E9', '#80D0C7'],
      icon: 'chart.bar.fill'
   },
   {
      id: 'philosophy',
      name: 'Philosophy',
      description: 'Ethical dilemmas, deep conceptual discussions',
      colors: ['#8E2DE2', '#4A00E0'],
      icon: 'book.fill'
   },
   {
      id: 'casual',
      name: 'Casual',
      description: 'Light, friendly argumentation style',
      colors: ['#00DBDE', '#FC00FF'],
      icon: 'person.2.fill'
   },
];