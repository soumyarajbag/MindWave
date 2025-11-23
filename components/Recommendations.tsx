'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodStore } from '@/store/moodStore';
import { Recommendation } from '@/types';
import Image from 'next/image';

const TYPE_ICONS: Record<Recommendation['type'], string> = {
  music: '🎵',
  video: '📺',
  activity: '✨',
  movie: '🎬',
  meditation: '🧘',
  wallpaper: '🖼️',
};

const SOURCE_BADGES: Record<string, { label: string; color: string }> = {
  youtube: { label: 'YouTube', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  spotify: { label: 'Spotify', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  internal: { label: 'MindWave', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
};

export default function Recommendations() {
  const { recommendations, currentMood } = useMoodStore();

  if (!recommendations.length) {
    return null;
  }

  // Separate recommendations by type
  const musicRecs = recommendations.filter((r) => r.type === 'music');
  const videoRecs = recommendations.filter((r) => r.type === 'video');
  const otherRecs = recommendations.filter((r) => r.type !== 'music' && r.type !== 'video');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      <h2 className="text-2xl font-bold mb-6">Recommendations for You</h2>

      {/* Music Recommendations */}
      {musicRecs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🎵</span> Music
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {musicRecs.map((rec, index) => (
              <MusicCard key={rec.id} recommendation={rec} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Video Recommendations */}
      {videoRecs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📺</span> Videos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoRecs.map((rec, index) => (
              <VideoCard key={rec.id} recommendation={rec} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Other Recommendations */}
      {otherRecs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>✨</span> Activities & More
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherRecs.map((rec, index) => (
              <ActivityCard key={rec.id} recommendation={rec} index={index} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function MusicCard({ recommendation, index }: { recommendation: Recommendation; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlayPreview = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (recommendation.previewUrl) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setAudio(null);
        setIsPlaying(false);
      } else {
        const newAudio = new Audio(recommendation.previewUrl);
        newAudio.play();
        newAudio.onended = () => {
          setIsPlaying(false);
          setAudio(null);
        };
        setAudio(newAudio);
        setIsPlaying(true);
      }
    }
  };

  const handleClick = () => {
    if (recommendation.url) {
      window.open(recommendation.url, '_blank');
    }
  };

  const sourceBadge = recommendation.source ? SOURCE_BADGES[recommendation.source] : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer"
      onClick={handleClick}
    >
      {/* Thumbnail */}
      {recommendation.thumbnail ? (
        <div className="relative w-full h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <Image
            src={recommendation.thumbnail}
            alt={recommendation.title}
            fill
            className="object-cover"
            unoptimized
          />
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
            {recommendation.previewUrl ? (
              <button
                onClick={handlePlayPreview}
                className="w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-transform hover:scale-110"
              >
                {isPlaying ? (
                  <span className="text-xl">⏸</span>
                ) : (
                  <span className="text-xl ml-1">▶</span>
                )}
              </button>
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
            )}
          </div>
          {/* Source Badge */}
          {sourceBadge && (
            <div
              className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium border ${sourceBadge.color}`}
            >
              {sourceBadge.label}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
          <span className="text-4xl">🎵</span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-base mb-1 line-clamp-2">{recommendation.title}</h3>
        <p className="text-sm text-white/70 line-clamp-2">{recommendation.description}</p>
        {recommendation.url && (
          <div className="mt-2 flex items-center gap-2 text-xs text-white/50">
            <span>Open in {recommendation.source === 'spotify' ? 'Spotify' : 'YouTube'}</span>
            <span>→</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function VideoCard({ recommendation, index }: { recommendation: Recommendation; index: number }) {
  const handleClick = () => {
    if (recommendation.url) {
      window.open(recommendation.url, '_blank');
    }
  };

  const sourceBadge = recommendation.source ? SOURCE_BADGES[recommendation.source] : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer"
      onClick={handleClick}
    >
      {/* Thumbnail */}
      {recommendation.thumbnail ? (
        <div className="relative w-full h-40 bg-gradient-to-br from-red-500/20 to-orange-500/20">
          <Image
            src={recommendation.thumbnail}
            alt={recommendation.title}
            fill
            className="object-cover"
            unoptimized
          />
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-2xl ml-1">▶</span>
            </div>
          </div>
          {/* Source Badge */}
          {sourceBadge && (
            <div
              className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium border ${sourceBadge.color}`}
            >
              {sourceBadge.label}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
          <span className="text-4xl">📺</span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-base mb-1 line-clamp-2">{recommendation.title}</h3>
        <p className="text-sm text-white/70 line-clamp-2">{recommendation.description}</p>
        {recommendation.url && (
          <div className="mt-2 flex items-center gap-2 text-xs text-white/50">
            <span>Watch on YouTube</span>
            <span>→</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ActivityCard({
  recommendation,
  index,
}: {
  recommendation: Recommendation;
  index: number;
}) {
  const handleClick = () => {
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
