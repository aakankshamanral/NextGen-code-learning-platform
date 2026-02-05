"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LEVEL_DATA } from '@/data/levels';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, LayoutGrid, PlayCircle, Trophy, Bookmark, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashcardData {
  question: string;
  answer: string;
}

// --- 🎇 CONFETTI COMPONENT ---
const ConfettiPiece = ({ index }: { index: number }) => {
  const colors = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ 
        x: (Math.random() - 0.5) * 1000, 
        y: (Math.random() - 0.5) * 1000, 
        opacity: 0,
        rotate: Math.random() * 720,
        scale: 0.5
      }}
      transition={{ duration: 2.5, ease: "easeOut" }}
      className="absolute w-3 h-3 rounded-sm"
      style={{ backgroundColor: colors[index % colors.length] }}
    />
  );
};

export default function FlashcardsPage() {
  const params = useParams();
  const router = useRouter();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());
  const [bookmarkedCards, setBookmarkedCards] = useState<Set<number>>(new Set());

  const levelId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const currentLevel = levelId ? LEVEL_DATA[levelId] : null;
  const cards: FlashcardData[] = currentLevel?.flashcards || [];

  useEffect(() => {
    if (isFlipped) {
      setMasteredCards((prev) => new Set(prev).add(currentIndex));
    }
  }, [isFlipped, currentIndex]);

  const toggleBookmark = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setBookmarkedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isComplete || showCelebration) return;
      if (event.key === 'ArrowRight') handleNext();
      else if (event.key === 'ArrowLeft') handlePrev();
      else if (event.key === 'Enter') setIsFlipped((prev) => !prev);
      else if (event.key.toLowerCase() === 'b') {
        setBookmarkedCards((prev) => {
          const next = new Set(prev);
          if (next.has(currentIndex)) next.delete(currentIndex);
          else next.add(currentIndex);
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length, isComplete, showCelebration]);

  const handleFinish = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      setIsComplete(true);
    }, 3000);
  };

  const handleNext = () => { if (currentIndex < cards.length - 1) { setIsFlipped(false); setCurrentIndex(prev => prev + 1); } };
  const handlePrev = () => { if (currentIndex > 0) { setIsFlipped(false); setCurrentIndex(prev => prev - 1); } };

  if (!currentLevel || cards.length === 0) return <div className="text-white p-10 text-center font-black">Level Not Found</div>;

  const allMastered = masteredCards.size === cards.length;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white p-6 overflow-x-hidden flex flex-col items-center">
      
      {/* --- 🛡️ FIXED GLOBAL NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0e14]/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <img 
          src="/logo.png" 
          alt="NextGen Logo" 
          className="h-8 md:h-10 w-auto cursor-pointer" 
          onClick={() => router.push('/')} 
        />
        <div className="flex items-center gap-3 bg-[#161b22]/80 backdrop-blur-md p-1.5 pr-5 rounded-full border border-gray-800 shadow-xl cursor-pointer hover:border-cyan-500/50 transition-all">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-gray-600">
             <User size={16} className="text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 leading-none">Guest Player</span>
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter mt-1">Offline Mode</span>
          </div>
        </div>
      </nav>

      {/* --- 📍 EXIT, TOGGLE & PROGRESS --- */}
      <div className="w-full max-w-5xl grid grid-cols-3 items-center mt-20 mb-4">
        {/* Left: Exit */}
        <button onClick={() => router.back()} className="text-cyan-400 flex items-center gap-2 group w-fit justify-self-start">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Training</span>
        </button>
        
        {/* Center: Centered Toggle */}
        <div className="flex justify-center">
          {!isComplete && (
            <button onClick={() => setIsComplete(true)} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-cyan-400 transition-all border border-gray-800 hover:border-cyan-500/30 px-6 py-2 rounded-full bg-gray-900/50 whitespace-nowrap">
              <LayoutGrid size={14} /> Show all cards together
            </button>
          )}
        </div>

        {/* Right: Counter */}
        <div className="bg-gray-800/40 border border-gray-700 px-4 py-1.5 rounded-full font-black text-cyan-500 text-[10px] uppercase tracking-widest justify-self-end">
           {masteredCards.size} / {cards.length}
        </div>
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b0e14]/95 backdrop-blur-2xl">
            <div className="relative">{[...Array(50)].map((_, i) => <ConfettiPiece key={i} index={i} />)}</div>
            <motion.div initial={{ scale: 0.5, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 200 }} className="text-center">
              <CheckCircle2 size={100} className="text-cyan-400 mx-auto mb-6" />
              <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Mastered!</h2>
              <p className="text-cyan-500 font-bold uppercase tracking-[0.4em] text-xs">Moving Forward...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isComplete ? (
        /* ✅ CAROUSEL */
        <div className="relative w-full max-w-[350px] md:max-w-[550px] flex flex-col items-center justify-center mt-4">
          <div className="relative w-full flex items-center justify-center">
            <button onClick={handlePrev} disabled={currentIndex === 0} className="absolute -left-4 md:-left-16 z-40 p-4 bg-gray-800/40 border border-gray-700 rounded-full disabled:opacity-0 transition-all hover:bg-gray-700"><ChevronLeft size={28} className="text-cyan-400" /></button>
            <div className="relative w-full h-[420px] flex items-center justify-center">
              <AnimatePresence initial={false}>
                {cards.map((card, index) => {
                  const offset = index - currentIndex;
                  const isCenter = index === currentIndex;
                  if (Math.abs(offset) > 1) return null;
                  return (
                    <motion.div
                      key={index}
                      animate={{ opacity: isCenter ? 1 : 0.1, scale: isCenter ? 1 : 0.7, x: offset * 360, zIndex: isCenter ? 30 : 10, filter: isCenter ? "blur(0px)" : "blur(12px)" }}
                      transition={{ type: "spring", stiffness: 150, damping: 22 }}
                      className="absolute w-[320px] md:w-[420px] h-full cursor-pointer"
                      onClick={() => isCenter && setIsFlipped(!isFlipped)}
                    >
                      <div className="w-full h-full" style={{ perspective: "1500px" }}>
                        <motion.div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: (isCenter && isFlipped) ? 180 : 0 }}>
                          <div className="absolute inset-0 bg-[#1c2128] border-2 border-cyan-500/20 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center" style={{ backfaceVisibility: "hidden" }}>
                            <button onClick={(e) => toggleBookmark(e, index)} className="absolute top-8 right-8 z-50 text-gray-600 hover:scale-110 transition-transform">
                              <Bookmark size={24} fill={bookmarkedCards.has(index) ? "#22d3ee" : "transparent"} className={bookmarkedCards.has(index) ? "text-cyan-400" : "text-gray-700"} />
                            </button>
                            <span className={`text-[8px] font-black uppercase tracking-[0.5em] mb-8 transition-colors ${masteredCards.has(index) ? 'text-emerald-400' : 'text-cyan-500/50'}`}>
                              Card #{index + 1} {masteredCards.has(index) && "✓"}
                            </span>
                            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">{card.question}</h2>
                            <p className="absolute bottom-12 text-gray-700 text-[8px] font-black uppercase tracking-[0.3em] animate-pulse">Tap to Reveal</p>
                          </div>
                          <div className="absolute inset-0 bg-[#2d333b] border-2 border-cyan-500/10 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                            <span className="text-cyan-400/30 text-[8px] font-black uppercase tracking-[0.5em] mb-8">Answer</span>
                            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">{card.answer}</h2>
                            <p className="absolute bottom-12 text-emerald-500/50 text-[8px] font-black uppercase tracking-[0.3em]">Card Secured</p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <button onClick={handleNext} disabled={currentIndex === cards.length - 1} className="absolute -right-4 md:-right-16 z-40 p-4 bg-cyan-500 text-black rounded-full disabled:opacity-0 transition-all hover:bg-cyan-400 shadow-xl"><ChevronRight size={28} /></button>
          </div>
          <AnimatePresence>
            {allMastered && (
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={handleFinish} className="mt-2 flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all">
                <Trophy size={18} /> Complete Level
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* 🧱 MATRIX VIEW */
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl flex flex-col items-center mt-12">
          <button onClick={() => { setIsComplete(false); setIsFlipped(false); }} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 hover:text-white transition-all bg-cyan-500/10 border border-cyan-500/30 px-6 py-3 rounded-full mb-12 hover:bg-cyan-500 hover:text-black">
            <PlayCircle size={18} /> Resume Training Mode
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 w-full">
            {cards.map((card, idx) => (
              <motion.div key={idx} whileHover={{ y: -8 }} className="relative bg-[#1c2128] border border-gray-800 p-8 rounded-[2rem] flex flex-col gap-6 shadow-2xl">
                <button onClick={(e) => toggleBookmark(e, idx)} className="absolute top-6 right-6 z-50">
                  <Bookmark size={18} fill={bookmarkedCards.has(idx) ? "#22d3ee" : "transparent"} className={bookmarkedCards.has(idx) ? "text-cyan-400" : "text-gray-700"} />
                </button>
                <span className="text-[8px] font-black text-cyan-500 uppercase tracking-[0.3em] bg-cyan-500/10 px-4 py-1.5 rounded-full self-start">Card #{idx + 1}</span>
                <p className="text-sm font-bold text-gray-200">{card.question}</p>
                <p className="text-lg font-black italic text-cyan-400 pt-4 border-t border-gray-800/50">{card.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}