'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ProductivityBurstProps {
  onComplete?: () => void;
}

export default function ProductivityBurst({ onComplete }: ProductivityBurstProps) {
  const [task, setTask] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setCompleted(true);
            toast.success("Time's up! Great work! 🎉");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!task.trim()) {
      toast.error('Please enter a task to focus on');
      return;
    }
    setIsActive(true);
  };

  const handleComplete = () => {
    toast.success('Task completed! Well done! ✨');
    onComplete?.();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Productivity Burst</h3>
        <p className="text-white/70 mb-4">
          Channel your energy into a focused 5-minute task. Set a timer and give it your full
          attention.
        </p>
      </div>

      {!completed ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">
              What will you focus on?
            </label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g., Reply to 3 emails, Organize desk, Write outline..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              disabled={isActive}
            />
          </div>

          {!isActive ? (
            <button
              onClick={handleStart}
              disabled={!task.trim()}
              className="w-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition"
            >
              Start 5-Minute Focus Session
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <motion.div
                  key={timeLeft}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-6xl font-bold mb-2"
                >
                  {formatTime(timeLeft)}
                </motion.div>
                <p className="text-white/70">Focus on: {task}</p>
              </div>

              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / 300) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>

              <button
                onClick={() => {
                  setIsActive(false);
                  setTimeLeft(300);
                }}
                className="w-full bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition text-sm"
              >
                Stop Timer
              </button>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h4 className="text-xl font-semibold">Great job!</h4>
          <p className="text-white/70">
            You completed: <span className="font-semibold">{task}</span>
          </p>
          <button
            onClick={handleComplete}
            className="w-full bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition"
          >
            Done
          </button>
        </motion.div>
      )}
    </div>
  );
}
