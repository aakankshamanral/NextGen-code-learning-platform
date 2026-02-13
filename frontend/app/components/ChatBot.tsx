"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown'; 
import { X, Send, Bot } from 'lucide-react';

export default function ChatBot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "### Welcome to NextGen! 🤖\nI am your Robo-Assistant. Ask me anything about C coding!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newUserMsg = { role: "user", text: userText };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.concat(newUserMsg).map(m => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text
          }))
        }),
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: "bot", text: data.text }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "**Error:** Connection lost! 🔌" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4 font-sans">
      
      {/* --- 💬 CONNECTED DIALOGUE BOX --- */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="absolute bottom-24 right-2 bg-[#161b22]/90 backdrop-blur-md text-white px-5 py-4 rounded-xl rounded-br-none shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-[110] pointer-events-none border-2 border-cyan-500/40"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.12em]">
              Hi! Your AI Robo BUDDY here. Ask anything! 🤖
            </p>
            
            {/* Seamless Connected Tail */}
            <div className="absolute -bottom-[14px] right-[-2px] w-0 h-0 border-l-[16px] border-l-transparent border-t-[16px] border-t-cyan-500/40"></div>
            <div className="absolute -bottom-[10px] right-[0px] w-0 h-0 border-l-[13px] border-l-transparent border-t-[13px] border-t-[#1c232b]"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }} 
            className="w-80 md:w-96 bg-[#161b22]/95 backdrop-blur-xl border border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-cyan-500/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black italic text-cyan-400 uppercase tracking-tighter">ROBO HELPER</h3>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4 no-scrollbar bg-[#0d1117]/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl shadow-xl ${
                    msg.role === "user" 
                      ? "bg-cyan-600 text-white rounded-br-none" 
                      : "bg-gray-800 text-gray-100 rounded-bl-none border border-white/5"
                  }`}>
                    {msg.role === "user" ? (
                      <span className="text-[11px] font-medium leading-relaxed">{msg.text}</span>
                    ) : (
                      <div className="prose prose-invert prose-xs max-w-none break-words text-[11px] 
                                      [&_pre]:overflow-x-auto [&_pre]:bg-black/50 [&_pre]:p-2 [&_pre]:rounded-lg">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/50 p-3 rounded-2xl animate-pulse text-[10px] text-cyan-400 font-bold italic uppercase tracking-widest">
                    Typing...
                  </div>
                </div>
              )}
            </div>

            {/* Input Section */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#1c2128] flex gap-2">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Ask your query..." 
                className="flex-1 bg-black/40 border border-gray-700 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-500/50 transition-all" 
              />
              <button type="submit" className="bg-cyan-500 p-2 rounded-xl text-black hover:scale-110 active:scale-95 transition-all shadow-lg">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }} 
        onClick={() => setIsChatOpen(!isChatOpen)} 
        className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all border-2 ${
          isChatOpen ? 'bg-red-500 border-red-400' : 'bg-cyan-500 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]'
        }`}
      >
        {isChatOpen ? <X className="text-white" size={32} /> : <Bot size={32} className="text-black" />}
      </motion.button>
    </div>
  );
}