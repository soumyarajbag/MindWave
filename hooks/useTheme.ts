import { useMemo } from 'react';
import { useMoodStore } from '@/store/moodStore';
import { MoodCategory, WeatherCondition, ThemeName } from '@/types';

export interface ThemeConfig {
  name: ThemeName;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  animation: string;
}

const THEME_MAP: Record<MoodCategory, ThemeConfig> = {
  sad: {
    name: 'cozy-purple-blue',
    colors: {
      primary: '#6C5CE7',
      secondary: '#74B9FF',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#FFFFFF',
      accent: '#A29BFE',
    },
    animation: 'rain',
  },
  stressed: {
    name: 'zen-minimal',
    colors: {
      primary: '#A29BFE',
      secondary: '#74B9FF',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      text: '#2D3436',
      accent: '#A29BFE',
    },
    animation: 'pulse-slow',
  },
  happy: {
    name: 'vibrant-rainbow',
    colors: {
      primary: '#FFD700',
      secondary: '#FF6B6B',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      text: '#FFFFFF',
      accent: '#FFD700',
    },
    animation: 'float',
  },
  calm: {
    name: 'pastel-minimal',
    colors: {
      primary: '#74B9FF',
      secondary: '#A29BFE',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      text: '#2D3436',
      accent: '#74B9FF',
    },
    animation: 'pulse-slow',
  },
  energetic: {
    name: 'neon-spark',
    colors: {
      primary: '#FF6B6B',
      secondary: '#FFD700',
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      text: '#FFFFFF',
      accent: '#FF6B6B',
    },
    animation: 'float',
  },
  overwhelmed: {
    name: 'zen-minimal',
    colors: {
      primary: '#FD79A8',
      secondary: '#A29BFE',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      text: '#2D3436',
      accent: '#FD79A8',
    },
    animation: 'pulse-slow',
  },
  neutral: {
    name: 'pastel-minimal',
    colors: {
      primary: '#DFE6E9',
      secondary: '#74B9FF',
      background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
      text: '#2D3436',
      accent: '#74B9FF',
    },
    animation: 'pulse-slow',
  },
};

export const useTheme = (weatherCondition?: WeatherCondition) => {
  const { currentMood } = useMoodStore();

  const theme = useMemo(() => {
    const mood = currentMood?.category || 'neutral';
    const baseTheme = THEME_MAP[mood];

    // Adjust theme based on weather
    if (weatherCondition) {
      switch (weatherCondition) {
        case 'rain':
          return {
            ...baseTheme,
            animation: 'rain',
            colors: {
              ...baseTheme.colors,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            },
          };
        case 'snow':
          return {
            ...baseTheme,
            animation: 'snow',
          };
        case 'night':
          return {
            ...baseTheme,
            colors: {
              ...baseTheme.colors,
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              text: '#FFFFFF',
            },
          };
        default:
          return baseTheme;
      }
    }

    return baseTheme;
  }, [currentMood, weatherCondition]);

  return theme;
};
