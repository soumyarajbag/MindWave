'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useMoodStore } from '@/store/moodStore';
import { getMicroHabit } from '@/lib/recommendations/generator';
import ActivityModal from './ActivityModal';
import { getActivityCompletions } from '@/lib/storage/activities';

const HABIT_ICONS: Record = {
  'habit-sad': '💝',
  'habit-stressed': '🧘',
  'habit-overwhelmed': '🎯',
  'habit-calm': '🧠',
  'habit-energetic': '⚡',
  'habit-happy': '🌟',
  'habit-neutral': '✨',
};

export default function MicroHabits() {
  const { currentMood } = useMoodStore();
  const [habit, setHabit] = useState(getMicroHabit(currentMood?.category || 'neutral'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completions, setCompletions] = useState<Record>({});

  useEffect(() => {
    if (currentMood) {
      setHabit(getMicroHabit(currentMood.category));
    }
  }, [currentMood]);

  useEffect(() => {
    setCompletions(getActivityCompletions());
  }, [isModalOpen]);

  if (!habit) return null;

  const completionCount = completions[habit.id] || 0;
  const icon = HABIT_ICONS[habit.id] || '✨';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">{icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Micro-Habit Suggestion</h3>
              {completionCount > 0 && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  Completed {completionCount}x
                </span>
              )}
            </div>
            <p className="text-white/90 mb-4">{habit.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Start Activity
              </button>
              {habit.duration && (
                <span className="text-xs text-white/50 flex items-center px-2">
                  {Math.floor(habit.duration / 60)} min
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <ActivityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} activity={habit} />
    </>
  );
}
