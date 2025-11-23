'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveGratitudeEntry, getGratitudeEntries } from '@/lib/storage/activities';
import toast from 'react-hot-toast';

interface GratitudeEntry {
  id: string;
  text: string;
  date: Date;
}

interface GratitudeJournalProps {
  onComplete?: () => void;
}

export default function GratitudeJournal({ onComplete }: GratitudeJournalProps) {
  const [entry, setEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState<GratitudeEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadEntries = async () => {
    const entries = await getGratitudeEntries();
    setSavedEntries(entries);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSave = async () => {
    if (!entry.trim()) {
      toast.error("Please write something you're grateful for");
      return;
    }

    setIsLoading(true);
    try {
      await saveGratitudeEntry(entry.trim());
      toast.success('Gratitude entry saved! ✨');
      setEntry('');
      await loadEntries();
      onComplete?.();
    } catch (error) {
      console.error('Error saving gratitude entry:', error);
      toast.error('Failed to save entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Gratitude Journal</h3>
        <p className="text-white/70 mb-4">
          Take a moment to reflect on something you're grateful for today. This simple practice can
          help shift your perspective and improve your mood.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white/80">
            What are you grateful for today?
          </label>
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="I'm grateful for..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-white/50 mt-1">{entry.length}/500</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!entry.trim() || isLoading}
            className="flex-1 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition"
          >
            {isLoading ? 'Saving...' : 'Save Entry'}
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition"
          >
            {showHistory ? 'Hide' : 'View'} History
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showHistory && savedEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="font-semibold text-white/80">Your Gratitude Entries</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedEntries.slice(0, 10).map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-3 border border-white/10"
                >
                  <p className="text-sm text-white/90 mb-1">{item.text}</p>
                  <p className="text-xs text-white/50">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showHistory && savedEntries.length === 0 && (
        <p className="text-white/50 text-sm text-center py-4">
          No entries yet. Start by writing your first gratitude note!
        </p>
      )}
    </div>
  );
}
