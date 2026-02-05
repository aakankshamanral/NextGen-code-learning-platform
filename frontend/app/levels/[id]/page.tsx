"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Play, BookOpen, 
  Gamepad2, Code2, FileText, 
  RotateCcw, Maximize, Minimize, Download,
  Bookmark
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LEVEL_DATA } from '../../../data/levels'; 

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const [isMaximized, setIsMaximized] = useState(false);
  
  const levelId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const currentLevel = levelId ? LEVEL_DATA[levelId] : null;

  if (!currentLevel) return null;

  const menuOptions = [
    { title: "Tutorial", icon: <Play size={24} />, color: "bg-blue-600" },
    { title: "Flashcards", icon: <BookOpen size={24} />, color: "bg-emerald-600" },
    { title: "Gamiz", icon: <Gamepad2 size={24} />, color: "bg-purple-600" },
    { title: "Recap Quiz", icon: <RotateCcw size={24} />, color: "bg-orange-600" },
    { title: "Code It", icon: <Code2 size={24} />, color: "bg-pink-600" },
  ];

  return (
    <div className={`min-h-screen bg-[#0b0e14] text-white font-sans ${isMaximized ? 'overflow-hidden' : ''}`}>
      
      {/* --- 🛡️ FIXED TOP NAVIGATION --- */}
      {!isMaximized && (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0b0e14]/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <img 
            src="/logo.png" 
            alt="NextGen Logo" 
            className="h-8 md:h-10 w-auto cursor-pointer" 
            onClick={() => router.push('/')} 
          />
          
          <div className="flex items-center gap-6">
            {/* ✅ ADDED BOOKMARKS LINK */}
            <button 
              onClick={() => router.push('/bookmarks')}
              className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors group"
            >
              <Bookmark size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">BookMarks</span>
            </button>

            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Roadmap</span>
            </button>
          </div>
        </nav>
      )}

      {/* --- 📦 MAIN CONTENT CONTAINER --- */}
      <div className={`p-6 ${!isMaximized ? 'pt-28' : ''}`}>
        
        {/* 🐾 MASCOT SECTION (Side-by-Side Magic) */}
        {!isMaximized && (
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-14">
            <motion.div 
              animate={{ y: [0, -8, 0] }} 
              transition={{ repeat: Infinity, duration: 3 }} 
              className={`w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br ${currentLevel.themeColor} rounded-full flex-shrink-0 flex items-center justify-center text-5xl md:text-6xl shadow-2xl border-4 border-white/5`}
            >
              {currentLevel.animal}
            </motion.div>

            <div className="relative flex-1 bg-[#1c2128] p-6 md:p-10 rounded-[2.5rem] rounded-tl-none md:rounded-tl-none border border-gray-800 shadow-xl">
              <h2 className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">Chapter {levelId}</h2>
              <p className="text-xl md:text-3xl font-extrabold italic uppercase leading-tight tracking-tight text-white mb-6">
                "{currentLevel.dialogue}"
              </p>
              
              <div className="flex gap-2 flex-wrap">
                {currentLevel.topics.map((topic, i) => (
                  <span key={i} className="text-[9px] bg-cyan-500/10 text-cyan-400/80 px-4 py-1.5 rounded-full border border-cyan-500/20 font-bold uppercase tracking-wider">
                    {topic}
                  </span>
                ))}
              </div>
              {/* Speech Bubble Tail */}
              <div className="hidden md:block absolute top-0 -left-4 w-0 h-0 border-t-[0px] border-t-transparent border-r-[25px] border-r-[#1c2128] border-b-[25px] border-b-transparent"></div>
            </div>
          </div>
        )}

        {/* 🕹️ HUB GRID (Solid Squares) */}
        {!isMaximized && (
          <main className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-20">
            {menuOptions.map((option, idx) => (
              <motion.button 
                key={idx}
                onClick={() => {
                  if (option.title === "Code It") {
                    router.push(`/levels/${levelId}/code-it`);
                  } 
                  else if (option.title === "Recap Quiz") {
                    router.push(`/levels/${levelId}/quiz`); }
                  else if (option.title === "Flashcards") {
                    router.push(`/levels/${levelId}/flashcards`);
                  }
                }}
                whileHover={{ y: -8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  group relative flex flex-col items-center justify-center 
                  w-full aspect-square rounded-[2.5rem] 
                  ${option.color} 
                  shadow-[0_15px_35px_rgba(0,0,0,0.4)] 
                  transition-all duration-300
                `}
              >
                <div className="mb-3 text-white drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                  {option.icon}
                </div>
                <span className="font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">
                  {option.title}
                </span>
              </motion.button>
            ))}
          </main>
        )}

        {/* 📄 PDF VAULT */}
        <section className={`${isMaximized ? 'fixed inset-0 z-50 bg-[#0b0e14] p-4' : 'max-w-4xl mx-auto mb-20'}`}>
          <div className="flex items-center justify-between mb-6 px-4">
            <h3 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
              <div className="w-10 h-[2px] bg-cyan-500"></div>
              <FileText size={18} className="text-cyan-400" /> Study Material || CHEATSHEET
            </h3>
            
            <div className="flex items-center gap-6">
              <a href={currentLevel.pdf} download className="text-gray-500 hover:text-cyan-400 transition-colors">
                <Download size={20} />
              </a>
              <button 
                onClick={() => setIsMaximized(!isMaximized)} 
                className="text-gray-500 hover:text-cyan-400 transition-colors"
              >
                {isMaximized ? <Minimize size={22} /> : <Maximize size={22} />}
              </button>
            </div>
          </div>

          <div className={`
            relative bg-[#0d1117] border-4 border-[#1c2128] rounded-[3rem] overflow-hidden shadow-2xl
            ${isMaximized ? 'h-[calc(100vh-80px)] w-full' : 'w-full aspect-[3/4] max-h-[650px] mx-auto'}
          `}>
            <iframe 
              src={`${currentLevel.pdf}#view=FitH&toolbar=0&navpanes=0`} 
              className="w-full h-full border-none"
              title="PDF Content"
            />
          </div>
        </section>
      </div>

      {/* Floating Minimize Button for Mobile Fullscreen */}
      {isMaximized && (
        <button 
          onClick={() => setIsMaximized(false)}
          className="fixed bottom-10 right-10 bg-cyan-500 text-black p-5 rounded-full shadow-2xl z-[60] active:scale-90 transition-transform"
        >
          <Minimize size={28} />
        </button>
      )}
    </div>
  );
}