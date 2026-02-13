"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { motion, useScroll, useSpring, AnimatePresence, useTransform } from "framer-motion";
import { 
  MessageSquareCode, Zap, ChevronDown, FileText, Mail, Lock, 
  ArrowRight, StickyNote, HelpCircle, Sparkles, Code, Cpu, ArrowLeft 
} from "lucide-react";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
} as const;

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const router = useRouter(); 
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const [authState, setAuthState] = useState<'login' | 'reg-email' | 'reg-otp' | 'reg-pass'>('login');

  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col md:flex-row overflow-x-hidden font-sans">
      
      {/* --- 🧩 PLUS SIGN GRID BACKGROUND --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      {/* --- ⬅️ BACK TO MAIN PAGE BUTTON --- */}
      <button 
        onClick={() => router.push('/')}
        className="fixed top-8 left-10 z-50 flex items-center gap-2 text-gray-500 hover:text-purple-400 transition-colors group cursor-pointer"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Hub</span>
      </button>

      <main className="flex-1 relative md:pr-[500px] z-10">
        <motion.div 
          className="fixed left-0 top-0 w-1.5 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-600 z-50 origin-top shadow-[0_0_30px_rgba(168,85,247,0.8)]"
          style={{ height: "100vh", scaleY }}
        />

        {/* --- 1. THE HERO --- */}
        <section className="h-screen flex flex-col justify-center px-10 md:px-24 relative">
          <motion.div style={{ y: y1 }} className="absolute top-20 right-20 opacity-10 blur-sm pointer-events-none">
             <Code size={400} />
          </motion.div>

          <motion.div initial={fadeInUp.initial} whileInView={fadeInUp.whileInView} transition={fadeInUp.transition}>
            <div className="relative inline-block">
              <Image src="/logo.png" alt="Logo" width={400} height={400} className="mb-10 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-2 -right-2 text-purple-400">
                <Sparkles size={30} />
              </motion.div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic leading-[0.85] mb-6 uppercase">
              Clear Path from <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 font-normal">Beginner to Pro.</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-lg leading-relaxed border-l-4 border-purple-500 pl-6 bg-white/5 py-4 rounded-r-xl">
              NextGen is an interactive, gamified learning platform designed to take you from a C beginner to an advanced master. 🤖💻
            </p>
          </motion.div>
          <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 flex items-center gap-3 text-zinc-600 font-mono text-xs">
            <ChevronDown size={18} /> INITIALIZING_STORY_SCROLL
          </motion.div>
        </section>

        {/* --- 2. THE ROADMAP --- */}
        <section className="h-screen flex flex-col justify-center px-10 md:px-24 bg-[#080808]/60 relative">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="flex-1">
              <h2 className="text-4xl font-bold mb-6 italic tracking-tighter uppercase underline decoration-purple-500/50">🗺️ Roadmap</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Follow a step-by-step visual journey with integrated <span className="text-yellow-400">quizzes</span>, <span className="text-blue-400">test-cases</span>, and <span className="text-green-400">cheatsheets</span>. 
                Everything is linked—progress only when you master the concept.
              </p>
            </motion.div>
            <div className="flex-1 relative h-[400px] w-full hidden md:block">
              <StudyCard icon={<StickyNote color="#eab308"/>} label="Sticky Notes" delay={0} x="10%" y="10%" />
              <StudyCard icon={<HelpCircle color="#3b82f6"/>} label="Daily Quizzes" delay={0} x="50%" y="40%" />
              <StudyCard icon={<FileText color="#22c55e"/>} label="C_Cheatsheet.pdf" delay={0} x="20%" y="70%" />
              <StudyCard icon={<Zap color="#a855f7"/>} label="Speed Test" delay={0} x="60%" y="10%" />
            </div>
          </div>
        </section>

        {/* --- 3. ROBO HELPER --- */}
        <section className="h-screen flex flex-col justify-center px-10 md:px-24">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex-1 order-2 md:order-1">
              <div className="flex items-center gap-4 mb-6">
                <MessageSquareCode className="text-blue-400" size={50} />
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-mono">ONLINE</span>
              </div>
              <h2 className="text-5xl font-bold mb-6 italic tracking-tighter uppercase">🤖 ROBO-HELPER</h2>
              <p className="text-gray-400 text-lg mb-8 italic">
                Stuck on a bug? Ask the Robo-Assistant. It explains code line-by-line and helps debug errors in real-time.
              </p>
            </motion.div>
            <motion.div initial={{ scale: 0, y: 100 }} whileInView={{ scale: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex-1 flex flex-col items-center order-1 md:order-2">
              <div className="relative group">
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="relative p-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                  <Cpu size={100} className="text-blue-400 animate-pulse" />
                </motion.div>
                <div className="absolute -top-10 -right-20 bg-blue-600 text-white px-6 py-2 rounded-2xl rounded-bl-none font-black shadow-xl whitespace-nowrap">
                  Hi! Your AI Helper here!
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- 4. THE GROUPS --- */}
        <section className="h-screen flex flex-col justify-center px-10 md:px-24 bg-[#080808]">
          <h2 className="text-4xl font-black mb-16 italic text-purple-500 tracking-widest uppercase text-center md:text-left">Target Groups & Missions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <GroupCard title="Newbie Coder" desc="Beginners learning from scratch with zero experience." step="01" />
            <GroupCard title="College Hero" desc="Prepare for semester exams and technical lab tests." step="02" />
            <GroupCard title="Job Hunter" desc="Master pointers and structures for interview rounds." step="03" />
            <GroupCard title="Logic Wizard" desc="Anyone who wants to master C through solving puzzles." step="04" />
          </div>
        </section>
      </main>

      {/* --- 🛡️ FIXED AUTH RECTANGLE --- */}
      <aside className="md:w-[500px] md:h-screen md:fixed md:right-0 md:top-0 p-6 md:p-10 flex items-center justify-center z-30">
        <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full bg-[#0d0d0d] border border-white/10 p-10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/10 blur-3xl rounded-full" />
          <AnimatePresence mode="wait">
            {authState === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <div className="mb-10 relative">
                  <h3 className="text-3xl font-black italic tracking-tighter mb-2 uppercase">LOG IN</h3>
                  <p className="text-gray-500 text-xs font-mono uppercase tracking-widest italic text-purple-500/80">Let's enter the world of programming</p>
                </div>
                
                <form className="space-y-4 relative" onSubmit={(e) => e.preventDefault()}>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 text-gray-700 group-focus-within:text-purple-500 transition-colors" size={18} />
                    <input type="email" placeholder="Email" className="w-full bg-black border border-white/5 p-4 pl-12 rounded-2xl focus:border-purple-500 outline-none" />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 text-gray-700 group-focus-within:text-purple-500 transition-colors" size={18} />
                    <input type="password" placeholder="Password" className="w-full bg-black border border-white/5 p-4 pl-12 rounded-2xl focus:border-purple-500 outline-none" />
                  </div>
                  
                  <button onClick={onLoginSuccess} className="w-full bg-purple-600 py-4 rounded-2xl font-black text-white hover:bg-purple-700 transition-all shadow-lg">
                    LOGIN_TO_SYSTEM
                  </button>

                  <button 
                  onClick={() => router.push('/')} 
                  className="w-full bg-[#161b22] border border-white/10 py-4 rounded-2xl font-black text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                    <Zap size={16} className="text-yellow-500"/> CONTINUE_AS_GUEST
</button>
                </form>

                <p className="mt-8 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  New to the platform? <span onClick={() => setAuthState('reg-email')} className="text-purple-500 cursor-pointer hover:underline uppercase">Create Account</span>
                </p>
              </motion.div>
            )}

            {authState === 'reg-email' && (
              <motion.div key="reg-email" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h3 className="text-3xl font-black italic mb-2 tracking-tighter uppercase text-blue-400">Register</h3>
                <p className="text-gray-500 text-xs font-mono mb-8 uppercase tracking-widest italic">Step 01: Identification</p>
                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 text-gray-700 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input type="email" placeholder="Enter Email" className="w-full bg-black border border-white/5 p-4 pl-12 rounded-2xl focus:border-blue-500 outline-none" />
                  </div>
                  <button onClick={() => setAuthState('reg-otp')} className="w-full bg-blue-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2">SEND OTP <ArrowRight size={18} /></button>
                  <button onClick={() => setAuthState('login')} className="text-center text-xs text-gray-600 hover:text-white mt-2 italic uppercase tracking-widest w-full">← Back to Login</button>
                </div>
              </motion.div>
            )}

            {authState === 'reg-otp' && (
              <motion.div key="reg-otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h3 className="text-3xl font-black italic mb-2 tracking-tighter uppercase text-yellow-500">Verify</h3>
                <p className="text-gray-500 text-xs font-mono mb-8 uppercase tracking-widest italic">Step 02: One-Time Passcode</p>
                <div className="space-y-6 text-center">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4].map((i) => (<input key={i} type="text" maxLength={1} className="w-12 h-14 bg-black border border-white/10 rounded-xl text-center text-xl font-bold focus:border-yellow-500 outline-none" />))}
                  </div>
                  <button onClick={() => setAuthState('reg-pass')} className="w-full bg-yellow-600 py-4 rounded-2xl font-black text-black">VERIFY_OTP</button>
                  <button onClick={() => setAuthState('reg-email')} className="text-xs text-gray-600 hover:text-white mt-4 italic uppercase tracking-widest">Resend Code</button>
                </div>
              </motion.div>
            )}

            {authState === 'reg-pass' && (
              <motion.div key="reg-pass" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h3 className="text-3xl font-black italic mb-2 tracking-tighter uppercase text-green-500">Secure</h3>
                <p className="text-gray-500 text-xs font-mono mb-8 uppercase tracking-widest italic">Step 03: Create Password</p>
                <div className="space-y-4">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 text-gray-700 group-focus-within:text-green-500" size={18} />
                    <input type="password" placeholder="New Password" className="w-full bg-black border border-white/5 p-4 pl-12 rounded-2xl focus:border-green-500 outline-none" />
                  </div>
                  <button onClick={onLoginSuccess} className="w-full bg-green-600 py-4 rounded-2xl font-black">COMPLETE_REGISTRATION</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </aside>
    </div>
  );
}

function StudyCard({ icon, label, delay, x, y }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      animate={{ y: [0, 15, 0] }}
      transition={{ delay, duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-xl flex flex-col items-center gap-2 group hover:border-purple-500 transition-colors cursor-default"
      style={{ left: x, top: y }}
    >
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white">{label}</span>
    </motion.div>
  );
}

function GroupCard({ title, desc, step }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 bg-zinc-900 border border-white/5 rounded-3xl relative group overflow-hidden"
    >
      <span className="absolute -right-4 -bottom-4 text-8xl font-black text-white/5 group-hover:text-purple-500/10 transition-colors italic">{step}</span>
      <h4 className="text-2xl font-bold mb-3 italic tracking-tight">{title}</h4>
      <p className="text-gray-500 leading-relaxed text-sm relative z-10">{desc}</p>
    </motion.div>
  );
}