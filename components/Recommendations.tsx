'use client';

import { motion } from 'framer-motion';
import { useMoodStore } from '@/store/moodStore';
import { Recommendation } from '@/types';

const TYPE_ICONS: Record<Recommendation['type'], string> = {
  music: '🎵',
  video: '📺',
  activity: '✨',
  movie: '🎬',
  meditation: '🧘',
  wallpaper: '🖼️',
};

export default function Recommendations() {
  const { recommendations, currentMood } = useMoodStore();

  if (!recommendations.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      <h2 className="text-2xl font-bold mb-6">
        Recommendations for You
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={rec.id} recommendation={rec} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

function RecommendationCard({ 
  recommendation, 
  index 
}: { 
  recommendation: Recommendation; 
  index: number;
}) {
  const handleClick = () => {
    // Handle recommendation click
    if (recommendation.url) {
      window.open(recommendation.url, '_blank');
    } else {
      // Handle different recommendation types
      switch (recommendation.type) {
        case 'activity':
          // Show activity modal or navigate
          break;
        case 'meditation':
          // Start meditation session
          break;
        default:
          break;
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={handleClick}
      className="bg-white/5 hover:bg-white/10 rounded-xl p-4 cursor-pointer transition-all border border-white/10 hover:border-white/30"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{TYPE_ICONS[recommendation.type]}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{recommendation.title}</h3>
          <p className="text-sm text-white/70 mb-2">{recommendation.description}</p>
          {recommendation.duration && (
            <span className="text-xs text-white/50">
              {Math.floor(recommendation.duration / 60)} min
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

