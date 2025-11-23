'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Recommendation } from '@/types';
import GratitudeJournal from './activities/GratitudeJournal';
import PriorityCheck from './activities/PriorityCheck';
import MindfulMoment from './activities/MindfulMoment';
import ProductivityBurst from './activities/ProductivityBurst';
import BreathingExercise from './BreathingExercise';
import { saveActivityCompletion } from '@/lib/storage/activities';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Recommendation | null;
}

export default function ActivityModal({ isOpen, onClose, activity }: ActivityModalProps) {
  if (!activity) return null;

  const handleComplete = () => {
    saveActivityCompletion(activity.id);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const renderActivity = () => {
    switch (activity.id) {
      case 'habit-sad':
        return <GratitudeJournal onComplete={handleComplete} />;
      case 'habit-stressed':
        return <BreathingExercise duration={120} onComplete={handleComplete} />;
      case 'habit-overwhelmed':
        return <PriorityCheck onComplete={handleComplete} />;
      case 'habit-calm':
        return <MindfulMoment onComplete={handleComplete} />;
      case 'habit-energetic':
        return <ProductivityBurst onComplete={handleComplete} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-white/70">{activity.description}</p>
            <button
              onClick={handleComplete}
              className="mt-4 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition"
            >
              Mark as Complete
            </button>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{activity.title}</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>

              <div className="text-white">{renderActivity()}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
