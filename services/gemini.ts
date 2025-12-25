
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
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
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + memoryContext,
        temperature: 0.7,
        tools: [{ googleSearch: {} }] as any,
      },
    });

    const text = response.text || "";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.web)
      ?.map((chunk: any) => ({ title: chunk.web.title, uri: chunk.web.uri }));

    return { text, sources };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const generateImage = async (prompt: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
};

export const generateVideo = async (prompt: string) => {
  // Always create a new instance to get the latest key from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: { 
      numberOfVideos: 1, 
      resolution: '720p', 
      aspectRatio: '16:9' 
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("No download link received");
  
  return `${downloadLink}&key=${process.env.API_KEY}`;
};
