# Quick Start Guide

Get MindWave up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Get API Keys

### Required:

1. **Firebase**: Create a project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore
   - Copy config from Project Settings

2. **Gemini**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Optional:

- **OpenWeatherMap**: Sign up at [OpenWeatherMap](https://openweathermap.org/api) (free tier available)

## Step 3: Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_weather_key
```

## Step 4: Run

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## What's Next?

- Start typing to see mood detection in action
- Click "Detect Mood" for immediate analysis
- Try different ambient scenes
- Chat with the AI companion
- Enable privacy mode if you prefer local-only storage

## Troubleshooting

**Firebase errors?**

- Check all env variables are set
- Verify Firestore is enabled
- Check browser console for specific errors

**Gemini not working?**

- Verify API key is correct
- Check API quota hasn't been exceeded

**Weather not loading?**

- App will work without weather API
- Check geolocation permissions in browser

That's it! You're ready to use MindWave! 🌈
