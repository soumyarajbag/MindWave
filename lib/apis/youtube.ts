import { Recommendation } from '@/types';
import { MoodCategory } from '@/types';

interface YouTubeSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: { url: string };
      high: { url: string };
    };
    channelTitle: string;
  };
}

interface YouTubeResponse {
  items: YouTubeSearchResult[];
}

// Mood-based search queries for YouTube
const MOOD_SEARCH_QUERIES: Record<MoodCategory, string[]> = {
  happy: ['happy music', 'upbeat songs', 'feel good music', 'positive vibes', 'energetic music'],
  energetic: [
    'workout music',
    'high energy songs',
    'motivational music',
    'pump up songs',
    'energetic beats',
  ],
  sad: ['sad songs', 'emotional music', 'comforting music', 'healing music', 'melancholic songs'],
  stressed: [
    'calming music',
    'meditation music',
    'relaxing sounds',
    'stress relief music',
    'peaceful music',
  ],
  calm: ['ambient music', 'chill music', 'peaceful sounds', 'zen music', 'tranquil music'],
  overwhelmed: [
    'soothing music',
    'calm down music',
    'anxiety relief',
    'mindfulness music',
    'serene sounds',
  ],
  neutral: [
    'chill music',
    'background music',
    'easy listening',
    'relaxing music',
    'ambient sounds',
  ],
};

export const searchYouTubeVideos = async (
  mood: MoodCategory,
  maxResults: number = 5
): Promise<Recommendation[]> => {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn('YouTube API key not configured');
    return [];
  }

  try {
    const queries = MOOD_SEARCH_QUERIES[mood] || MOOD_SEARCH_QUERIES.neutral;
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(randomQuery)}&type=video&maxResults=${maxResults}&key=${apiKey}&videoCategoryId=10`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data: YouTubeResponse = await response.json();

    return data.items.map((item) => ({
      id: `youtube-${item.id.videoId}`,
      type: 'video' as const,
      title: item.snippet.title,
      description: item.snippet.description.substring(0, 100) + '...',
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.high.url,
      moodTarget: [mood],
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};

export const searchYouTubeMusic = async (
  mood: MoodCategory,
  maxResults: number = 5
): Promise<Recommendation[]> => {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn('YouTube API key not configured');
    return [];
  }

  try {
    const queries = MOOD_SEARCH_QUERIES[mood] || MOOD_SEARCH_QUERIES.neutral;
    const randomQuery = queries[Math.floor(Math.random() * queries.length)] + ' official audio';

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(randomQuery)}&type=video&maxResults=${maxResults}&key=${apiKey}&videoCategoryId=10`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data: YouTubeResponse = await response.json();

    return data.items.map((item) => ({
      id: `youtube-music-${item.id.videoId}`,
      type: 'music' as const,
      title: item.snippet.title,
      description: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.high.url,
      moodTarget: [mood],
    }));
  } catch (error) {
    console.error('Error fetching YouTube music:', error);
    return [];
  }
};
