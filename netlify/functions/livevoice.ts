import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error('API_KEY is not set');

const ai = new GoogleGenAI({ apiKey });

export const handler: Handler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: 'Missing request body' };

    const { audioBase64, prompt } = JSON.parse(event.body);

    if (!audioBase64) return { statusCode: 400, body: 'Missing audio data' };

    // এখানে আপনার প্রয়োজন অনুযায়ী audioBase64 নিয়ে কাজ করবেন,
    // এই কোডে শুধু একটি সাধারণ prompt দিয়ে response নিচ্ছি।

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt || "Please transcribe this audio." }] }],
      config: { temperature: 0.7 },
    });

    return { statusCode: 200, body: JSON.stringify({ text: response.text }) };

  } catch (error: any) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
