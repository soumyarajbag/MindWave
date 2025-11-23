'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { initializeFirebase, auth } from '@/lib/firebase/config';
import { createOrUpdateUser } from '@/lib/firebase/mood';
import { useMoodStore } from '@/store/moodStore';
import { User } from '@/types';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useMoodStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Initialize Firebase first
    const firebaseInit = initializeFirebase();

    if (!firebaseInit.app || !firebaseInit.auth) {
      console.error('Firebase not initialized. This usually means:');
      console.error('1. Environment variables are missing in .env.local');
      console.error('2. Firebase Authentication is not enabled in Firebase Console');
      console.error('3. Google sign-in provider is not enabled');
      setIsChecking(false);
      setAuthReady(false);
      return;
    }

    // Verify auth is properly configured
    const initializedAuth = firebaseInit.auth;
    if (!initializedAuth.app) {
      console.error('Firebase Auth app not available');
      setIsChecking(false);
      setAuthReady(false);
      return;
    }

    setAuthReady(true);

    const unsubscribe = onAuthStateChanged(initializedAuth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          name: firebaseUser.displayName || undefined,
          preferences: {
            privacyMode: false,
            enableVoiceDetection: false,
            enableSocialMediaAnalysis: false,
          },
          createdAt: new Date(),
          lastActive: new Date(),
        };

        setUser(user);
        await createOrUpdateUser(user);
        router.push('/dashboard');
      } else {
        setIsChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router, setUser]);

  const handleGoogleLogin = async () => {
    if (!authReady) {
      toast.error('Authentication is still initializing. Please wait a moment and try again.');
      return;
    }

    // Ensure Firebase is initialized
    const firebaseInit = initializeFirebase();
    const currentAuth = firebaseInit.auth;

    if (!currentAuth || !firebaseInit.app) {
      const missingVars = [];
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
        missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY');
      if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
        missingVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
      if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
        missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');

      toast.error(
        `Firebase not configured. Missing: ${missingVars.join(', ')}. Please check your .env.local file.`
      );
      console.error(
        'Firebase auth is not initialized. Missing environment variables:',
        missingVars
      );
      return;
    }

    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const result = await signInWithPopup(currentAuth, provider);
      const user = result.user;

      const mindwaveUser: User = {
        id: user.uid,
        email: user.email || undefined,
        name: user.displayName || undefined,
        preferences: {
          privacyMode: false,
          enableVoiceDetection: false,
          enableSocialMediaAnalysis: false,
        },
        createdAt: new Date(),
        lastActive: new Date(),
      };

      setUser(mindwaveUser);
      await createOrUpdateUser(mindwaveUser);
      toast.success('Welcome to MindWave! 🌈');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled');
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl mb-4"
            >
              🌈
            </motion.div>
            <h1 className="text-4xl font-bold mb-2 text-white">MindWave</h1>
            <p className="text-white/70 text-lg">Your Emotional Wellness Companion</p>
          </div>

          <div className="space-y-4">
            {!authReady && !isChecking && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                <p className="text-red-200 text-sm">
                  ⚠️ Firebase Authentication is not configured. Please check:
                </p>
                <ul className="text-red-200/80 text-xs mt-2 list-disc list-inside space-y-1">
                  <li>Firebase environment variables are set in .env.local</li>
                  <li>Google sign-in is enabled in Firebase Console</li>
                  <li>OAuth consent screen is configured in Google Cloud Console</li>
                </ul>
              </div>
            )}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading || !authReady}
              className="w-full bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-white/50 text-sm">
                By continuing, you agree to MindWave&apos;s Terms of Service
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/60 text-sm text-center">
              Sign in to track your mood, get personalized recommendations, and access your wellness
              insights.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
