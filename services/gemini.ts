
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

const API_KEY = "AIzaSyBBkucffqYgVOsg2Q5Q-bKQEbB3XFk9Z-U";

const getAIClient = () => {
  return new GoogleGenerativeAI(API_KEY);
};

export const generateAIResponse = async (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userPreferences: string[] = [],
  imageData?: string 
) => {
  const genAI = getAIClient();
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION + (userPreferences.length > 0 ? `\n[USER MEMORY]: ${userPreferences.join(", ")}` : "")
  });

  try {
    const contents: any[] = [...history];
    const currentParts: any[] = [{ text: prompt }];
    
    if (imageData) {
      currentParts.push({
        inlineData: { mimeType: "image/jpeg", data: imageData.split(',')[1] || imageData }
      });
    }

    contents.push({ role: 'user', parts: currentParts });

    const result = await model.generateContent({ contents });
    const response = await result.response;
    const text = response.text() || "";

    return { text, sources: [] };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const generateImage = async (prompt: string) => {
  throw new Error("Image generation models are restricted to specific regions or tiers.");
};

export const generateVideo = async (prompt: string) => {
  throw new Error("Video generation models are restricted to specific regions or tiers.");
};
