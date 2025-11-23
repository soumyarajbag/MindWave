import { create } from 'zustand';
import { MoodScore, MoodCategory, Recommendation, ChatMessage, User, AmbientScene } from '@/types';

interface MoodState {
  currentMood: MoodScore | null;
  moodHistory: MoodScore[];
  recommendations: Recommendation[];
  user: User | null;
  chatMessages: ChatMessage[];
  activeScene: AmbientScene | null;
  isLoading: boolean;
  error: string | null;
  
  setCurrentMood: (mood: MoodScore) => void;
  addMoodToHistory: (mood: MoodScore) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  setUser: (user: User) => void;
  addChatMessage: (message: ChatMessage) => void;
  setActiveScene: (scene: AmbientScene | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
}

export const useMoodStore = create<MoodState>((set) => ({
  currentMood: null,
  moodHistory: [],
  recommendations: [],
  user: null,
  chatMessages: [],
  activeScene: null,
  isLoading: false,
  error: null,

  setCurrentMood: (mood: MoodScore) => set({ currentMood: mood }),
  addMoodToHistory: (mood: MoodScore) => set((state) => ({ 
    moodHistory: [mood, ...state.moodHistory].slice(0, 100) // Keep last 100
  })),
  setRecommendations: (recommendations: Recommendation[]) => set({ recommendations }),
  setUser: (user: User) => set({ user }),
  addChatMessage: (message: ChatMessage) => set((state) => ({ 
    chatMessages: [...state.chatMessages, message] 
  })),
  setActiveScene: (scene: AmbientScene | null) => set({ activeScene: scene }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearChat: () => set({ chatMessages: [] }),
}));

