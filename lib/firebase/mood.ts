import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from './config';
import { MoodScore, WeeklyInsight, User } from '@/types';

export const saveMoodScore = async (userId: string, moodScore: MoodScore) => {
  if (!db) {
    console.warn('Firestore not initialized. Mood not saved to cloud.');
    return;
  }

  try {
    const moodRef = collection(db, 'users', userId, 'moods');
    await addDoc(moodRef, {
      ...moodScore,
      timestamp: Timestamp.fromDate(moodScore.timestamp),
    });
  } catch (error) {
    console.error('Error saving mood score:', error);
    // Don't throw - allow app to continue working
  }
};

export const getMoodHistory = async (userId: string, days: number = 7): Promise<MoodScore[]> => {
  if (!db) {
    console.warn('Firestore not initialized. Returning empty mood history.');
    return [];
  }

  try {
    const moodRef = collection(db, 'users', userId, 'moods');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const q = query(
      moodRef,
      where('timestamp', '>=', Timestamp.fromDate(cutoffDate)),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as MoodScore[];
  } catch (error) {
    console.error('Error fetching mood history:', error);
    return []; // Return empty array instead of throwing
  }
};

export const saveWeeklyInsight = async (userId: string, insight: WeeklyInsight) => {
  if (!db) {
    console.warn('Firestore not initialized. Insight not saved to cloud.');
    return;
  }

  try {
    const insightRef = doc(db, 'users', userId, 'insights', insight.weekStart.toISOString());
    await setDoc(insightRef, {
      ...insight,
      weekStart: Timestamp.fromDate(insight.weekStart),
      moodTrends: insight.moodTrends.map((t) => ({
        ...t,
        date: Timestamp.fromDate(t.date),
      })),
      stressPatterns: insight.stressPatterns.map((p) => ({
        ...p,
        date: Timestamp.fromDate(p.date),
      })),
    });
  } catch (error) {
    console.error('Error saving weekly insight:', error);
    // Don't throw - allow app to continue
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  if (!db) {
    console.warn('Firestore not initialized. Cannot fetch user.');
    return null;
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        lastActive: data.lastActive.toDate(),
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null; // Return null instead of throwing
  }
};

export const createOrUpdateUser = async (user: User) => {
  if (!db) {
    console.warn('Firestore not initialized. User not saved to cloud.');
    return;
  }

  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      ...user,
      createdAt: Timestamp.fromDate(user.createdAt),
      lastActive: Timestamp.fromDate(user.lastActive),
    });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    // Don't throw - allow app to continue
  }
};
