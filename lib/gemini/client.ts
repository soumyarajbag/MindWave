import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import { MoodCategory, ChatMessage, WeeklyInsight, MoodScore } from '@/types';
import { startOfWeek } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = () => {
  if (!genAI && typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  }
  return genAI;
};

// --- UPDATED MODEL CONSTANTS (NOV 2025) ---
// 'gemini-1.5-pro' is 404/Deprecated. Use these active models:
const MODEL_FLASH = 'gemini-2.5-flash'; // Best balance
const MODEL_PRO = 'gemini-2.5-pro'; // Best intelligence
const MODEL_LITE = 'gemini-2.5-flash-lite'; // Best speed

export const getGeminiModel = (modelName?: string, config?: GenerationConfig) => {
  const client = initializeGemini();
  if (!client) {
    throw new Error('Gemini API key not configured');
  }

  // Use provided model, env var, or default to Flash
  const model = modelName || process.env.NEXT_PUBLIC_GEMINI_MODEL || MODEL_FLASH;

  return client.getGenerativeModel({
    model: model,
    generationConfig: config,
  });
};

export const chatWithAI = async (
  messages: ChatMessage[],
  currentMood?: MoodCategory
): Promise<string> => {
  // Strategy: Try Fast -> Lite -> Pro
  const chatModels = [MODEL_FLASH, MODEL_LITE, MODEL_PRO];

  for (const modelName of chatModels) {
    try {
      const model = getGeminiModel(modelName);

      const systemPrompt = currentMood
        ? `You are MindWave, a compassionate AI emotional wellness companion. The user's current detected mood is: ${currentMood}. Be empathetic, supportive, and provide helpful suggestions. Keep responses concise (2-3 sentences) and warm.`
        : `You are MindWave, a compassionate AI emotional wellness companion. Be empathetic, supportive, and provide helpful suggestions. Keep responses concise (2-3 sentences) and warm.`;

      const conversationHistory = messages
        .slice(-10)
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      const prompt = `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nAssistant:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.warn(`Model ${modelName} failed:`, error.message);
      // If 404 (Not Found) or 429 (Quota), try the next model
      if (error?.message?.includes('not found') || error?.status === 404) {
        continue;
      }
      continue;
    }
  }

  throw new Error('All available Gemini models failed. Please check your API key.');
};

export const generateMoodInsight = async (moodHistory: MoodScore[]): Promise<string> => {
  // Strategy: Flash -> Pro
  const insightModels = [MODEL_FLASH, MODEL_PRO];

  for (const modelName of insightModels) {
    try {
      const model = getGeminiModel(modelName);

      const moodSummary = moodHistory
        .map((m) => `${m.timestamp.toISOString()}: ${m.category} (${m.score}/100)`)
        .join('\n');

      const prompt = `Analyze this mood history and provide a brief, empathetic insight (2-3 sentences) about patterns and suggestions:\n\n${moodSummary}\n\nInsight:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.warn(`Model ${modelName} failed in insight gen:`, error.message);
      continue;
    }
  }

  return 'I notice some patterns in your mood. Keep tracking to see more insights!';
};

export const generateWeeklyInsight = async (moodHistory: MoodScore[]): Promise<WeeklyInsight> => {
  // Strategy: Pro -> Flash (Pro is better at JSON)
  const analysisModels = [MODEL_PRO, MODEL_FLASH];

  for (const modelName of analysisModels) {
    try {
      // JSON mode ensures valid output
      const model = getGeminiModel(modelName, {
        responseMimeType: 'application/json',
      } as GenerationConfig);

      const moodData = moodHistory.map((m) => ({
        date: m.timestamp.toISOString(),
        mood: m.category,
        score: m.score,
      }));

      const prompt = `Analyze this week's mood data and return a JSON object with this structure:
      {
        "triggers": ["string"],
        "activeTime": [{"hour": number, "activity": number}],
        "energyLevels": [number],
        "stressPatterns": [{"date": "string", "level": number}],
        "aiRecommendations": ["string"]
      }

      Mood data:
      ${JSON.stringify(moodData, null, 2)}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        return JSON.parse(text);
      } catch (e) {
        // Fallback if strict JSON mode fails (rare)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        throw e;
      }
    } catch (error: any) {
      console.warn(`Model ${modelName} failed in weekly insight:`, error.message);
      continue;
    }
  }

  // Fallback Data
  return {
    weekStart: startOfWeek(new Date()),
    moodTrends: moodHistory.map((m) => ({
      date: m.timestamp,
      mood: m.category,
      score: m.score,
    })) as { date: Date; mood: MoodCategory; score: number }[],
    triggers: [],
    activeTime: [],
    energyLevels: [],
    stressPatterns: [],
    aiRecommendations: ['Track your mood patterns to get personalized insights'],
  };
};

export const generatePlaylistDescription = async (
  mood: MoodCategory,
  genre?: string
): Promise<string> => {
  // Strategy: Lite -> Flash -> Pro
  const creativeModels = [MODEL_LITE, MODEL_FLASH, MODEL_PRO];

  for (const modelName of creativeModels) {
    try {
      const model = getGeminiModel(modelName);

      const prompt = `Generate a brief, engaging description (1-2 sentences) for a ${mood} mood playlist${genre ? ` with ${genre} genre` : ''}. Make it warm and inviting.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.warn(`Model ${modelName} failed in playlist gen:`, error.message);
      continue;
    }
  }

  return `A curated playlist to match your ${mood} mood`;
};
