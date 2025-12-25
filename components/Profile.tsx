
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { LogOut, Save, User as UserIcon, Mail, Settings, Plus, X, Trash2, ShieldCheck, Database, BarChart3, Image as ImageIcon, MessageSquareText } from 'lucide-react';

interface ProfileProps {
  user: UserProfile | null;
  onLogout: () => void;
  onUpdatePreferences: (preferences: string[]) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdatePreferences }) => {
  const [prefs, setPrefs] = useState<string[]>(user?.preferences || []);
  const [newPref, setNewPref] = useState('');

  const addPreference = () => {
    if (newPref.trim()) {
      const updated = [...prefs, newPref.trim()];
      setPrefs(updated);
      onUpdatePreferences(updated);
      setNewPref('');
    }
  };

  const removePreference = (index: number) => {
    const updated = prefs.filter((_, i) => i !== index);
    setPrefs(updated);
    onUpdatePreferences(updated);
  };

  const clearChatHistory = () => {
    if (confirm("আপনি কি নিশ্চিত যে সব চ্যাট হিস্ট্রি ডিলিট করতে চান? এটি আর ফিরিয়ে আনা যাবে না।")) {
      localStorage.removeItem('chat_history');
      window.location.reload();
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <img src={user.photoURL} className="relative w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 shadow-2xl object-cover" alt="Profile" />
          <div className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2.5 rounded-full border-2 border-white dark:border-slate-900 shadow-lg cursor-pointer hover:scale-110 transition-transform">
            <Settings size={18} />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight">{user.name}</h2>
          <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 text-sm font-bold bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full mt-2">
            <Mail size={14} className="text-indigo-500" /> {user.email}
          </p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<MessageSquareText className="text-indigo-500"/>} label="মেসেজ" value={user.stats.messagesSent} />
        <StatCard icon={<ImageIcon className="text-violet-500"/>} label="ছবি" value={user.stats.imagesCreated} />
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-black flex items-center gap-2 text-indigo-600 uppercase tracking-tighter">
            <Database size={20} /> AI Memory (Context)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            এখানে আপনার পছন্দগুলো লিখে রাখুন যাতে প্লাবন আপনাকে আরও ভালোভাবে চিনতে পারে।
          </p>
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={newPref}
            onChange={(e) => setNewPref(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPreference()}
            placeholder="যেমন: সহজ বাংলা ব্যবহার করো..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
          />
          <button 
            onClick={addPreference}
            className="bg-indigo-600 text-white px-6 rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {prefs.map((pref, i) => (
            <div key={i} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2.5 rounded-2xl text-sm font-black border border-indigo-100 dark:border-indigo-800 transition-all hover:scale-105">
              {pref}
              <button onClick={() => removePreference(i)} className="text-indigo-400 hover:text-red-500 transition-colors">
                <X size={16} />
              </button>
            </div>
          ))}
          {prefs.length === 0 && (
            <div className="w-full py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
               <p className="text-sm text-slate-400 font-bold uppercase tracking-widest opacity-50">No memories active</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={clearChatHistory}
          className="flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-black p-5 rounded-3xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
        >
          <Trash2 size={20} /> চ্যাট হিস্ট্রি মুছুন
        </button>

        <button 
          onClick={onLogout}
          className="flex items-center justify-center gap-3 bg-red-600 text-white font-black p-5 rounded-3xl hover:bg-red-700 active:scale-95 transition-all shadow-xl shadow-red-500/20"
        >
          <LogOut size={20} /> লগ আউট করুন
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 py-6 opacity-30">
        <ShieldCheck size={14} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">End-to-End Encryption Enabled</span>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2">
    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-1">{icon}</div>
    <span className="text-2xl font-black">{value}</span>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
  </div>
);

export default Profile;
