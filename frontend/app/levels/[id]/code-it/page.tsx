"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { LEVEL_DATA } from '@/data/levels';
import CodeEditor from '../../../components/CodeEditor';
import { ChevronRight, Settings } from 'lucide-react';

export default function CodeItPage() {
  const params = useParams();
  const id = params.id as string;
  const level = LEVEL_DATA[id];

  const [activeTab, setActiveTab] = useState<'description' | 'solutions'>('description');

  if (!level || !level.challenge) return <div className="bg-[#1a1a1a] h-screen" />;

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-[#eff1f6ff]">
      {/* 🛡️ Top Navbar */}
      <nav className="h-12 border-b border-[#333] flex items-center justify-between px-4 bg-[#282828]">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm text-gray-400">Level {id}</span>
          <ChevronRight size={14} className="text-gray-600" />
          <span className="text-sm font-medium">{level.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-[#3d3d3d] rounded transition text-gray-400">
            <Settings size={18} />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem & Solutions Panel */}
        <div className="w-[40%] flex flex-col border-r border-[#333] bg-[#1a1a1a]">
          <div className="flex gap-6 px-6 pt-3 border-b border-[#333] text-sm font-medium">
            <button 
              onClick={() => setActiveTab('description')}
              className={`pb-2 transition-colors ${activeTab === 'description' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('solutions')}
              className={`pb-2 transition-colors ${activeTab === 'solutions' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Solutions
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            {activeTab === 'description' ? (
              <>
                <h1 className="text-2xl font-bold mb-2">{level.title}</h1>
                <div className="flex gap-2 mb-6">
                  <span className="bg-[#2cbb5d1a] text-[#2cbb5d] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Easy</span>
                </div>

                <div className="text-[#eff1f6ff] leading-7 mb-8 whitespace-pre-wrap text-[15px]">
                  {level.challenge.problemStatement}
                </div>

                <div className="mb-8">
                  <h4 className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-widest">Constraints:</h4>
                  <ul className="list-disc list-inside text-sm space-y-2 text-gray-300 bg-[#282828] p-4 rounded-lg border border-[#333]">
                    {level.challenge.constraints.map((c, i) => (
                      <li key={i} className="marker:text-gray-500">{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-widest">Examples:</h4>
                  {/* Changed from sampleTestCases to testCases to match your data structure */}
                  {level.challenge.testCases?.map((test, i) => (
                    <div key={i} className="bg-[#282828] p-4 rounded-lg border border-[#333] font-mono text-sm">
                      <div className="mb-3">
                        <span className="text-blue-400 text-xs block mb-1 uppercase">Input:</span>
                        <code className="text-gray-300">{test.input || "No Input Required"}</code>
                      </div>
                      <div>
                        <span className="text-green-400 text-xs block mb-1 uppercase">Output:</span>
                        <code className="text-gray-300">{test.expectedOutput}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Official solutions will appear here after your first submission.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="w-[60%] flex flex-col bg-[#1e1e1e]">
           <CodeEditor initialCode={level.challenge.initialCode} themeColor={level.themeColor} testCases={level.challenge.testCases}/>
        </div>
      </div>
    </div>
  );
}