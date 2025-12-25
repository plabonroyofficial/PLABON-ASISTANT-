
import React, { useState, useEffect } from 'react';
import { Theme, UserProfile, Message } from './types';
import ChatInterface from './components/ChatInterface';
import Profile from './components/Profile';
import VideoGenerator from './components/VideoGenerator';
import LiveVoice from './components/LiveVoice';
import OfflineStatus from './components/OfflineStatus';
import { 
  LOGO_URL, APP_NAME, APP_VERSION, FB_URL, GITHUB_URL, SUPPORT_EMAIL, SUPPORT_PHONE 
} from './constants';
import { 
  MessageSquare, Shield, Moon, Sun, 
  Facebook, Github as GithubIcon, 
  PlayCircle, Radio, Settings, Lock, Sparkles, Mail, Phone, Info, ShieldCheck, Heart, LayoutDashboard, Zap, Tool, Languages, Terminal, FileText
} from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [activeTab, setActiveTab] = useState<'chat' | 'profile' | 'policy' | 'about' | 'studio' | 'live' | 'dashboard'>('dashboard');
  const [isSecure, setIsSecure] = useState(true);

  useEffect(() => {
    if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setIsSecure(false);
    }

    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === Theme.DARK);
      }

      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      }
    } catch (e) {}
  }, []);

  const handleLogin = () => {
    const mockUser: UserProfile = {
      name: "Elite User",
      email: "user@plabon.ai",
      photoURL: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Plabon`,
      preferences: ["Deep Bengali Insights", "Advanced Technical Logic"],
      stats: { messagesSent: 42, imagesCreated: 12, videosCreated: 5 }
    };
    setUser(mockUser);
    setIsLoggedIn(true);
    try { localStorage.setItem('user', JSON.stringify(mockUser)); } catch(e) {}
  };

  const handleLogout = () => {
    if(confirm("Are you sure you want to exit the Plabon Ecosystem?")) {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('chat_history');
      window.location.reload();
    }
  };

  if (!isSecure) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md space-y-6 bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-red-100 dark:border-red-900/20">
          <Lock className="text-red-500 mx-auto" size={48} />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Security Protocol Fault</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Elite features require a <b>Secure HTTPS</b> environment. Deployment on Vercel or Netlify is mandatory for Plabon Assistant.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${theme === Theme.DARK ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="max-w-md w-full text-center space-y-12 bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-700">
          <div className="relative inline-block group">
            <div className="absolute -inset-6 bg-indigo-500/30 rounded-full blur-3xl group-hover:bg-indigo-500/50 transition-all"></div>
            <img src={LOGO_URL} className="relative w-40 h-40 mx-auto rounded-[2.5rem] shadow-2xl border-4 border-indigo-500 object-cover transform hover:rotate-3 transition-transform duration-500" alt="Plabon Assistant Logo" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">{APP_NAME}</h1>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] opacity-70">Empowered by Plabon Roy Technology</p>
          </div>
          <button onClick={handleLogin} className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-3xl shadow-2xl shadow-indigo-500/40 active:scale-95 transition-all overflow-hidden">
             <span className="relative z-10 flex items-center justify-center gap-3">
               <Sparkles size={22} className="group-hover:rotate-12 transition-transform" /> 
               INITIALIZE ASSISTANT
             </span>
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.5em] animate-pulse">v{APP_VERSION} - Secure Cloud Access</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === Theme.DARK ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <OfflineStatus />
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
            <div className="relative">
               <img src={LOGO_URL} className="w-12 h-12 rounded-2xl object-cover shadow-xl border-2 border-indigo-500 transform group-hover:scale-110 transition-transform" alt="Logo" />
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-indigo-600 leading-none">PLABON</span>
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase leading-none mt-1">Assistant</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => {
              const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
              setTheme(newTheme);
              localStorage.setItem('theme', newTheme);
              document.documentElement.classList.toggle('dark');
            }} className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-transparent hover:border-indigo-200">
              {theme === Theme.DARK ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-indigo-600" />}
            </button>
            <button onClick={() => setActiveTab('profile')} className="p-0.5 rounded-2xl border-2 border-indigo-500 overflow-hidden shadow-xl active:scale-90 transition-transform bg-white">
               <img src={user?.photoURL} alt="Profile" className="w-10 h-10 object-cover" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto relative flex flex-col overflow-hidden pb-32">
        {activeTab === 'dashboard' && <Dashboard user={user} onTabChange={setActiveTab} />}
        {activeTab === 'chat' && <ChatInterface user={user} />}
        {activeTab === 'studio' && <VideoGenerator />}
        {activeTab === 'live' && <LiveVoice />}
        {activeTab === 'profile' && <Profile user={user} onLogout={handleLogout} onUpdatePreferences={(p) => setUser(u => u ? {...u, preferences: p} : null)} />}
        {activeTab === 'policy' && <PrivacyPolicy />}
        {activeTab === 'about' && <AboutAndSettings />}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl glass-card border border-white/20 dark:border-slate-800/50 px-8 py-5 flex justify-between items-center z-50 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <NavItem icon={<LayoutDashboard />} label="Home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavItem icon={<MessageSquare />} label="Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        <NavItem icon={<Radio />} label="Live" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
        <NavItem icon={<PlayCircle />} label="Studio" active={activeTab === 'studio'} onClick={() => setActiveTab('studio')} />
        <NavItem icon={<Shield />} label="Privacy" active={activeTab === 'policy'} onClick={() => setActiveTab('policy')} />
        <NavItem icon={<Settings />} label="About" active={activeTab === 'about'} onClick={() => setActiveTab('about')} />
      </nav>
    </div>
  );
};

const Dashboard = ({ user, onTabChange }: any) => (
  <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
           <h2 className="text-4xl font-black tracking-tighter">Welcome Back, <span className="text-indigo-600">{user.name}</span>!</h2>
           <p className="text-slate-500 font-bold">What shall we innovate today?</p>
        </div>
        <div className="flex gap-4">
           <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-500/30 flex items-center gap-3">
              <Zap size={24} className="animate-pulse" />
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-70">System Status</span>
                 <span className="font-bold text-sm">Ultra Fast (Online)</span>
              </div>
           </div>
        </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ToolCard 
          icon={<Languages className="text-indigo-500"/>} 
          title="Translator Pro" 
          desc="Master any language with high-fidelity AI translation."
          onClick={() => onTabChange('chat')}
        />
        <ToolCard 
          icon={<Terminal className="text-emerald-500"/>} 
          title="Code Architect" 
          desc="Generate complex code snippets in seconds."
          onClick={() => onTabChange('chat')}
        />
        <ToolCard 
          icon={<FileText className="text-orange-500"/>} 
          title="Text Optimizer" 
          desc="Refine your documents with advanced AI grammar."
          onClick={() => onTabChange('chat')}
        />
     </div>

     <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 transform group-hover:scale-110 transition-transform">
           <Sparkles size={120} />
        </div>
        <div className="relative z-10 space-y-6">
           <h3 className="text-2xl font-black tracking-tight">AI Capability Stats</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem label="Tasks Done" value="1.2k+" />
              <StatItem label="Tokens Used" value="840k" />
              <StatItem label="Brain Cycles" value="Elite" />
              <StatItem label="Security" value="Active" />
           </div>
        </div>
     </div>
  </div>
);

const ToolCard = ({ icon, title, desc, onClick }: any) => (
  <div onClick={onClick} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group">
     <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl w-fit mb-6 group-hover:bg-indigo-50 transition-colors">{icon}</div>
     <h4 className="text-xl font-black mb-2">{title}</h4>
     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

const StatItem = ({ label, value }: any) => (
  <div className="space-y-1">
     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
     <p className="text-2xl font-black text-indigo-600">{value}</p>
  </div>
);

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-indigo-600 scale-125' : 'text-slate-400 hover:text-slate-600'}`}>
    {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    <span className="text-[9px] font-black uppercase tracking-widest leading-none">{label}</span>
  </button>
);

const PrivacyPolicy = () => (
  <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 pb-40">
    <div className="text-center space-y-3">
      <div className="bg-indigo-50 dark:bg-indigo-900/20 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 shadow-xl border border-indigo-100">
        <Shield size={48} className="text-indigo-500" />
      </div>
      <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Plabon Privacy Shield</h1>
      <p className="text-slate-500 font-bold italic">Military-grade protection for your digital essence.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <PolicySection title="Zero Cloud Logging" icon={<Lock className="text-red-500" />}>
         প্লাবন এআই আপনার কোনো চ্যাট হিস্ট্রি আমাদের সার্ভারে সংরক্ষণ করে না। সবকিছু আপনার ডিভাইসে লোকাললি এনক্রিপ্ট করা থাকে। এর মানে হলো আপনার ডাটা শুধুমাত্র আপনার।
       </PolicySection>
       <PolicySection title="End-to-End Encryption" icon={<ShieldCheck className="text-green-500" />}>
         গুগল জেমিনি এপিআই-এর সাথে সব যোগাযোগ ইন্ডাস্ট্রি-স্ট্যান্ডার্ড SSL/TLS এনক্রিপশনের মাধ্যমে সম্পন্ন হয়। আপনার গোপনীয়তা আমাদের সর্বোচ্চ অগ্রাধিকার।
       </PolicySection>
       <PolicySection title="Permission Transparency" icon={<Info className="text-indigo-500" />}>
         আমরা শুধুমাত্র তখনই মাইক বা ক্যামেরা ব্যবহার করি যখন আপনি নির্দিষ্ট ভয়েস বা ভিডিও ফিচার চালু করেন। এর বাইরে আপনার ডিভাইসে আমাদের কোনো এক্সেস নেই।
       </PolicySection>
       <PolicySection title="Right to Erase" icon={<Heart className="text-pink-500" />}>
         যেকোনো সময় প্রোফাইল সেকশন থেকে আপনার সব চ্যাট হিস্ট্রি স্থায়ীভাবে মুছে ফেলার পূর্ণ নিয়ন্ত্রণ আপনার হাতে। এক ক্লিকেই সব ডেটা সাফ!
       </PolicySection>
    </div>

    <div className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl space-y-6">
       <h3 className="text-xl font-black text-indigo-400 uppercase tracking-widest">Compliance Statement</h3>
       <p className="text-sm text-slate-400 leading-loose font-medium">
         This application adheres to strictly ethical AI development guidelines set by Plabon Roy. We do not sell data to third parties, we do not track your physical location without consent, and we provide total data sovereignty. 
       </p>
       <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
          <span>GDPR Compliant</span>
          <span>Verified Secure</span>
       </div>
    </div>
  </div>
);

const PolicySection = ({ title, icon, children }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-lg space-y-4">
    <div className="flex items-center gap-3">
       <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">{icon}</div>
       <h3 className="font-black text-xl">{title}</h3>
    </div>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm">{children}</p>
  </div>
);

const AboutAndSettings = () => (
  <div className="p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-40">
    <div className="text-center space-y-4">
      <div className="relative inline-block">
        <img src={LOGO_URL} className="w-32 h-32 mx-auto rounded-[3rem] border-4 border-indigo-500 shadow-2xl object-cover" alt="Elite Plabon Logo" />
        <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[8px] font-black px-3 py-1 rounded-full border-2 border-white dark:border-slate-950 uppercase tracking-widest">PRO</div>
      </div>
      <h1 className="text-5xl font-black text-indigo-600 tracking-tighter">{APP_NAME}</h1>
      <p className="text-[12px] font-black opacity-50 uppercase tracking-[0.8em]">PREMIUM BUILD v{APP_VERSION}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Mastermind Behind PLABON AI</h3>
        <div className="space-y-4">
          <p className="font-black text-4xl text-slate-900 dark:text-white leading-none">Plabon Roy</p>
          <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.2em]">Senior Systems Architect & Visionary</p>
          <div className="flex gap-4 pt-4">
            <SocialBtn icon={<Facebook />} link={FB_URL} color="bg-indigo-100 text-indigo-600" />
            <SocialBtn icon={<GithubIcon />} link={GITHUB_URL} color="bg-slate-100 text-slate-900" />
            <SocialBtn icon={<Mail />} link={`mailto:${SUPPORT_EMAIL}`} color="bg-red-100 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Corporate Connection</h3>
        <div className="space-y-6">
          <ContactItem icon={<Phone />} label="Primary Line" value={SUPPORT_PHONE} link={`tel:${SUPPORT_PHONE}`} />
          <ContactItem icon={<Mail />} label="Secure Email" value={SUPPORT_EMAIL} link={`mailto:${SUPPORT_EMAIL}`} />
          <ContactItem icon={<Info />} label="Official GitHub" value="github.com/plabonroy" link={GITHUB_URL} />
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-12 rounded-[4rem] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.4)] text-white space-y-8">
       <div className="space-y-4">
         <h2 className="text-3xl font-black tracking-tight">The Vision</h2>
         <p className="text-indigo-100 leading-loose font-medium text-lg italic opacity-90">
           "প্লাবন অ্যাসিস্ট্যান্ট শুধুমাত্র একটি অ্যাপ নয়, এটি ভবিষ্যতের একটি ডিজিটাল ইকোসিস্টেম। আমাদের লক্ষ্য হলো আর্টিফিশিয়াল ইন্টেলিজেন্সকে মানুষের সৃজনশীলতার সাথে নিখুঁতভাবে যুক্ত করা যাতে আমরা আরও দ্রুত এবং স্মার্টভাবে আমাদের স্বপ্নগুলো পূরণ করতে পারি।"
         </p>
       </div>
       <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Heart size={24} className="fill-red-400 text-red-400" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Crafted with Love</span>
                <span className="font-bold">Bangladesh Global Tech</span>
             </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">© 2024 Plabon Roy Innovation. All Rights Reserved.</p>
       </div>
    </div>
  </div>
);

const SocialBtn = ({ icon, link, color }: any) => (
  <a href={link} target="_blank" className={`p-4 ${color} rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-sm`}>
     {React.cloneElement(icon, { size: 24 })}
  </a>
);

const ContactItem = ({ icon, label, value, link }: any) => (
  <a href={link} className="flex items-center gap-4 group">
     <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-indigo-50 transition-colors text-indigo-500">{icon}</div>
     <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{label}</span>
        <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{value}</span>
     </div>
  </a>
);

export default App;
