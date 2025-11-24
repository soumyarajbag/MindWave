'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MindfulMomentProps {
  onComplete?: () => void;
}

export default function MindfulMoment({ onComplete }: MindfulMomentProps) {
  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const prompts = [
    {
      title: 'Notice Your Breath',
      text: 'Take three deep breaths. Notice the air entering and leaving your body.',
      duration: 10,
    },
    {
      title: 'Observe Your Surroundings',
      text: 'Look around you. Name three things you can see, two things you can hear, and one thing you can feel.',
      duration: 20,
    },
    {
      title: 'Check In With Yourself',
      text: 'How are you feeling right now? Acknowledge your emotions without judgment.',
      duration: 15,
    },
    {
      title: 'Express Gratitude',
      text: 'Think of one thing you appreciate about this moment.',
      duration: 15,
    },
  ];

  useEffect(() => {
    if (step < prompts.length && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && step < prompts.length - 1) {
      setStep(step + 1);
      setTimeLeft(prompts[step + 1].duration);
    } else if (timeLeft === 0 && step === prompts.length - 1) {
      onComplete?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, step, onComplete]);

  const currentPrompt = prompts[step];
  const progress = ((60 - timeLeft) / 60) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Mindful Moment</h3>
        <p className="text-white/70 mb-4">
          Take a moment to be fully present. Follow along with this guided mindfulness exercise.
        </p>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <h4 className="text-xl font-semibold">{currentPrompt.title}</h4>
            <p className="text-white/80 text-lg">{currentPrompt.text}</p>
          </motion.div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>
              Step {step + 1} of {prompts.length}
            </span>
            <span>{timeLeft}s remaining</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          {prompts.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition ${
                index === step ? 'bg-white w-8' : index < step ? 'bg-white/50' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (step < prompts.length - 1) {
              setStep(step + 1);
              setTimeLeft(prompts[step + 1].duration);
            } else {
              onComplete?.();
            }
          }}
          className="w-full bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition text-sm"
        >
          {step < prompts.length - 1 ? 'Next Step' : 'Complete'}
        </button>
      </div>
    </div>
  );
}
