import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export const genAI = GEMINI_API_KEY ? new GoogleGenAI(GEMINI_API_KEY) : null;
export const isAiAvailable = !!genAI;

// Modelo compartido para evaluaciones objetivas (entrevistas, matching, escenarios)
export const evaluationModel = genAI?.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.2,
    topP: 0.9,
    maxOutputTokens: 2048,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

// Fábrica para modelo de chat conversacional con system prompt variable
export function createChatModel(systemPrompt: string) {
  return genAI?.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.4,
      topP: 0.8,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  });
}
