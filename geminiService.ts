import { GoogleGenAI, GenerateContentStreamResult } from "@google/genai";

const apiKey = process.env.API_KEY || '';

let client: GoogleGenAI | null = null;

if (apiKey) {
  client = new GoogleGenAI({ apiKey });
}

export const streamGeminiResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<GenerateContentStreamResult | null> => {
  if (!client) {
    console.error("Gemini API Key is missing.");
    return null;
  }

  try {
    const chat = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are Nebula AI, a helpful, witty, and concise AI assistant embedded within the NebulaOS web operating system. You help users with coding, writing, and general knowledge.",
      },
      history: history,
    });

    const result = await chat.sendMessageStream({ message: prompt });
    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
