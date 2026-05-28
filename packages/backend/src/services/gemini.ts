import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';
import type { Content } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export const genAI = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
export const isAiAvailable = !!genAI;

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export function createChatModel(systemInstruction: string) {
  if (!genAI) return null;

  const config = {
    systemInstruction,
    temperature: 0.4,
    topP: 0.8,
    maxOutputTokens: 1024,
    safetySettings,
  };

  return {
    startChat: (params: { history: Content[] }) =>
      genAI.chats.create({
        model: 'gemini-2.0-flash',
        history: params.history,
        config,
      }),
  };
}

export const evaluationModel = genAI
  ? {
      generateContent: (prompt: string) =>
        genAI.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: {
            temperature: 0.2,
            topP: 0.9,
            maxOutputTokens: 2048,
            safetySettings,
          },
        }),
    }
  : null;
