# API Setup Guide for Recommendations

This guide will help you set up YouTube and Spotify APIs to enable rich content recommendations with thumbnails and previews.

## YouTube API Setup

### Step 1: Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **YouTube Data API v3**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### Step 2: Add to Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
```

### Step 3: Restrict API Key (Recommended)

1. In Google Cloud Console, click on your API key
2. Under "API restrictions", select "Restrict key"
3. Choose "YouTube Data API v3"
4. Save

## Spotify API Setup

### Step 1: Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an app"
4. Fill in:
   - App name: "MindWave"
   - App description: "Mood-based music recommendations"
   - Redirect URI: `http://localhost:3000` (for development)
5. Click "Save"
6. Copy your **Client ID** and **Client Secret**

### Step 2: Add to Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

**Important**: `SPOTIFY_CLIENT_SECRET` should NOT have `NEXT_PUBLIC_` prefix as it's server-side only.

### Step 3: Update Redirect URI (For Production)

When deploying:

1. Add your production URL to Redirect URIs in Spotify Dashboard
2. Update the redirect URI in your code if needed

## Features Enabled

Once APIs are configured, you'll get:

### YouTube Integration

- ✅ Real video recommendations based on mood
- ✅ Video thumbnails
- ✅ Direct links to YouTube videos
- ✅ Music video recommendations

### Spotify Integration

- ✅ Real music track recommendations
- ✅ Album artwork thumbnails
- ✅ 30-second audio previews (playable in app)
- ✅ Direct links to Spotify
- ✅ Playlist recommendations

## Testing

1. Restart your dev server: `npm run dev`
2. Detect your mood or click "Detect Mood"
3. Check the Recommendations section:
   - You should see YouTube videos with thumbnails
   - You should see Spotify tracks with album art
   - Click play button on Spotify tracks to hear previews
   - Click any card to open in YouTube/Spotify

## Troubleshooting

### YouTube API Issues

**Error: "API key not valid"**

- Check that YouTube Data API v3 is enabled
- Verify API key is correct
- Check API key restrictions

**Error: "Quota exceeded"**

- YouTube API has daily quota limits
- Check quota in Google Cloud Console
- Consider caching results

### Spotify API Issues

**Error: "Invalid client"**

- Verify Client ID and Secret are correct
- Check that `SPOTIFY_CLIENT_SECRET` doesn't have `NEXT_PUBLIC_` prefix

**Error: "Token endpoint failed"**

- Check that the API route `/api/spotify-token` is accessible
- Verify server-side environment variables are set
- Check Spotify app settings

**No previews available**

- Not all tracks have preview URLs
- Spotify provides previews for most popular tracks
- This is normal behavior

### Fallback Behavior

If APIs are not configured or fail:

- App will use internal recommendations (text-only)
- App will continue to work normally
- No errors will be shown to users

## API Quotas & Limits

### YouTube API

- **Free tier**: 10,000 units per day
- Each search = 100 units
- Each video details = 1 unit

### Spotify API

- **Free tier**: Unlimited requests
- Rate limit: 10 requests per second
- Token expires after 1 hour (auto-refreshed)

## Production Considerations

1. **Caching**: Implement caching for API responses to reduce quota usage
2. **Error Handling**: Already implemented - app gracefully falls back
3. **Rate Limiting**: Consider implementing rate limiting for API calls
4. **Server-Side**: Move API calls to server-side API routes for better security

## Optional: Additional APIs

You can also add:

- **TMDB API**: For movie recommendations
- **Reddit API**: For meme/funny content
- **Unsplash API**: For wallpapers

See the main README for more details.
