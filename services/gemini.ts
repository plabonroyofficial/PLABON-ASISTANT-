
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Create AI client
const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is missing in environment variables");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// =========================
// TEXT + IMAGE CHAT
// =========================
export const generateAIResponse = async (
  prompt: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[] = [],
  userPreferences: string[] = [],
  imageData?: string
) => {
  try {
    const ai = getAIClient();

    const memoryContext =
      userPreferences.length > 0
        ? `\n[USER MEMORY]: ${userPreferences.join(", ")}`
        : "";

    const parts: any[] = [{ text: prompt }];

    if (imageData) {
      const base64 = imageData.includes(",")
        ? imageData.split(",")[1]
        : imageData;

      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64,
        },
      });
    }

    const contents = [
      {
        role: "model",
        parts: [{ text: SYSTEM_INSTRUCTION + memoryContext }],
      },
      ...history,
      {
        role: "user",
        parts,
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents,
      config: {
        temperature: 0.7,
      },
    });

    const text =
      response.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text || "")
        .join("") || "";

    return {
      text,
      raw: response,
    };
  } catch (error) {
    console.error("Gemini text error:", error);
    throw error;
  }
};

// =========================
// IMAGE GENERATION
// =========================
export const generateImage = async (prompt: string) => {
  try {
    const ai = getAIClient();

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["IMAGE"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated");
  } catch (error) {
    console.error("Gemini image error:", error);
    throw error;
  }
};
