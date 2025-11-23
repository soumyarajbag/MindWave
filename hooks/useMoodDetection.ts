import { useEffect, useCallback, useRef } from 'react';
import { useMoodStore } from '@/store/moodStore';
import { moodEngine } from '@/lib/mood-detection/engine';
import { getWeatherData } from '@/lib/weather/api';
import { saveMoodScore } from '@/lib/firebase/mood';
import { getRecommendations } from '@/lib/recommendations/generator';
import { MoodSignals } from '@/types';

export const useMoodDetection = () => {
  const { 
    setCurrentMood, 
    addMoodToHistory, 
    setRecommendations,
    user,
    setLoading,
    setError,
  } = useMoodStore();
  
  const typingRef = useRef<{ text: string; backspaces: number }>({ text: '', backspaces: 0 });
  const activityRef = useRef({ tabSwitches: 0, timeOnSocialMedia: 0, readingTime: 0 });
  const lastDetectionRef = useRef<Date>(new Date());

  const detectMood = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get weather data
      const weatherData = await getWeatherData();
      const weatherImpact = moodEngine.getWeatherMoodImpact(weatherData.condition);

      // Build signals
      const signals: MoodSignals = {
        typingPattern: typingRef.current.text
          ? moodEngine.analyzeTypingPattern(typingRef.current.text, typingRef.current.backspaces)
          : undefined,
        activityPattern: activityRef.current.tabSwitches > 0
          ? moodEngine.analyzeActivityPattern(
              activityRef.current.tabSwitches,
              activityRef.current.timeOnSocialMedia,
              activityRef.current.readingTime
            )
          : undefined,
        deviceUsage: {
          lateNightUsage: new Date().getHours() >= 22 || new Date().getHours() < 6,
          activityLevel: 50, // Default, can be enhanced
        },
        weather: {
          condition: weatherData.condition,
          impact: weatherImpact,
        },
      };

      // Calculate mood
      const moodScore = moodEngine.detectMood(signals);
      
      // Update state
      setCurrentMood(moodScore);
      addMoodToHistory(moodScore);
      
      // Get recommendations
      const recommendations = getRecommendations(moodScore.category, 6);
      setRecommendations(recommendations);

      // Save to Firebase if user is logged in
      if (user?.id) {
        try {
          await saveMoodScore(user.id, moodScore);
        } catch (error) {
          console.error('Failed to save mood to Firebase:', error);
        }
      }

      // Reset tracking
      typingRef.current = { text: '', backspaces: 0 };
      activityRef.current = { tabSwitches: 0, timeOnSocialMedia: 0, readingTime: 0 };
      lastDetectionRef.current = new Date();
    } catch (error) {
      console.error('Error detecting mood:', error);
      setError('Failed to detect mood. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, setCurrentMood, addMoodToHistory, setRecommendations, setLoading, setError]);

  // Track typing
  const trackTyping = useCallback((text: string, backspaces: number = 0) => {
    typingRef.current.text += text;
    typingRef.current.backspaces += backspaces;
  }, []);

  // Track activity
  const trackActivity = useCallback((type: 'tabSwitch' | 'socialMedia' | 'reading', value: number = 1) => {
    switch (type) {
      case 'tabSwitch':
        activityRef.current.tabSwitches += value;
        break;
      case 'socialMedia':
        activityRef.current.timeOnSocialMedia += value;
        break;
      case 'reading':
        activityRef.current.readingTime += value;
        break;
    }
  }, []);

  // Auto-detect every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastDetection = Date.now() - lastDetectionRef.current.getTime();
      if (timeSinceLastDetection >= 5 * 60 * 1000) { // 5 minutes
        detectMood();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [detectMood]);

  // Track tab visibility changes (potential stress indicator)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab switched away
        trackActivity('tabSwitch', 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [trackActivity]);

  return {
    detectMood,
    trackTyping,
    trackActivity,
  };
};

