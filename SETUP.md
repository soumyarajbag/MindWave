# MindWave Setup Guide

## Prerequisites

- Node.js 18+ and npm/yarn
- Firebase account
- Google Gemini API key
- (Optional) OpenWeatherMap API key

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Firestore Database
4. Enable Authentication (optional, for user accounts)
5. Get your Firebase configuration from Project Settings

### 3. Get API Keys

#### Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

#### OpenWeatherMap API (Optional)

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Copy the API key

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# OpenWeatherMap API (optional)
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Firestore Rules

Set up these security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /moods/{moodId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /insights/{insightId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Features Overview

### Core Features

- ✅ Automated mood detection
- ✅ Mood-based recommendations
- ✅ AI companion (Gemini)
- ✅ Weekly insights dashboard
- ✅ Weather-adaptive UI
- ✅ Ambient scenes
- ✅ Privacy mode
- ✅ Micro-habits suggestions

### How It Works

1. **Mood Detection**: The app tracks typing patterns, activity, and device usage to detect your mood
2. **Recommendations**: Based on detected mood, you get personalized content suggestions
3. **AI Companion**: Chat with an AI that understands your mood and provides support
4. **Weekly Insights**: Track your mood patterns over time with AI-generated insights

## Troubleshooting

### Firebase Not Initializing

- Check that all Firebase environment variables are set
- Verify Firebase project is active
- Check browser console for specific errors

### Gemini API Errors

- Verify API key is correct
- Check API quota/limits
- Ensure API key has proper permissions

### Weather Not Loading

- Check OpenWeatherMap API key
- Verify geolocation permissions in browser
- Weather will default to a generic state if API fails

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Privacy & Security

- Privacy Mode: Enable to store all data locally (no cloud sync)
- All mood data is encrypted in transit
- User authentication is optional
- No data is shared with third parties

## Support

For issues or questions, check the project README or open an issue on GitHub.
