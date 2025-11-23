'use client';

import { motion } from 'framer-motion';
import { useMoodStore } from '@/store/moodStore';
import { MoodCategory } from '@/types';

const MOOD_EMOJIS: Record<MoodCategory, string> = {
  happy: '😊',
  energetic: '⚡',
  sad: '😢',
  stressed: '😰',
  calm: '😌',
  overwhelmed: '😵',
  neutral: '😐',
};

const MOOD_LABELS: Record<MoodCategory, string> = {
  happy: 'Happy',
  energetic: 'Energetic',
  sad: 'Sad',
  stressed: 'Stressed',
  calm: 'Calm',
  overwhelmed: 'Overwhelmed',
  neutral: 'Neutral',
};

export default function MoodDisplay() {
  const { currentMood, isLoading } = useMoodStore();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
          <div className="h-16 bg-white/20 rounded"></div>
        </div>
      </motion.div>
    );
  }

  if (!currentMood) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <p className="text-lg text-center text-white/80">
          Detecting your mood...
        </p>
      </motion.div>
    );
  }

  const { category, score, confidence } = currentMood;
  const emoji = MOOD_EMOJIS[category];
  const label = MOOD_LABELS[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Current Mood</h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-6xl"
        >
          {emoji}
        </motion.div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold">{label}</span>
            <span className="text-sm text-white/70">
              {Math.round(confidence * 100)}% confidence
            </span>
          </div>
          
          {/* Mood Score Bar */}
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
          <p className="text-sm text-white/70 mt-1">Mood Score: {score}/100</p>
        </div>

        {/* Mood Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/90 mt-4"
        >
          {getMoodDescription(category, score)}
        </motion.p>
      </div>
    </motion.div>
  );
}

function getMoodDescription(category: MoodCategory, score: number): string {
  const descriptions: Record<MoodCategory, string> = {
    happy: "You're feeling great! This is a perfect time to spread positivity and enjoy the moment.",
    energetic: "You're full of energy! Channel this into something productive or creative.",
    sad: "It's okay to feel this way. Take some time for self-care and gentle activities.",
    stressed: "You're feeling overwhelmed. Let's take a moment to breathe and reset.",
    calm: "You're in a peaceful state. This is perfect for reflection and mindful activities.",
    overwhelmed: "Things feel like a lot right now. Remember to take breaks and be kind to yourself.",
    neutral: "You're in a balanced state. A good time to explore new things or maintain your routine.",
  };
  return descriptions[category];
}

