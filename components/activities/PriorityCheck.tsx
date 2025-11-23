'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { savePriorityCheck, getPriorityChecks } from '@/lib/storage/activities';
import toast from 'react-hot-toast';

interface PriorityItem {
  id: string;
  text: string;
  priority: number;
  date: Date;
}

interface PriorityCheckProps {
  onComplete?: () => void;
}

export default function PriorityCheck({ onComplete }: PriorityCheckProps) {
  const [priorities, setPriorities] = useState<string[]>(['', '', '']);
  const [selectedPriority, setSelectedPriority] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPriority = () => {
    if (priorities.length < 5) {
      setPriorities([...priorities, '']);
    }
  };

  const handlePriorityChange = (index: number, value: string) => {
    const newPriorities = [...priorities];
    newPriorities[index] = value;
    setPriorities(newPriorities);
  };

  const handleSave = async () => {
    const filledPriorities = priorities.filter((p) => p.trim());
    if (filledPriorities.length === 0) {
      toast.error('Please add at least one priority');
      return;
    }

    if (selectedPriority === null) {
      toast.error('Please select your top priority');
      return;
    }

    setIsLoading(true);
    try {
      await savePriorityCheck(filledPriorities, selectedPriority);
      toast.success('Priorities saved! Focus on one thing at a time. ✨');
      setPriorities(['', '', '']);
      setSelectedPriority(null);
      onComplete?.();
    } catch (error) {
      console.error('Error saving priorities:', error);
      toast.error('Failed to save priorities');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Priority Check</h3>
        <p className="text-white/70 mb-4">
          When everything feels overwhelming, break it down. List your priorities and identify the
          ONE most important thing right now.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3 text-white/80">
            What needs your attention? (List up to 5)
          </label>
          <div className="space-y-2">
            {priorities.map((priority, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={priority}
                  onChange={(e) => handlePriorityChange(index, e.target.value)}
                  placeholder={`Priority ${index + 1}...`}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  onClick={() => setSelectedPriority(index)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${
                    selectedPriority === index
                      ? 'bg-white/30 border-white/50'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {selectedPriority === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-white rounded-full"
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
          {priorities.length < 5 && (
            <button
              onClick={handleAddPriority}
              className="mt-2 text-sm text-white/70 hover:text-white transition"
            >
              + Add another priority
            </button>
          )}
        </div>

        {selectedPriority !== null && priorities[selectedPriority] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 rounded-lg p-4 border border-white/20"
          >
            <p className="text-sm text-white/70 mb-1">Your top priority:</p>
            <p className="font-semibold text-lg">{priorities[selectedPriority]}</p>
            <p className="text-xs text-white/50 mt-2">
              Focus on this one thing. Everything else can wait.
            </p>
          </motion.div>
        )}

        <button
          onClick={handleSave}
          disabled={isLoading || selectedPriority === null}
          className="w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition"
        >
          {isLoading ? 'Saving...' : 'Save Priorities'}
        </button>
      </div>
    </div>
  );
}
