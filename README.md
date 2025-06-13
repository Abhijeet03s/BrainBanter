# BrainBanter

AI-powered debate platform that challenges users with follow-up questions, provides alternative perspectives, and creates engaging conversations.

**Backend Repository**: [BrainBanter-Backend](https://github.com/Abhijeet03s/BrainBanter-Backend)

## Tech Stack

- **Framework**: React Native + Expo (TypeScript)
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **Authentication**: Supabase
- **State**: React Context + useReducer

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Platform-specific builds
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser
```

## Project Structure

```
src/
├── app/           # Expo Router pages & navigation
├── components/    # Reusable UI components
├── contexts/      # React Context providers
├── hooks/         # Custom React hooks
├── services/      # API clients & external services
├── types/         # TypeScript type definitions
├── constants/     # App constants
├── lib/           # Utility functions & configs
└── assets/        # Static assets
```

## Features

- **AI Debate Chat**: Real-time AI-powered conversations with multiple debate modes
- **Authentication**: Secure user auth with Supabase
- **Session Management**: Save, resume, and organize debate sessions
- **Customizable AI**: Adjust AI behavior, tone, and response depth
- **Cross-Platform**: iOS, Android, and Web support

## Screenshots

<div align="center">
  <img src="assets/images/screenshots/chat-interface.png" alt="Chat Interface" width="300"/>
  <img src="assets/images/screenshots/home-screen.png" alt="Home Screen" width="300"/>
  <img src="assets/images/screenshots/debate-screen.png" alt="Debate Screen" width="300"/>
</div>

## Development

- **TypeScript**: Strict mode enabled
- **Components**: Functional components with typed props
- **Exports**: Named exports preferred
- **Testing**: Jest + React Native Testing Library
- **Linting**: ESLint + Prettier

## Scripts

- `npm start` - Start Expo development server
- `npm run build` - Export production build
- `npm test` - Run test suite
- `npm run lint` - Run linter

## Environment

Configure environment variables for Supabase and API endpoints in your Expo configuration.



