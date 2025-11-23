// Local storage utilities for privacy mode

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Mood history in local storage (for privacy mode)
const MOOD_HISTORY_KEY = 'mindwave_mood_history';
const USER_PREFERENCES_KEY = 'mindwave_user_preferences';

export const saveMoodToLocal = (mood: any) => {
  const history = getFromLocalStorage<any[]>(MOOD_HISTORY_KEY, []);
  history.push(mood);
  // Keep only last 100 entries
  const trimmed = history.slice(-100);
  saveToLocalStorage(MOOD_HISTORY_KEY, trimmed);
};

export const getMoodHistoryFromLocal = (): any[] => {
  return getFromLocalStorage<any[]>(MOOD_HISTORY_KEY, []);
};

export const saveUserPreferencesToLocal = (preferences: any) => {
  saveToLocalStorage(USER_PREFERENCES_KEY, preferences);
};

export const getUserPreferencesFromLocal = () => {
  return getFromLocalStorage(USER_PREFERENCES_KEY, {
    privacyMode: false,
    enableVoiceDetection: false,
    enableSocialMediaAnalysis: false,
  });
};
