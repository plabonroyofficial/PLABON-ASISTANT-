// services/gemini.ts
// ⚠️ Frontend-safe abstraction layer
// Real AI logic must live in Netlify Functions (backend)

// =========================
// TEXT AI
// =========================
export const generateAIResponse = async (
  prompt: string,
  history: any[] = [],
  userPreferences: string[] = [],
  imageData?: string
) => {
  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      history,
      userPreferences,
      imageData,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to get AI response");
  }

  return res.json(); // { text: string }
};

// =========================
// IMAGE GENERATION
// =========================
export const generateImage = async (prompt: string) => {
  const res = await fetch("/.netlify/functions/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate image");
  }

  const data = await res.json();
  return data.image; // base64 image
};

// =========================
// VIDEO GENERATION
// =========================
export const generateVideo = async (prompt: string) => {
  const res = await fetch("/.netlify/functions/video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate video");
  }

  const data = await res.json();
  return data.videoUrl;
};
