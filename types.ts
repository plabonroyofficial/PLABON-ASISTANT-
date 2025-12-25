
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  image?: string; 
  generatedImage?: string; // New: for AI generated images
  videoUrl?: string; // New: for AI generated videos
  sources?: { title: string; uri: string }[];
}

export interface UserProfile {
  name: string;
  email: string;
  photoURL: string;
  preferences: string[];
  stats: {
    messagesSent: number;
    imagesCreated: number;
    videosCreated: number;
  };
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}
