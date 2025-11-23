import { Recommendation } from '@/types';
import { MoodCategory } from '@/types';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

// Mood-based search queries for Spotify
const MOOD_SPOTIFY_QUERIES: Record<MoodCategory, string[]> = {
  happy: ['happy', 'upbeat', 'feel good', 'positive', 'energetic'],
  energetic: ['workout', 'high energy', 'motivational', 'pump up', 'energetic'],
  sad: ['sad', 'emotional', 'comforting', 'healing', 'melancholic'],
  stressed: ['calming', 'meditation', 'relaxing', 'stress relief', 'peaceful'],
  calm: ['ambient', 'chill', 'peaceful', 'zen', 'tranquil'],
  overwhelmed: ['soothing', 'calm down', 'anxiety relief', 'mindfulness', 'serene'],
  neutral: ['chill', 'background', 'easy listening', 'relaxing', 'ambient'],
};

let spotifyToken: string | null = null;
let tokenExpiry: number = 0;

const getSpotifyToken = async (): Promise<string | null> => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  if (!clientId) {
    console.warn('Spotify credentials not configured');
    return null;
  }

  // Check if token is still valid
  if (spotifyToken && Date.now() < tokenExpiry) {
    return spotifyToken;
  }

  try {
    // Use Next.js API route to get token (server-side)
    const response = await fetch('/api/spotify-token');

    if (!response.ok) {
      throw new Error(`Spotify token error: ${response.status}`);
    }

    const data: SpotifyTokenResponse = await response.json();
    spotifyToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // Refresh 1 min before expiry

    return spotifyToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    return null;
  }
};

export const searchSpotifyTracks = async (
  mood: MoodCategory,
  maxResults: number = 5
): Promise<Recommendation[]> => {
  const token = await getSpotifyToken();

  if (!token) {
    return [];
  }

  try {
    const queries = MOOD_SPOTIFY_QUERIES[mood] || MOOD_SPOTIFY_QUERIES.neutral;
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(randomQuery)}&type=track&limit=${maxResults}&market=US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data: SpotifySearchResponse = await response.json();

    return data.tracks.items.map((track) => ({
      id: `spotify-${track.id}`,
      type: 'music' as const,
      title: track.name,
      description: `${track.artists.map((a) => a.name).join(', ')} • ${track.album.name}`,
      url: track.external_urls.spotify,
      thumbnail: track.album.images[0]?.url || '',
      moodTarget: [mood],
      // Store preview URL for audio preview
      previewUrl: track.preview_url || undefined,
    }));
  } catch (error) {
    console.error('Error fetching Spotify tracks:', error);
    return [];
  }
};

export const getSpotifyPlaylist = async (
  mood: MoodCategory,
  maxResults: number = 10
): Promise<Recommendation[]> => {
  const token = await getSpotifyToken();

  if (!token) {
    return [];
  }

  try {
    const queries = MOOD_SPOTIFY_QUERIES[mood] || MOOD_SPOTIFY_QUERIES.neutral;
    const randomQuery = queries[Math.floor(Math.random() * queries.length)] + ' playlist';

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(randomQuery)}&type=playlist&limit=5&market=US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();

    return data.playlists.items.slice(0, 3).map((playlist: any) => ({
      id: `spotify-playlist-${playlist.id}`,
      type: 'music' as const,
      title: playlist.name,
      description: playlist.description || `A ${mood} mood playlist`,
      url: playlist.external_urls.spotify,
      thumbnail: playlist.images[0]?.url || '',
      moodTarget: [mood],
    }));
  } catch (error) {
    console.error('Error fetching Spotify playlists:', error);
    return [];
  }
};
