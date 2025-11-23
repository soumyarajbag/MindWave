'use client';

import { motion } from 'framer-motion';
import { useMoodStore } from '@/store/moodStore';
import { getMicroHabit } from '@/lib/recommendations/generator';
import { useState, useEffect } from 'react';

export default function MicroHabits() {
  const { currentMood } = useMoodStore();
  const [habit, setHabit] = useState(getMicroHabit(currentMood?.category || 'neutral'));

  useEffect(() => {
    if (currentMood) {
      setHabit(getMicroHabit(currentMood.category));
    }
  }, [currentMood]);

  if (!habit) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">✨</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">Micro-Habit Suggestion</h3>
          <p className="text-white/90 mb-4">{habit.description}</p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition">
            Start Activity
          </button>
        </div>
      </div>
    </motion.div>
  );
}
