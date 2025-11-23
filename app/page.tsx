'use client';

import { useEffect, useState } from 'react';
import { useMoodStore } from '@/store/moodStore';
import { useMoodDetection } from '@/hooks/useMoodDetection';
import { useTheme } from '@/hooks/useTheme';
import { getWeatherData } from '@/lib/weather/api';
import { applyTheme } from '@/lib/utils/theme';
import { initializeFirebase } from '@/lib/firebase/config';
import MoodDisplay from '@/components/MoodDisplay';
import Recommendations from '@/components/Recommendations';
import AICompanion from '@/components/AICompanion';
import WeeklyInsights from '@/components/WeeklyInsights';
import AmbientScene from '@/components/AmbientScene';
import Header from '@/components/Header';
import MicroHabits from '@/components/MicroHabits';
import PrivacyMode from '@/components/PrivacyMode';
import { WeatherData } from '@/lib/weather/api';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [mounted, setMounted] = useState(false);
  const { detectMood, trackTyping } = useMoodDetection();
  const { currentMood, activeScene } = useMoodStore();
  const theme = useTheme(weather?.condition);

  useEffect(() => {
    setMounted(true);
    initializeFirebase();

    // Load weather data
    getWeatherData().then(setWeather).catch(console.error);

    // Initial mood detection
    detectMood();
  }, [detectMood]);

  useEffect(() => {
    if (mounted && theme) {
      applyTheme(theme);
    }
  }, [theme, mounted]);

  // Track typing for mood detection
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        trackTyping('', 1);
      } else if (e.key.length === 1) {
        trackTyping(e.key, 0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [trackTyping]);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Ambient Scene Background */}
      {activeScene && <AmbientScene scene={activeScene} />}

      {/* Weather-based particles */}
      {weather && !activeScene && <WeatherParticles condition={weather.condition} />}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <Header weather={weather} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <MoodDisplay />
            <MicroHabits />
            <Recommendations />
            <WeeklyInsights />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <PrivacyMode />
            <AICompanion />
          </div>
        </div>
      </div>
    </main>
  );
}

// Weather Particles Component
function WeatherParticles({ condition }: { condition: string }) {
  if (condition === 'rain') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.3 + Math.random() * 0.4}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (condition === 'snow') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            ❄
          </div>
        ))}
      </div>
    );
  }

  return null;
}
