'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMoodStore } from '@/store/moodStore';
import { getMoodHistory } from '@/lib/firebase/mood';
import { generateWeeklyInsight } from '@/lib/gemini/client';
import { WeeklyInsight, MoodCategory } from '@/types';
import { format, startOfWeek } from 'date-fns';

const MOOD_COLORS: Record<MoodCategory, string> = {
  happy: '#FFD700',
  energetic: '#FF6B6B',
  sad: '#6C5CE7',
  stressed: '#A29BFE',
  calm: '#74B9FF',
  overwhelmed: '#FD79A8',
  neutral: '#DFE6E9',
};

export default function WeeklyInsights() {
  const { user, moodHistory } = useMoodStore();
  const [insight, setInsight] = useState<WeeklyInsight | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInsights = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        // Get mood history from Firebase
        const history = await getMoodHistory(user.id, 7);
        
        if (history.length === 0) {
          setLoading(false);
          return;
        }

        // Generate AI insights
        const aiInsight = await generateWeeklyInsight(history);
        
        const weeklyInsight: WeeklyInsight = {
          weekStart: startOfWeek(new Date()),
          moodTrends: history.map(m => ({
            date: m.timestamp,
            mood: m.category,
            score: m.score,
          })),
          ...aiInsight,
        };

        setInsight(weeklyInsight);
      } catch (error) {
        console.error('Error loading insights:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [user, moodHistory]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-white/20 rounded"></div>
        </div>
      </motion.div>
    );
  }

  if (!insight || insight.moodTrends.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      >
        <h2 className="text-xl font-bold mb-4">Weekly Insights</h2>
        <p className="text-white/70 text-sm">
          Check back after tracking your mood for a few days to see insights!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      <h2 className="text-xl font-bold mb-6">Weekly Insights</h2>

      {/* Mood Trends Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3 text-white/80">Mood Trends</h3>
        <div className="flex items-end gap-2 h-32">
          {insight.moodTrends.slice(0, 7).map((trend, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t transition-all hover:opacity-80"
                style={{
                  height: `${(trend.score / 100) * 100}%`,
                  backgroundColor: MOOD_COLORS[trend.mood],
                  minHeight: '4px',
                }}
                title={`${format(trend.date, 'MMM d')}: ${trend.mood} (${trend.score})`}
              />
              <span className="text-xs text-white/50 mt-2">
                {format(trend.date, 'MMM d')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      {insight.aiRecommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-white/80">AI Recommendations</h3>
          <ul className="space-y-2">
            {insight.aiRecommendations.map((rec, index) => (
              <li key={index} className="text-sm text-white/90 flex items-start gap-2">
                <span className="text-white/50">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Triggers */}
      {insight.triggers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-white/80">Noticed Triggers</h3>
          <div className="flex flex-wrap gap-2">
            {insight.triggers.map((trigger, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80"
              >
                {trigger}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

