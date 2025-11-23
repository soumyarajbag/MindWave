'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreathingExerciseProps {
  duration?: number; // in seconds
  onComplete?: () => void;
}

export default function BreathingExercise({ duration = 120, onComplete }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [scale, setScale] = useState(1);
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  useEffect(() => {
    if (!isActive) return;

    const cycle = () => {
      // Inhale (4 seconds)
      setPhase('inhale');
      setScale(1.3);
      setTimeout(() => {
        // Hold (2 seconds)
        setPhase('hold');
        setTimeout(() => {
          // Exhale (4 seconds)
          setPhase('exhale');
          setScale(1);
          setTimeout(() => {
            // Pause (2 seconds)
            setPhase('pause');
            setTimeout(cycle, 2000);
          }, 4000);
        }, 2000);
      }, 4000);
    };

    cycle();
  }, [isActive]);

  const phaseText = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    pause: 'Pause',
  };

  const phaseColor = {
    inhale: 'from-blue-400 to-cyan-400',
    hold: 'from-cyan-400 to-purple-400',
    exhale: 'from-purple-400 to-pink-400',
    pause: 'from-pink-400 to-blue-400',
  };

  if (!isActive) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
        <h3 className="text-xl font-bold mb-4">Breathing Exercise</h3>
        <p className="text-white/70 mb-6">
          Take a moment to center yourself with a guided breathing exercise
        </p>
        <button
          onClick={() => setIsActive(true)}
          className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition"
        >
          Start Breathing
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{phaseText[phase]}</h3>
        <p className="text-white/70">
          Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </p>
      </div>

      <div className="flex items-center justify-center mb-6">
        <motion.div
          animate={{ scale }}
          transition={{
            duration: phase === 'inhale' || phase === 'exhale' ? 4 : 2,
            ease: 'easeInOut',
          }}
          className={`w-32 h-32 rounded-full bg-gradient-to-br ${phaseColor[phase]} flex items-center justify-center text-white text-2xl font-bold shadow-2xl`}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              {phase === 'inhale' && '↑'}
              {phase === 'hold' && '○'}
              {phase === 'exhale' && '↓'}
              {phase === 'pause' && '•'}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            setIsActive(false);
            setTimeLeft(duration);
            setPhase('inhale');
            setScale(1);
          }}
          className="text-white/70 hover:text-white text-sm transition"
        >
          Stop Exercise
        </button>
      </div>
    </div>
  );
}
