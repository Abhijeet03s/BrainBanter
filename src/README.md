# BrainBanter Frontend Structure

This document outlines the organization of the BrainBanter frontend codebase.

## Folder Structure

```
src/
├── app/                # Expo Router pages
│   ├── (tabs)/         # Tab navigation screens
│   ├── auth/           # Authentication screens
├── assets/             # Static assets (images, fonts)
├── components/         # Reusable components
│   ├── auth/           # Auth-related components
│   ├── debate/         # Debate-related components
│   ├── mind-map/       # Mind map visualization components
│   ├── ui/             # Generic UI components
│       ├── buttons/    # Button components
│       ├── inputs/     # Input components
│       ├── layout/     # Layout components
│       ├── typography/ # Text components
│       ├── feedback/   # Feedback components
│       ├── navigation/ # Navigation components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Third-party library configurations
├── services/           # API and external services
│   ├── api/            # API client and endpoints
│   ├── auth/           # Authentication services
│   ├── debate/         # Debate-related services
├── state/              # State management (Zustand)
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── constants/          # App constants
```

## Component Organization

Components are organized by feature/domain rather than by type. This makes it easier to find related components and understand the codebase structure.

- **Feature-based components** (auth, debate, mind-map): Components specific to a particular feature or domain
- **UI components**: Generic, reusable UI components that can be used across features

## Naming Conventions

- **Files**: PascalCase for components (e.g., `Button.tsx`), camelCase for utilities and hooks (e.g., `useAuth.ts`)
- **Directories**: kebab-case for multi-word directories (e.g., `mind-map`), camelCase for single-word directories (e.g., `auth`)
- **Components**: PascalCase for component names (e.g., `export default function Button() {}`)
- **Hooks**: camelCase prefixed with "use" (e.g., `export function useAuth() {}`)

## Import Paths

Use absolute imports with the `@/` prefix for imports from the src directory:

```typescript
import { Button } from '@/components/ui/buttons/Button';
import { useAuth } from '@/contexts/AuthContext';
``` 