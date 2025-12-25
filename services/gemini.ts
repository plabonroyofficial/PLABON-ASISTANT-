import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const getAIClient = () => {
  // এখানে আপনার সঠিক এপিআই কি সরাসরি বসিয়ে দিয়েছি
  return new GoogleGenAI({ apiKey: "AIzaSyBBkucffqYgVOsg2Q5Q-bKQEbB3XFk9Z-U" });
};

export const generateAIResponse = async (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userPreferences: string[] = [],
  imageData?: string 
) => {
  const ai = getAIClient();
  const memoryContext = userPreferences.length > 0 
    ? `\n[USER MEMORY]: ${userPreferences.join(", ")}`
    : "";

  try {
    const contents: any[] = [...history];
    const currentParts: any[] = [{ text: prompt }];
    
    if (imageData) {
      currentParts.push({
        inlineData: { mimeType: "image/jpeg", data: imageData.split(',')[1] || imageData }
      });
    }

    contents.push({ role: 'user', parts: currentParts });

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // আমরা ফ্ল্যাশ ১.৫ ব্যবহার করছি যাতে দ্রুত রেসপন্স আসে
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + memoryContext,
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    return { text, sources: [] };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const generateImage = async (prompt: string) => {
  throw new Error("Image generation models are currently limited.");
};

export const generateVideo = async (prompt: string) => {
  throw new Error("Video generation is not available in this tier.");
};
