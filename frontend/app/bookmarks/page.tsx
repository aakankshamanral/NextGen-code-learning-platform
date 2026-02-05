"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Bookmark, Star, 
  Code2, StickyNote, RotateCcw, 
  User, LayoutGrid, Search, Trash2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookmarkItem {
  id: string;
  type: 'card' | 'code' | 'quiz';
  title: string;
  content: string;
  metadata?: string; // e.g., "Level 1" or "Easy"
}

export default function BookmarksPage() {
  const router = useRouter();
  const [items, setItems] = useState<BookmarkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('nextgen-stars');
    if (saved) {
      setItems([
        { id: '1', type: 'card', title: 'Pointers Basics', content: 'What is a pointer?', metadata: 'Level 5' },
        { id: '2', type: 'code', title: 'Two Sum', content: 'Use a Hashmap for O(n).', metadata: 'LeetCode' },
        { id: '3', type: 'quiz', title: 'Array Methods', content: 'Missed .reduce() logic.', metadata: 'Recap' },
      ]);
    }
  }, []);

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white p-6 overflow-x-hidden flex flex-col items-center">
      
      {/* --- 🛡️ FIXED GLOBAL TOP NAVIGATION --- */}
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

      {/* --- 📍 BACK BUTTON (Repositioned below Navbar) --- */}
      <div className="w-full max-w-6xl mt-24 mb-4">
        <button onClick={() => router.back()} className="text-cyan-400 flex items-center gap-2 group w-fit">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
        </button>
      </div>

      {/* --- 📂 HEADER & SEARCH --- */}
      <div className="w-full max-w-6xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl">
            <Bookmark size={24} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">The Bookmarks</h1>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-2">Marked Collection</p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text"
            placeholder="Search Saved Bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161b22] border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold focus:border-cyan-500/50 outline-none transition-all"
          />
        </div>
      </div>

      {/* --- 🔳 BOOKMARK GRID --- */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8, borderColor: 'rgba(6,182,212,0.3)' }}
                className="relative bg-[#1c2128] border border-gray-800 p-8 rounded-[2.5rem] flex flex-col gap-6 shadow-2xl group transition-all"
              >
                {/* Type Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                    item.type === 'card' ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' : 
                    item.type === 'code' ? 'text-pink-400 border-pink-500/20 bg-pink-500/5' : 
                    'text-orange-400 border-orange-500/20 bg-orange-500/5'
                  }`}>
                    {item.type} • {item.metadata}
                  </span>
                  <button className="text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-400 font-bold leading-relaxed">{item.content}</p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-800/50">
                  {item.type === 'code' ? <Code2 size={14} className="text-pink-400" /> : 
                   item.type === 'card' ? <StickyNote size={14} className="text-cyan-400" /> : 
                   <RotateCcw size={14} className="text-orange-400" />}
                  <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Saved</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-24 opacity-20">
          <LayoutGrid size={64} className="mb-4" />
          <p className="font-black uppercase tracking-[0.4em] text-sm">Nothing Marked</p>
        </div>
      )}
    </div>
  );
}