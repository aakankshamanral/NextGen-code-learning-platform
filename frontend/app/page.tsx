"use client";

import React from 'react';
import { useRouter } from 'next/navigation'; 
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  StickyNote, 
  Trophy, 
  Check, 
  Lock, 
  Star,
  User,
  LayoutGrid,
  BarChart2,
  Settings
} from 'lucide-react';

const LEVELS = [
  { id: 1, title: "1. Basics", status: "completed", x: "-100px", mascot: "🦊", msg: "Let's go!" },
  { id: 2, title: "2. Let's Code", status: "locked", x: "100px", mascot: "🤖", msg: "Code your first program" },
{ id: 3, title: "3. Functions", status: "locked", x: "-100px", mascot: "🐼", msg: "Locked for now!" },
  { id: 5, title: "5. Pointers", status: "locked", x: "-100px", mascot: "🐸", msg: "Yeahhh!" },
  { id: 6, title: "6. Structures", status: "locked", x: "100px", mascot: "🦉", msg: "Great!" },
];

export default function NextGenRoadmap() {
  const router = useRouter(); 

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex overflow-hidden relative font-sans">
      
      {/* --- 🧩 BACKGROUND --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      {/* --- 🚀 FLOATING HEADER --- */}
      <div className="absolute top-0 left-0 right-0 z-30 px-10 py-8 flex items-center justify-between pointer-events-none">
        <img 
          src="/logo.png" 
          alt="NextGen Logo" 
          className="h-10 md:h-12 w-auto object-contain pointer-events-auto cursor-pointer drop-shadow-2xl" 
          onClick={() => router.push('/')} 
        />
        
        <div onClick={() => router.push('/login')} className="flex items-center gap-3 bg-[#161b22]/80 backdrop-blur-md p-1.5 pr-5 rounded-full border border-gray-800 shadow-xl pointer-events-auto cursor-pointer hover:border-cyan-500/50 transition-all"
>          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-gray-600">
             <User size={16} className="text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 leading-none">Guest Player</span>
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter mt-1">NO DATA SAVED</span>
          </div>
        </div>
      </div>

      {/* --- 📂 ENHANCED SIDEBAR --- */}
      <aside className="w-24 bg-[#161b22]/80 backdrop-blur-md m-6 mt-28 rounded-3xl flex flex-col items-center py-10 gap-8 border border-gray-800 shadow-2xl z-20">
        <SidebarIcon icon={<LayoutGrid size={24} />} label="Roadmap" active />
        <SidebarIcon icon={<StickyNote size={24} />} label="Bookmarks" onClick={() => router.push('/bookmarks')} />
        <SidebarIcon icon={<BarChart2 size={24} />} label="Stats" />
        <SidebarIcon icon={<Settings size={24} />} label="Settings" />
      </aside>

      {/* --- 🗺️ MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col relative z-10">
        <div className="flex-1 overflow-y-auto pb-40 no-scrollbar">
          <div className="max-w-2xl mx-auto relative flex flex-col items-center mt-32">
            {LEVELS.map((step, index) => (
              <motion.div key={step.id} style={{ marginLeft: step.x }} className="relative mb-28 group w-full flex justify-center items-center" whileHover="hoverState">
                
                {/* Mascot & Dialogue Bubble */}
                <div className={`absolute flex items-center gap-4 ${index % 2 === 0 ? 'left-[60%]' : 'right-[60%] flex-row-reverse'}`}>
                  <motion.div animate={{ y: [0, -8, 0] }} className="text-5xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] z-20">{step.mascot}</motion.div>
                  <motion.div className="relative bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-cyan-400 px-4 py-2 rounded-2xl shadow-xl min-w-[100px] text-center">
                    <p className="text-[10px] font-black uppercase leading-tight italic tracking-widest">{step.msg}</p>
                    <div className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ${index % 2 === 0 ? '-left-2 border-r-[8px] border-r-cyan-500/40' : '-right-2 border-l-[8px] border-l-cyan-500/40'}`}></div>
                  </motion.div>
                </div>
                
                {/* Level Circle */}
                <motion.div 
                  className="flex flex-col items-center z-10 cursor-pointer" 
                  onClick={() => step.status !== 'locked' && router.push(`/levels/${step.id}`)}
                  variants={{ 
                    hoverState: { 
                      scale: 1.3, 
                      rotate: 8, 
                      transition: { type: "spring", stiffness: 800, damping: 15 } 
                    } 
                  }}
                >
                  <span className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-cyan-400 transition-colors tracking-widest">{step.title}</span>
                  <div className={`w-24 h-24 rounded-full border-[6px] flex items-center justify-center transition-all duration-300 relative ${step.status === 'completed' ? 'border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_80px_rgba(34,211,238,0.6)]' : step.status === 'current' ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse' : 'border-gray-800 opacity-40'}`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${step.status === 'completed' ? 'bg-gradient-to-tr from-cyan-400 to-blue-600' : step.status === 'current' ? 'bg-blue-600' : 'bg-slate-800'}`}>
                      {step.status === 'completed' ? <Check size={36} strokeWidth={4} /> : step.status === 'locked' ? <Lock size={24} className="text-gray-600" /> : <Star size={36} />}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarIcon({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={onClick}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30' : 'text-gray-500 hover:text-cyan-400 hover:bg-white/5'}`}>
        {icon}
      </div>
      <span className={`text-[8px] font-black uppercase tracking-widest text-center ${active ? 'text-cyan-400' : 'text-gray-600'}`}>
        {label}
      </span>
    </div>
  );
}