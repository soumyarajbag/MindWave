# Advanced Recommendations Features

## Overview

The recommendations system has been enhanced to show real content from YouTube and Spotify with rich media previews.

## Features

### 🎵 Music Recommendations

**Spotify Integration:**

- Real music tracks based on your mood
- Album artwork thumbnails
- 30-second audio previews (click play button)
- Direct links to Spotify
- Playlist recommendations

**YouTube Music:**

- Music videos from YouTube
- Video thumbnails
- Direct links to YouTube

### 📺 Video Recommendations

**YouTube Integration:**

- Real video recommendations
- Video thumbnails with play overlay
- Direct links to YouTube
- Mood-based search queries

### ✨ Activity Recommendations

- Meditation exercises
- Breathing activities
- Journaling prompts
- Other wellness activities

## UI Features

### Thumbnails & Previews

- High-quality thumbnails for all media
- Hover effects on cards
- Play button overlays for videos
- Audio preview player for Spotify tracks

### Source Badges

- **YouTube**: Red badge
- **Spotify**: Green badge
- **MindWave**: Purple badge (internal recommendations)

### Responsive Design

- Grid layout adapts to screen size
- Mobile-friendly cards
- Touch-optimized interactions

## How It Works

1. **Mood Detection**: When your mood is detected, the system:
   - Searches YouTube for relevant videos
   - Searches Spotify for relevant tracks
   - Fetches playlists matching your mood
   - Combines with internal recommendations

2. **Content Display**:
   - Music and videos shown in separate sections
   - Thumbnails loaded from APIs
   - Preview functionality for Spotify tracks
   - Direct links to external platforms

3. **Fallback System**:
   - If APIs fail, uses internal recommendations
   - Graceful degradation
   - No errors shown to users

## Usage

1. **View Recommendations**:
   - Recommendations appear automatically after mood detection
   - Or click "Detect Mood" to refresh

2. **Play Previews**:
   - Click play button on Spotify tracks
   - 30-second preview will play
   - Click again to stop

3. **Open Content**:
   - Click any card to open in YouTube/Spotify
   - Opens in new tab
   - Maintains your current session

## API Requirements

See `API_SETUP.md` for detailed setup instructions.

**Minimum Setup:**

- YouTube API key (for videos)
- Spotify Client ID & Secret (for music)

**Optional:**

- Works without APIs (uses internal recommendations)

## Customization

### Adding More Sources

To add new recommendation sources:

1. Create API integration in `lib/apis/`
2. Update `getRecommendations()` in `lib/recommendations/generator.ts`
3. Add source badge in `components/Recommendations.tsx`

### Styling

Recommendations use:

- Tailwind CSS for styling
- Framer Motion for animations
- Next.js Image for optimized images

## Performance

- **Lazy Loading**: Images load on demand
- **Caching**: API responses can be cached (future enhancement)
- **Error Handling**: Graceful fallbacks
- **Async Loading**: Recommendations load in background

## Future Enhancements

- [ ] Caching API responses
- [ ] Playlist creation
- [ ] Favorite recommendations
- [ ] Share recommendations
- [ ] More API integrations (TMDB, Reddit, etc.)
