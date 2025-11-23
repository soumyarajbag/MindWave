'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMoodStore } from '@/store/moodStore';
import { getUserPreferencesFromLocal, saveUserPreferencesToLocal } from '@/lib/storage/localStorage';
import { User } from '@/types';

export default function PrivacyMode() {
  const { user, setUser } = useMoodStore();
  const [privacyMode, setPrivacyMode] = useState(false);

  useEffect(() => {
    if (user) {
      setPrivacyMode(user.preferences.privacyMode);
    } else {
      const localPrefs = getUserPreferencesFromLocal();
      setPrivacyMode(localPrefs.privacyMode);
    }
  }, [user]);

  const handleToggle = () => {
    const newPrivacyMode = !privacyMode;
    setPrivacyMode(newPrivacyMode);

    if (user) {
      const updatedUser: User = {
        ...user,
        preferences: {
          ...user.preferences,
          privacyMode: newPrivacyMode,
        },
      };
      setUser(updatedUser);
      // Save to Firebase if logged in
      // This would require a saveUser function
    } else {
      const localPrefs = getUserPreferencesFromLocal();
      saveUserPreferencesToLocal({
        ...localPrefs,
        privacyMode: newPrivacyMode,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm mb-1">Privacy Mode</h3>
          <p className="text-xs text-white/70">
            {privacyMode
              ? 'Data stored locally only'
              : 'Data synced to cloud'}
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            privacyMode ? 'bg-green-500' : 'bg-gray-400'
          }`}
        >
          <motion.div
            className="w-5 h-5 bg-white rounded-full absolute top-0.5"
            animate={{ x: privacyMode ? 26 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>
    </motion.div>
  );
}

