import { MoodCategory, MoodScore, MoodSignals, WeatherCondition } from '@/types';

// Positive and negative word lists for sentiment analysis
const POSITIVE_WORDS = [
  'happy', 'great', 'awesome', 'amazing', 'wonderful', 'excellent', 'good', 'nice',
  'love', 'like', 'enjoy', 'fun', 'excited', 'joy', 'pleasure', 'delight', 'fantastic',
  'brilliant', 'perfect', 'beautiful', 'wonderful', 'glad', 'pleased', 'grateful'
];

const NEGATIVE_WORDS = [
  'sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'stressed',
  'worried', 'anxious', 'depressed', 'tired', 'exhausted', 'overwhelmed', 'upset',
  'disappointed', 'hurt', 'pain', 'suffering', 'difficult', 'hard', 'struggle'
];

export class MoodDetectionEngine {
  private typingHistory: Array<{ text: string; timestamp: Date; backspaces: number }> = [];
  private activityHistory: Array<{ type: string; timestamp: Date }> = [];

  analyzeTypingPattern(text: string, backspaces: number = 0): {
    sentiment: number;
    speed: number;
    backspaces: number;
    wordSentiment: number;
  } {
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      if (POSITIVE_WORDS.some(pw => word.includes(pw))) positiveCount++;
      if (NEGATIVE_WORDS.some(nw => word.includes(nw))) negativeCount++;
    });

    const wordSentiment = words.length > 0 
      ? (positiveCount - negativeCount) / words.length 
      : 0;

    // Typing speed (words per minute approximation)
    const speed = words.length > 0 ? Math.min(words.length * 2, 100) : 50;

    // Overall sentiment from -1 (negative) to 1 (positive)
    const sentiment = Math.max(-1, Math.min(1, wordSentiment));

    this.typingHistory.push({ text, timestamp: new Date(), backspaces });

    return {
      sentiment,
      speed,
      backspaces,
      wordSentiment,
    };
  }

  analyzeActivityPattern(
    tabSwitches: number,
    timeOnSocialMedia: number,
    readingTime: number
  ) {
    this.activityHistory.push({
      type: 'activity',
      timestamp: new Date(),
    });

    return {
      tabSwitches,
      timeOnSocialMedia,
      readingTime,
    };
  }

  analyzeDeviceUsage(lateNightUsage: boolean, activityLevel: number) {
    return {
      lateNightUsage,
      activityLevel,
    };
  }

  getWeatherMoodImpact(condition: WeatherCondition): number {
    const impacts: Record<WeatherCondition, number> = {
      rain: -0.2,
      sunny: 0.3,
      cloudy: -0.1,
      snow: 0.1,
      night: -0.1,
      fog: -0.15,
    };
    return impacts[condition] || 0;
  }

  calculateMoodScore(signals: MoodSignals): MoodScore {
    let score = 50; // Base neutral score
    let category: MoodCategory = 'neutral';
    let confidence = 0.5;

    // Typing pattern analysis
    if (signals.typingPattern) {
      const { sentiment, speed, backspaces, wordSentiment } = signals.typingPattern;
      
      score += sentiment * 20;
      score += (wordSentiment > 0 ? 10 : -10);
      
      // High backspaces indicate stress
      if (backspaces > 5) {
        score -= 15;
      }
      
      // Very slow typing might indicate tiredness
      if (speed < 20) {
        score -= 10;
      }
    }

    // Activity pattern analysis
    if (signals.activityPattern) {
      const { tabSwitches, timeOnSocialMedia, readingTime } = signals.activityPattern;
      
      // High tab switching indicates anxiety/stress
      if (tabSwitches > 10) {
        score -= 15;
      }
      
      // Long reading time indicates calm
      if (readingTime > 5) {
        score += 10;
      }
      
      // Excessive social media might indicate negative mood
      if (timeOnSocialMedia > 30) {
        score -= 10;
      }
    }

    // Device usage analysis
    if (signals.deviceUsage) {
      const { lateNightUsage, activityLevel } = signals.deviceUsage;
      
      if (lateNightUsage) {
        score -= 10;
      }
      
      score += (activityLevel - 50) * 0.2;
    }

    // Weather impact
    if (signals.weather) {
      score += signals.weather.impact * 10;
    }

    // Voice tone analysis
    if (signals.voiceTone) {
      score += signals.voiceTone.energy * 15;
      score += signals.voiceTone.sentiment * 15;
    }

    // Clamp score to 0-100
    score = Math.max(0, Math.min(100, score));

    // Determine category based on score
    if (score >= 80) {
      category = 'happy';
      confidence = 0.8;
    } else if (score >= 65) {
      category = 'energetic';
      confidence = 0.7;
    } else if (score >= 55) {
      category = 'calm';
      confidence = 0.6;
    } else if (score >= 45) {
      category = 'neutral';
      confidence = 0.5;
    } else if (score >= 35) {
      category = 'sad';
      confidence = 0.7;
    } else if (score >= 25) {
      category = 'stressed';
      confidence = 0.8;
    } else {
      category = 'overwhelmed';
      confidence = 0.9;
    }

    // Adjust confidence based on signal quality
    const signalCount = [
      signals.typingPattern,
      signals.activityPattern,
      signals.deviceUsage,
      signals.weather,
      signals.voiceTone,
    ].filter(Boolean).length;

    confidence = Math.min(0.95, confidence + (signalCount - 1) * 0.1);

    return {
      category,
      score: Math.round(score),
      confidence,
      timestamp: new Date(),
      signals,
    };
  }

  detectMood(signals: MoodSignals): MoodScore {
    return this.calculateMoodScore(signals);
  }
}

export const moodEngine = new MoodDetectionEngine();

