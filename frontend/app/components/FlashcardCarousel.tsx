"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';

interface Card {
  q: string;
  a: string;
}

interface FlashcardProps {
  index: number;
  question: string;
  answer: string;
  isCenter: boolean;
  isFlipped: boolean;
  onFlip: () => void;
  isStarred: boolean;
  onToggleStar: (e: React.MouseEvent) => void;
}

function Flashcard({ index, question, answer, isCenter, isFlipped, onFlip, isStarred, onToggleStar }: FlashcardProps) {
  return (
    <div 
      className="w-full h-full cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={() => isCenter && onFlip()}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: (isCenter && isFlipped) ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* FRONT SIDE */}
        <div 
          className="absolute inset-0 bg-[#1c2128] border-2 border-cyan-500/20 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <button onClick={onToggleStar} className="absolute top-6 right-6 z-50 text-gray-600 hover:scale-110 transition-transform">
            <Star size={20} fill={isStarred ? "#22d3ee" : "transparent"} className={isStarred ? "text-cyan-400" : "text-gray-700"} />
          </button>
          
          <span className="text-cyan-500/50 text-[9px] font-black uppercase tracking-[0.4em] mb-4">Card #{index + 1}</span>
          <p className="text-xl font-bold text-white leading-tight">{question}</p>
          <p className="absolute bottom-8 text-gray-700 text-[8px] font-black uppercase tracking-[0.3em] animate-pulse">Tap to Reveal</p>
        </div>

        {/* BACK SIDE */}
        <div 
          className="absolute inset-0 bg-[#2d333b] border-2 border-cyan-500/10 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center shadow-2xl"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-cyan-400/30 text-[9px] font-black uppercase tracking-[0.4em] mb-4">Answer</span>
          <p className="text-xl font-black text-white italic leading-tight">{answer}</p>
          <p className="absolute bottom-8 text-emerald-500/50 text-[8px] font-black uppercase tracking-[0.3em]">Card Secured</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function FlashcardCarousel({ cards }: { cards: Card[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [starredCards, setStarredCards] = useState<Set<string>>(new Set());

  // ✅ Load stars from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('nextgen-stars');
    if (saved) setStarredCards(new Set(JSON.parse(saved)));
  }, []);

  // ✅ Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'Enter') setIsFlipped(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const move = (step: number) => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + step + cards.length) % cards.length);
  };

  const toggleStar = (e: React.MouseEvent, qText: string) => {
    e.stopPropagation();
    const starId = `custom-card-${qText}`; 
    const next = new Set(starredCards);
    if (next.has(starId)) next.delete(starId);
    else next.add(starId);
    
    setStarredCards(next);
    localStorage.setItem('nextgen-stars', JSON.stringify(Array.from(next)));
  };

  if (!cards || cards.length === 0) return null;

  return (
    <div className="relative w-full max-w-[350px] md:max-w-[550px] flex items-center justify-center mt-10">
      
      {/* ✅ LEFT ARROW POSITIONED BESIDE CARD */}
      <button 
        onClick={() => move(-1)} 
        className="absolute -left-4 md:-left-16 z-40 p-4 bg-gray-800/40 border border-gray-700 rounded-full hover:bg-gray-700 transition-all active:scale-90"
      >
        <ChevronLeft size={24} className="text-cyan-400" />
      </button>

      <div className="relative w-full h-[400px] flex items-center justify-center">
        <AnimatePresence initial={false}>
          {cards.map((card, index) => {
            const offset = index - currentIndex;
            const isCenter = index === currentIndex;
            if (Math.abs(offset) > 1) return null;

            return (
              <motion.div
                key={index}
                animate={{
                  opacity: isCenter ? 1 : 0.2,
                  scale: isCenter ? 1 : 0.7,
                  x: offset * 360,
                  zIndex: isCenter ? 30 : 10,
                  filter: isCenter ? "blur(0px)" : "blur(8px)"
                }}
                transition={{ type: "spring", stiffness: 150, damping: 22 }}
                className="absolute w-[300px] md:w-[400px] h-full"
              >
                <Flashcard 
                  index={index}
                  question={card.q} 
                  answer={card.a} 
                  isCenter={isCenter} 
                  isFlipped={isFlipped} 
                  onFlip={() => setIsFlipped(!isFlipped)} 
                  isStarred={starredCards.has(`custom-card-${card.q}`)}
                  onToggleStar={(e) => toggleStar(e, card.q)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ✅ RIGHT ARROW POSITIONED BESIDE CARD */}
      <button 
        onClick={() => move(1)} 
        className="absolute -right-4 md:-right-16 z-40 p-4 bg-cyan-500 text-black rounded-full hover:bg-cyan-400 transition-all shadow-xl active:scale-90"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}