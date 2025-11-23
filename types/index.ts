export type MoodCategory =
  | 'happy'
  | 'energetic'
  | 'sad'
  | 'stressed'
  | 'calm'
  | 'overwhelmed'
  | 'neutral';

export type WeatherCondition = 'rain' | 'sunny' | 'cloudy' | 'snow' | 'night' | 'fog';

export type ThemeName =
  | 'cozy-purple-blue'
  | 'zen-minimal'
  | 'vibrant-rainbow'
  | 'pastel-minimal'
  | 'neon-spark';

export interface MoodScore {
  category: MoodCategory;
  score: number; // 0-100
  confidence: number; // 0-1
  timestamp: Date;
  signals: MoodSignals;
}

export interface MoodSignals {
  typingPattern?: {
    sentiment: number; // -1 to 1
    speed: number;
    backspaces: number;
    wordSentiment: number;
  };
  activityPattern?: {
    tabSwitches: number;
    timeOnSocialMedia: number;
    readingTime: number;
  };
  deviceUsage?: {
    lateNightUsage: boolean;
    activityLevel: number;
  };
  weather?: {
    condition: WeatherCondition;
    impact: number; // -1 to 1
  };
  voiceTone?: {
    energy: number;
    sentiment: number;
  };
}

export interface Recommendation {
  id: string;
  type: 'music' | 'video' | 'activity' | 'movie' | 'meditation' | 'wallpaper';
  title: string;
  description: string;
  url?: string;
  thumbnail?: string;
  moodTarget: MoodCategory[];
  duration?: number;
  previewUrl?: string; // For Spotify audio previews
  source?: 'youtube' | 'spotify' | 'internal'; // Track where recommendation came from
}

export interface WeeklyInsight {
  weekStart: Date;
  moodTrends: {
    date: Date;
    mood: MoodCategory;
    score: number;
  }[];
  triggers: string[];
  activeTime: {
    hour: number;
    activity: number;
  }[];
  energyLevels: number[];
  stressPatterns: {
    date: Date;
    level: number;
  }[];
  aiRecommendations: string[];
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  preferences: {
    privacyMode: boolean;
    enableVoiceDetection: boolean;
    enableSocialMediaAnalysis: boolean;
    preferredTheme?: ThemeName;
  };
  createdAt: Date;
  lastActive: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AmbientScene {
  id: string;
  name: string;
  type: 'rain' | 'cozy-room' | 'lanterns' | 'galaxy' | 'beach';
  active: boolean;
}
