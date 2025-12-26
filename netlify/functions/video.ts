import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error('API_KEY is not set');

export const handler: Handler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: 'Missing request body' };

    const { prompt } = JSON.parse(event.body);

    const ai = new GoogleGenAI({ apiKey });

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' },
    });

    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return { statusCode: 500, body: 'No download link received' };

    return { statusCode: 200, body: JSON.stringify({ videoUrl: `${downloadLink}&key=${apiKey}` }) };

  } catch (error: any) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
