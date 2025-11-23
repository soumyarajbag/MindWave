'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const features = [
    {
      icon: '🎯',
      title: 'Automated Mood Detection',
      description: 'AI-powered mood tracking using typing patterns, activity, and more',
    },
    {
      icon: '🎵',
      title: 'Personalized Recommendations',
      description: 'Music, videos, and activities tailored to your current mood',
    },
    {
      icon: '🤖',
      title: 'AI Companion',
      description: 'Chat with an empathetic AI that understands your emotional state',
    },
    {
      icon: '📊',
      title: 'Weekly Insights',
      description: 'Track your mood patterns and get AI-generated insights',
    },
    {
      icon: '🎨',
      title: 'Dynamic Themes',
      description: 'UI adapts to your mood and weather conditions',
    },
    {
      icon: '✨',
      title: 'Micro-Habits',
      description: 'Quick, actionable activities to improve your wellbeing',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="text-8xl mb-6"
          >
            🌈
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white">MindWave</h1>
          <p className="text-2xl md:text-3xl text-white/80 mb-8 max-w-2xl mx-auto">
            Your Intelligent Emotional Wellness Companion
          </p>
          <p className="text-lg text-white/70 mb-12 max-w-3xl mx-auto">
            A vibe-first, mood-aware experience that automatically detects your emotional state and
            provides personalized wellness recommendations to help you feel your best.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-white hover:bg-white/90 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all shadow-lg text-lg"
            >
              Get Started
            </Link>
            <button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg transition-all border border-white/20 text-lg"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-12 text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold text-white">Detect Your Mood</h3>
              <p className="text-white/70">
                MindWave automatically analyzes your typing patterns, activity, and device usage to
                detect your current mood.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold text-white">Get Recommendations</h3>
              <p className="text-white/70">
                Receive personalized content suggestions including music, videos, and activities
                tailored to your mood.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold text-white">Track & Improve</h3>
              <p className="text-white/70">
                Monitor your mood trends over time and get AI-generated insights to improve your
                emotional wellbeing.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Start Your Journey?</h2>
          <p className="text-xl text-white/70 mb-8">
            Join MindWave and discover a new way to understand and improve your emotional wellness.
          </p>
          <Link
            href="/login"
            className="inline-block bg-white hover:bg-white/90 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all shadow-lg text-lg"
          >
            Get Started Free
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
