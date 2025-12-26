const NETLIFY_FUNCTIONS_BASE = '/.netlify/functions';

export const generateAIResponse = async (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [],
  userPreferences: string[] = [],
  imageData?: string
) => {
  const memoryContext = userPreferences.length > 0 
    ? `\n[USER MEMORY]: ${userPreferences.join(", ")}`
    : "";

  const body = JSON.stringify({ prompt, history, userPreferences, imageData });

  const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  if (!response.ok) throw new Error('Failed to get AI response');

  const data = await response.json();
  return data.text || '';
};

export const generateImage = async (prompt: string) => {
  const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error('Failed to generate image');

  const data = await response.json();
  return data.image || '';
};

export const generateVideo = async (prompt: string) => {
  const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error('Failed to generate video');

  const data = await response.json();
  return data.videoUrl || '';
};

export const generateLiveVoiceResponse = async (audioBase64: string, prompt?: string) => {
  const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/liveVoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64, prompt }),
  });

  if (!response.ok) throw new Error('Failed to get live voice response');

  const data = await response.json();
  return data.text || '';
};
