'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useMoodStore } from '@/store/moodStore';
import { useMoodDetection } from '@/hooks/useMoodDetection';
import { WeatherData } from '@/lib/weather/api';
import { AmbientScene } from '@/types';
import toast from 'react-hot-toast';

const SCENES: AmbientScene[] = [
  { id: 'rain', name: 'Rain on Window', type: 'rain', active: false },
  { id: 'cozy', name: 'Cozy Room', type: 'cozy-room', active: false },
  { id: 'lanterns', name: 'Floating Lanterns', type: 'lanterns', active: false },
  { id: 'galaxy', name: 'Galaxy Scene', type: 'galaxy', active: false },
  { id: 'beach', name: 'Beach Waves', type: 'beach', active: false },
];

export default function Header({ weather }: { weather: WeatherData | null }) {
  const router = useRouter();
  const { activeScene, setActiveScene, user } = useMoodStore();
  const { detectMood } = useMoodDetection();
  const [showScenes, setShowScenes] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    if (!auth) return;

    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      router.push('/landing');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleSceneChange = (scene: AmbientScene) => {
    setActiveScene(scene.active ? null : scene);
  };

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold mb-2"
        >
          🌈 MindWave
        </motion.h1>
        {weather && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-sm"
          >
            {weather.location} • {weather.temperature}°C • {weather.description}
          </motion.p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* User Menu */}
        {user && auth && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition border border-white/20 flex items-center gap-2"
            >
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </span>
              {user.name || user.email || 'User'}
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 bg-white/20 backdrop-blur-lg rounded-lg p-2 min-w-[200px] border border-white/20 z-50"
              >
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-sm font-semibold">{user.name || 'User'}</p>
                  <p className="text-xs text-white/70">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition mt-2 text-sm"
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Scene Selector */}
        <div className="relative">
          <button
            onClick={() => setShowScenes(!showScenes)}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition border border-white/20"
          >
            🎭 Scenes
          </button>

          {showScenes && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 bg-white/20 backdrop-blur-lg rounded-lg p-2 min-w-[200px] border border-white/20 z-50"
            >
              {SCENES.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    handleSceneChange(scene);
                    setShowScenes(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-white/10 transition ${
                    activeScene?.id === scene.id ? 'bg-white/20' : ''
                  }`}
                >
                  {scene.name}
                </button>
              ))}
              {activeScene && (
                <button
                  onClick={() => {
                    setActiveScene(null);
                    setShowScenes(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition mt-2 border-t border-white/10 pt-2"
                >
                  Disable Scene
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* Detect Mood Button */}
        <button
          onClick={detectMood}
          className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-semibold transition border border-white/20"
        >
          🔍 Detect Mood
        </button>
      </div>
    </header>
  );
}
