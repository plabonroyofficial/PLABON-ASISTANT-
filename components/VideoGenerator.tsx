
import React, { useState } from 'react';
import { generateVideo } from '../services/gemini';
import { Play, Loader2, Video, Sparkles, Download, Info, AlertTriangle, ExternalLink } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError(null);
    
    try {
      // Key selection logic as per guidelines
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }

      setIsGenerating(true);
      setVideoUrl(null);
      
      const url = await generateVideo(prompt);
      setVideoUrl(url);
    } catch (e: any) {
      console.error("Video Generation Error:", e);
      if (e.message?.includes("Requested entity was not found")) {
        setError("আপনার এপিআই কী-টি পেইড প্রজেক্টের নয়। ভিডিও তৈরির জন্য অবশ্যই একটি পেইড (Paid) প্রজেক্ট থেকে কী সিলেক্ট করতে হবে।");
        // Re-open key selector as per instructions
        await (window as any).aistudio.openSelectKey();
      } else {
        setError("ভিডিও তৈরি করতে সমস্যা হয়েছে। আপনার এপিআই কী এবং ইন্টারনেট চেক করে আবার চেষ্টা করুন।");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-indigo-600 tracking-tighter flex items-center justify-center gap-3">
          <Video className="text-indigo-500" /> Plabon Video Studio
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Create cinematic videos with Google Veo AI.</p>
      </div>

      {/* Paid Key Warning */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5 rounded-3xl flex gap-4 items-start shadow-sm">
        <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={24} />
        <div className="space-y-2">
          <h3 className="font-bold text-amber-800 dark:text-amber-400">Paid API Key Required</h3>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium">
            ভিডিও তৈরির জন্য গুগল এপিআই-এর পেইড টায়ার প্রয়োজন। আপনার এপিআই কী-টি অবশ্যই একটি বিলিং এনাবলড প্রজেক্টের হতে হবে।
          </p>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 uppercase tracking-widest hover:underline"
          >
            Billing Documentation <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="space-y-4">
          <label className="text-sm font-black uppercase tracking-widest text-slate-400">Describe your scene</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: A futuristic city in Bangladesh with flying cars and neon lights, cinematic drone shot."
            className="w-full h-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none font-medium text-[16px]"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isGenerating ? (
            <><Loader2 className="animate-spin" /> Processing Video (2-3 Minutes)...</>
          ) : (
            <><Sparkles /> Create AI Video</>
          )}
        </button>

        {isGenerating && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center gap-3">
             <Info className="text-indigo-500" size={20} />
             <p className="text-xs text-indigo-700 dark:text-indigo-300 font-bold">ভিডিও জেনারেশন হতে কিছুক্ষণ সময় লাগতে পারে। দয়া করে অপেক্ষা করুন।</p>
          </div>
        )}
      </div>

      {videoUrl && (
        <div className="space-y-4 animate-in zoom-in duration-500">
          <div className="relative aspect-video rounded-[2rem] overflow-hidden border-4 border-indigo-500 shadow-2xl bg-black">
            <video src={videoUrl} controls autoPlay className="w-full h-full" />
          </div>
          <div className="flex gap-3">
            <a 
              href={videoUrl} 
              download="plabon-ai-studio.mp4" 
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white p-5 rounded-2xl font-bold hover:bg-black transition-all"
            >
              <Download size={18} /> Download Video
            </a>
            <button 
              onClick={() => setVideoUrl(null)}
              className="p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
