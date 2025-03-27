# BrainBanter

BrainBanter is an AI-powered debate platform that challenges users with follow-up questions, provides alternative perspectives, and visually maps out conversations.

## Project Structure

The project follows a structured organization pattern:

```
brainbanter/
├── src/                           # All application code
│   ├── app/                       # Expo Router pages
│   ├── assets/                    # Static assets (images, fonts)
│   ├── components/                # Reusable components
│   ├── contexts/                  # React contexts
│   ├── hooks/                     # Custom hooks
│   ├── lib/                       # Third-party library configurations
│   ├── services/                  # API and external services
│   ├── state/                     # State management (Zustand)
│   ├── types/                     # TypeScript type definitions
│   ├── utils/                     # Helper functions
│   └── constants/                 # App constants
├── .expo/                         # Expo configuration
├── node_modules/                  # Dependencies
├── scripts/                       # Build and utility scripts
├── .env                           # Environment variables
├── app.json                       # Expo app configuration
├── babel.config.js                # Babel configuration
├── global.css                     # Global styles
├── metro.config.js                # Metro bundler config
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Project documentation
```

For more detailed information about the codebase structure, see [src/README.md](src/README.md).

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

## Development

- **Styling**: The project uses NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand for lightweight state management
- **Navigation**: React Navigation with Expo Router
- **Authentication**: Supabase auth

## Features

- AI-powered debate chat interface
- User authentication and profiles
- Saved sessions and notes
- Customizable AI behavior
