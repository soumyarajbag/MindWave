# 🌈 MindWave - Automated Mood Detection & Emotional Wellness Companion

A vibe-first, intelligent, mood-aware web experience that automatically detects your mood and provides personalized wellness recommendations.

## Features

- 🎯 **Automated Mood Detection** - Uses typing patterns, activity patterns, and sentiment analysis
- 🎨 **Dynamic UI Themes** - Mood-based and weather-adaptive interfaces
- 🎵 **Personalized Recommendations** - Music, videos, activities, and more
- 🤖 **AI Companion** - Powered by Google Gemini for emotional support
- 📊 **Weekly Insights** - Track your mood trends and patterns
- 🌦️ **Weather Integration** - UI adapts to weather conditions
- 🎭 **Ambient Scenes** - Beautiful animated backgrounds

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **Backend**: Firebase (Firestore, Auth)
- **AI**: Google Gemini API
- **State Management**: Zustand

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_MODEL=gemini-1.5-flash  # Optional: gemini-1.5-pro, gemini-pro
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_weather_api_key
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
mindwave/
├── app/                 # Next.js app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── MoodDisplay.tsx      # Current mood visualization
│   ├── Recommendations.tsx  # Mood-based recommendations
│   ├── AICompanion.tsx      # Chat interface with Gemini
│   ├── WeeklyInsights.tsx   # Mood trends dashboard
│   ├── AmbientScene.tsx     # 3D animated backgrounds
│   ├── Header.tsx           # App header with controls
│   ├── MicroHabits.tsx      # Quick habit suggestions
│   ├── PrivacyMode.tsx      # Privacy settings
│   └── BreathingExercise.tsx # Guided breathing
├── lib/                 # Utilities and configurations
│   ├── firebase/        # Firebase setup and database operations
│   ├── gemini/          # Gemini AI client
│   ├── mood-detection/  # Mood detection engine
│   ├── recommendations/  # Recommendation generator
│   ├── storage/         # Local storage utilities
│   ├── utils/           # Helper functions
│   └── weather/         # Weather API integration
├── hooks/               # Custom React hooks
│   ├── useMoodDetection.ts  # Mood detection logic
│   └── useTheme.ts          # Dynamic theme management
├── store/               # Zustand state management
│   └── moodStore.ts     # Global app state
├── types/               # TypeScript type definitions
│   └── index.ts        # All type definitions
└── public/              # Static assets
```

## Key Features Explained

### 🎯 Automated Mood Detection
- **Typing Pattern Analysis**: Detects sentiment from typed text, typing speed, and backspace frequency
- **Activity Patterns**: Monitors tab switching, social media usage, and reading time
- **Device Usage**: Tracks late-night usage and overall activity levels
- **Weather Impact**: Adjusts mood detection based on current weather conditions

### 🎨 Dynamic UI Themes
The interface automatically adapts based on:
- **Detected Mood**: Each mood has a unique color scheme and animation
- **Weather Conditions**: Rain, snow, sun, and night modes with particle effects
- **Ambient Scenes**: Optional 3D backgrounds (rain, cozy room, lanterns, galaxy, beach)

### 🤖 AI Companion
Powered by Google Gemini:
- Context-aware conversations
- Mood-specific responses
- Emotional support and coping strategies
- Personalized recommendations

### 📊 Weekly Insights
- Visual mood trends over time
- AI-generated insights and recommendations
- Trigger identification
- Energy level patterns

## Usage

1. **First Visit**: The app will automatically detect your mood based on typing and activity
2. **Manual Detection**: Click "Detect Mood" button for immediate analysis
3. **Get Recommendations**: View personalized content suggestions based on your mood
4. **Chat with AI**: Use the AI Companion for emotional support
5. **Track Progress**: Check Weekly Insights to see your mood patterns

## Privacy

- **Privacy Mode**: Enable to store all data locally (no cloud sync)
- **No Tracking**: No analytics or third-party tracking
- **User Control**: You control what data is collected and stored

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

See `.env.example` for all required environment variables. Minimum required:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_GEMINI_API_KEY`

Optional (app works without these):
- `NEXT_PUBLIC_OPENWEATHER_API_KEY` - For weather features
- `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` - For music recommendations
- `NEXT_PUBLIC_TMDB_API_KEY` - For movie recommendations

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT

