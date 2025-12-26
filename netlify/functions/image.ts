import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error('API_KEY is not set');

const ai = new GoogleGenAI({ apiKey });

export const handler: Handler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: 'Missing request body' };

    const { prompt } = JSON.parse(event.body);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } },
    });

    const part = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
    if (!part) return { statusCode: 500, body: 'Failed to generate image' };

    return { statusCode: 200, body: JSON.stringify({ image: `data:image/png;base64,${part.inlineData.data}` }) };

  } catch (error: any) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
