import { MoodCategory, Recommendation } from '@/types';

const RECOMMENDATIONS: Record<MoodCategory, Recommendation[]> = {
  happy: [
    {
      id: 'happy-1',
      type: 'music',
      title: 'Upbeat Pop Mix',
      description: 'Keep the good vibes going with energetic pop hits',
      moodTarget: ['happy', 'energetic'],
    },
    {
      id: 'happy-2',
      type: 'video',
      title: 'Funny Compilation',
      description: 'Laugh out loud with hilarious moments',
      moodTarget: ['happy'],
    },
    {
      id: 'happy-3',
      type: 'activity',
      title: 'Creative Challenge',
      description: 'Channel your positive energy into something creative',
      moodTarget: ['happy', 'energetic'],
    },
  ],
  energetic: [
    {
      id: 'energetic-1',
      type: 'music',
      title: 'Workout Playlist',
      description: 'High-energy tracks to fuel your productivity',
      moodTarget: ['energetic', 'happy'],
    },
    {
      id: 'energetic-2',
      type: 'activity',
      title: 'Productivity Burst',
      description: 'Tackle that task you\'ve been putting off',
      moodTarget: ['energetic'],
    },
    {
      id: 'energetic-3',
      type: 'video',
      title: 'Motivational Shorts',
      description: 'Get inspired and stay motivated',
      moodTarget: ['energetic'],
    },
  ],
  sad: [
    {
      id: 'sad-1',
      type: 'music',
      title: 'Comforting Melodies',
      description: 'Gentle, soothing sounds to help you feel better',
      moodTarget: ['sad', 'calm'],
    },
    {
      id: 'sad-2',
      type: 'activity',
      title: 'Gratitude Journal',
      description: 'Write down three things you\'re grateful for',
      moodTarget: ['sad'],
    },
    {
      id: 'sad-3',
      type: 'meditation',
      title: '5-Minute Breathing',
      description: 'A quick breathing exercise to center yourself',
      moodTarget: ['sad', 'stressed'],
    },
    {
      id: 'sad-4',
      type: 'video',
      title: 'Uplifting Stories',
      description: 'Heartwarming content to lift your spirits',
      moodTarget: ['sad'],
    },
  ],
  stressed: [
    {
      id: 'stressed-1',
      type: 'meditation',
      title: 'Stress Relief Meditation',
      description: 'A guided session to help you unwind',
      moodTarget: ['stressed', 'overwhelmed'],
    },
    {
      id: 'stressed-2',
      type: 'activity',
      title: '2-Minute Breathing',
      description: 'Quick breathing exercise to reduce stress',
      moodTarget: ['stressed'],
    },
    {
      id: 'stressed-3',
      type: 'music',
      title: 'Calming Ambient Sounds',
      description: 'Peaceful sounds to help you relax',
      moodTarget: ['stressed', 'calm'],
    },
    {
      id: 'stressed-4',
      type: 'activity',
      title: 'Take a Walk',
      description: 'A short walk can do wonders for stress',
      moodTarget: ['stressed', 'overwhelmed'],
    },
  ],
  calm: [
    {
      id: 'calm-1',
      type: 'music',
      title: 'Peaceful Instrumentals',
      description: 'Maintain your zen with tranquil melodies',
      moodTarget: ['calm'],
    },
    {
      id: 'calm-2',
      type: 'activity',
      title: 'Mindful Reading',
      description: 'Dive into a good book or article',
      moodTarget: ['calm'],
    },
    {
      id: 'calm-3',
      type: 'meditation',
      title: 'Extended Meditation',
      description: 'Deepen your calm with a longer session',
      moodTarget: ['calm'],
    },
  ],
  overwhelmed: [
    {
      id: 'overwhelmed-1',
      type: 'meditation',
      title: 'Emergency Calm Session',
      description: 'A quick reset when everything feels too much',
      moodTarget: ['overwhelmed', 'stressed'],
    },
    {
      id: 'overwhelmed-2',
      type: 'activity',
      title: 'Break It Down',
      description: 'Let\'s break your tasks into smaller steps',
      moodTarget: ['overwhelmed'],
    },
    {
      id: 'overwhelmed-3',
      type: 'music',
      title: 'Soothing Sounds',
      description: 'Gentle music to help you recenter',
      moodTarget: ['overwhelmed', 'calm'],
    },
    {
      id: 'overwhelmed-4',
      type: 'activity',
      title: 'Talk It Out',
      description: 'Chat with your AI companion about what\'s on your mind',
      moodTarget: ['overwhelmed'],
    },
  ],
  neutral: [
    {
      id: 'neutral-1',
      type: 'music',
      title: 'Chill Vibes',
      description: 'A balanced mix to match your mood',
      moodTarget: ['neutral', 'calm'],
    },
    {
      id: 'neutral-2',
      type: 'activity',
      title: 'Explore Something New',
      description: 'Try a new hobby or learn something interesting',
      moodTarget: ['neutral'],
    },
    {
      id: 'neutral-3',
      type: 'video',
      title: 'Interesting Content',
      description: 'Discover something fascinating',
      moodTarget: ['neutral'],
    },
  ],
};

export const getRecommendations = (mood: MoodCategory, count: number = 5): Recommendation[] => {
  const moodRecommendations = RECOMMENDATIONS[mood] || RECOMMENDATIONS.neutral;
  const otherMoodRecommendations = Object.values(RECOMMENDATIONS)
    .flat()
    .filter(rec => rec.moodTarget.includes(mood) && !moodRecommendations.includes(rec));
  
  // Mix recommendations from current mood and related moods
  const allRecommendations = [
    ...moodRecommendations,
    ...otherMoodRecommendations.slice(0, 3),
  ];
  
  // Shuffle and return requested count
  const shuffled = allRecommendations.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getMicroHabit = (mood: MoodCategory): Recommendation | null => {
  const habits: Partial<Record<MoodCategory, Recommendation>> = {
    stressed: {
      id: 'habit-stressed',
      type: 'activity',
      title: '2-Minute Breathing',
      description: 'Take a moment to breathe and reset',
      moodTarget: ['stressed'],
      duration: 120,
    },
    sad: {
      id: 'habit-sad',
      type: 'activity',
      title: 'Gratitude Moment',
      description: 'Write down one thing you\'re grateful for',
      moodTarget: ['sad'],
      duration: 60,
    },
    energetic: {
      id: 'habit-energetic',
      type: 'activity',
      title: 'Productivity Burst',
      description: 'Channel your energy into a quick task',
      moodTarget: ['energetic'],
      duration: 300,
    },
    happy: {
      id: 'habit-happy',
      type: 'activity',
      title: 'Share the Joy',
      description: 'Spread positivity by doing something kind',
      moodTarget: ['happy'],
    },
    calm: {
      id: 'habit-calm',
      type: 'activity',
      title: 'Mindful Moment',
      description: 'Take a moment to appreciate the present',
      moodTarget: ['calm'],
      duration: 60,
    },
    overwhelmed: {
      id: 'habit-overwhelmed',
      type: 'activity',
      title: 'Priority Check',
      description: 'Identify the one most important thing right now',
      moodTarget: ['overwhelmed'],
      duration: 120,
    },
    neutral: {
      id: 'habit-neutral',
      type: 'activity',
      title: 'Small Win',
      description: 'Complete one small task to build momentum',
      moodTarget: ['neutral'],
    },
  };
  
  return habits[mood] || habits.neutral || null;
};
