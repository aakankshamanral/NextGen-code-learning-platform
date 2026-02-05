"use client";
import React, { useState, useEffect } from 'react';
import { Heart, XCircle, CheckCircle2, RefreshCcw, ChevronLeft, User, AlertCircle, LogOut, ArrowRight, Frown } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LEVEL_DATA } from '@/data/levels';

// --- 🎇 1. THE CONFETTI ENGINE ---
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

const QuizPage = () => {
  const params = useParams();
  const router = useRouter();
  const levelId = params.id as string;
  const currentLevel = LEVEL_DATA[levelId];
  const questions = currentLevel?.quizQuestions || [];

  const [currentStep, setCurrentStep] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDeathScreen, setShowDeathScreen] = useState(false); // 👈 Added for pop-up

  const handleAnswer = (index: number) => {
    if (feedback) return;
    setSelectedIndex(index);
    if (index === questions[currentStep].correct) {
      setFeedback("correct");
      setScore(s => s + 1);
    } else {
      setFeedback("wrong");
      setLives(l => l - 1);
    }
  };

  const handleNext = () => {
    const isLastQuestion = currentStep >= questions.length - 1;

    // 💀 DEATH LOGIC: If lives hit zero, trigger the pop-up
    if (lives <= 0) {
      setFeedback(null);
      setShowDeathScreen(true);
      return;
    }

    if (isLastQuestion) {
      setFeedback(null);
      setShowCelebration(true);
      setTimeout(() => {
        router.push(`/levels/${levelId}`);
      }, 3500);
    } else {
      setFeedback(null);
      setSelectedIndex(null);
      setCurrentStep(s => s + 1);
    }
  };

  if (!currentLevel || questions.length === 0) return <div className="p-10 text-white font-mono text-center">No Data Found</div>;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white pt-24 p-4 font-sans relative overflow-hidden">
      
      {/* 🎊 FULL SCREEN CELEBRATION */}
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

      {/* 😭 FULL SCREEN DEATH POP-UP */}
      <AnimatePresence>
        {showDeathScreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b0e14]/95 backdrop-blur-2xl p-6">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-[#161b22] border border-gray-800 rounded-[3rem] p-10 text-center shadow-2xl flex flex-col items-center">
                <div className="relative mb-6">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-8xl">😭</motion.div>
                    <motion.div animate={{ opacity: [0, 1, 0], y: [0, 20, 40] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute top-12 left-4 text-cyan-400 text-2xl">💧</motion.div>
                    <motion.div animate={{ opacity: [0, 1, 0], y: [0, 20, 40] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.7 }} className="absolute top-12 right-4 text-cyan-400 text-2xl">💧</motion.div>
                </div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-red-500 mb-2">FAILED</h1>
                <p className="text-gray-300 text-sm mb-2 font-bold uppercase tracking-widest">"Study more buddy, do not give up!"</p>
                <button onClick={() => window.location.reload()} className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <RefreshCcw size={14} /> Reboot Attempt
                </button>
                <Link href={`/levels/${levelId}`} className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">Abort to Roadmap</Link>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0e14]/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <img src="/logo.png" alt="NextGen" className="h-8 md:h-10 cursor-pointer" onClick={() => router.push('/')} />
        <div className="flex items-center gap-3 bg-[#161b22]/80 p-1.5 pr-5 rounded-full border border-gray-800 shadow-xl">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-gray-600"><User size={16} className="text-gray-400" /></div>
          <div className="flex flex-col text-left"><span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 leading-none">Guest Player</span></div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {!isFinished && !showCelebration && !showDeathScreen && (
          <div className="flex items-center justify-between bg-[#161b22]/40 p-4 rounded-2xl border border-gray-800/50">
             <div className="flex items-center gap-3 flex-1">
                <button onClick={() => setShowLeaveModal(true)}><ChevronLeft size={18} className="text-gray-500 hover:text-white" /></button>
                <div className="flex-grow h-1.5 bg-[#0b0e14] rounded-full overflow-hidden border border-gray-800">
                  <div className="h-full bg-cyan-500 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }} />
                </div>
             </div>
             <div className="flex items-center gap-4 ml-6">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart key={i} fill={i < lives ? "#ef4444" : "none"} size={16} className={i < lives ? "text-red-500" : "opacity-20"} />
                  ))}
                </div>
                <button onClick={() => setShowLeaveModal(true)} className="flex items-center gap-1 px-2.5 py-1 border border-red-900/30 bg-red-950/20 rounded text-red-500 text-[9px] font-black uppercase tracking-widest transition-all"><LogOut size={12} /> Quit</button>
             </div>
          </div>
        )}

        {!isFinished && !showCelebration && !showDeathScreen && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className={`flex-1 bg-[#161b22]/20 p-8 rounded-[3rem] border border-gray-800/40 shadow-xl transition-all duration-500 ${feedback ? 'lg:w-[60%]' : 'w-full'}`}>
              <div className="mb-8">
                <span className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Level {levelId} // Question {currentStep + 1}</span>
                <h2 className="text-xl mt-2 font-bold leading-snug text-gray-200">{questions[currentStep].q}</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {questions[currentStep].options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={!!feedback} className={`p-5 text-sm text-left rounded-2xl border transition-all ${feedback === null ? "bg-[#161b22]/60 border-gray-800 hover:border-cyan-500/30 hover:translate-x-1" : i === questions[currentStep].correct ? "border-green-500 bg-green-900/10 text-green-400 font-bold" : i === selectedIndex ? "border-red-500 bg-red-900/10 text-red-400" : "border-gray-800/40 opacity-30"}`}>
                    <span className="mr-4 text-[10px] font-black text-gray-600 bg-gray-950 px-2 py-1 rounded">{i + 1}</span> {opt}
                  </button>
                ))}
              </div>
            </div>
            {feedback && (
              <div className="lg:w-[40%] w-full bg-[#161b22] border border-gray-800 rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-right duration-500">
                <div className={`flex items-center gap-3 mb-4 ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                  {feedback === 'correct' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                  <span className="font-black uppercase tracking-widest text-[12px] italic">{feedback === 'correct' ? 'Verified' : 'Logic Error'}</span>
                </div>
                <p className="text-sm text-gray-100 font-medium italic mb-8 border-l-2 border-gray-800 pl-4">{questions[currentStep].explanation}</p>
                <button onClick={handleNext} className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 ${feedback === 'correct' ? 'bg-green-600' : 'bg-red-600'}`}>Continue <ArrowRight size={16} /></button>
              </div>
            )}
          </div>
        )}
      </div>

      {showLeaveModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0b0e14]/95 backdrop-blur-md p-4">
          <div className="bg-[#161b22] border border-gray-800 p-8 rounded-[2rem] max-w-sm w-full text-center">
            <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-black uppercase italic tracking-tighter mb-2 italic">Abort mission?</h3>
            <p className="text-gray-500 text-[10px] mb-8 uppercase font-bold tracking-widest text-center">Progress will be lost.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => router.push(`/levels/${levelId}`)} className="w-full bg-red-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px]">Quit Quiz</button>
              <button onClick={() => setShowLeaveModal(false)} className="w-full bg-gray-800 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] text-gray-400">Stay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;