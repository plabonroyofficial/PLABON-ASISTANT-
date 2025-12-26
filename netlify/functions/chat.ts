
import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error('API_KEY is not set');

const ai = new GoogleGenAI({ apiKey });

export const handler: Handler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: 'Missing request body' };

    const { prompt, history = [], userPreferences = [], imageData } = JSON.parse(event.body);

    const memoryContext = userPreferences.length > 0 
      ? `\n[USER MEMORY]: ${userPreferences.join(", ")}`
      : "";

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
        systemInstruction: `You are a helpful assistant.` + memoryContext,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      },
    });

    return { statusCode: 200, body: JSON.stringify({ text: response.text }) };

  } catch (error: any) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
