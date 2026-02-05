"use client";
import React, { useState } from 'react';
import Editor from "@monaco-editor/react";
import { Play, Send, RotateCw } from 'lucide-react';
import { TestCase } from '@/data/levels';

interface CodeEditorProps {
  initialCode: string;
  themeColor: string;
  testCases: TestCase[];
}

const CodeEditor = ({ initialCode, themeColor, testCases }: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // 🚀 Real Backend Integration Logic
  const handleSubmission = async () => {
    setIsRunning(true);
    setOutput("NextGen Engine: Compiling and Running...\n");

    let allPassed = true;
    let resultLog = "";

    try {
      // Loop through each test case from levels.ts
      for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];
        
        // Calling your Node.js Backend
        const response = await fetch("https://nextgen-backend-fww1.onrender.com/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            code: code, 
            input: test.input 
          }),
        });

        const data = await response.json();

        if (data.status === "success") {
          const actualOutput = data.output.trim();
          const expectedOutput = test.expectedOutput.trim();

          if (actualOutput === expectedOutput) {
            resultLog += `✅ Test Case ${i + 1}: Passed\n`;
          } else {
            allPassed = false;
            resultLog += `❌ Test Case ${i + 1}: Failed (Wrong Answer)\n`;
            resultLog += `   Input: ${test.input}\n`;
            resultLog += `   Expected: ${expectedOutput}\n`;
            resultLog += `   Got: ${actualOutput}\n`;
            break; // Stop at first failure like LeetCode
          }
        } else {
          // Handling Compilation Errors
          allPassed = false;
          resultLog += `⚠️ Compilation Error in Test Case ${i + 1}:\n${data.message}\n`;
          break;
        }
      }

      if (allPassed) {
        setOutput(`🎉 All ${testCases.length} Test Cases Passed!\n\n${resultLog}`);
      } else {
        setOutput(`❌ Submission Failed\n\n${resultLog}`);
      }

    } catch (error) {
      setOutput("🚀 Error: Could not connect to the backend server.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Tab Header */}
      <div className="h-10 bg-[#282828] border-b border-[#333] flex items-center justify-between px-4">
        <div className={`text-xs font-bold bg-gradient-to-r ${themeColor} text-transparent bg-clip-text px-2 border-b-2 border-current h-full flex items-center`}>
          main.c
        </div>
        <RotateCw 
          size={14} 
          className="text-gray-500 cursor-pointer hover:text-white transition" 
          onClick={() => setCode(initialCode)} 
        />
      </div>
      
      {/* Code Editor */}
      <div className="flex-grow overflow-hidden">
        <Editor
          height="100%"
          theme="vs-dark"
          language="c"
          value={code}
          onChange={(v) => setCode(v || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            padding: { top: 16 },
            fontFamily: "Fira Code, monospace",
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* Action Footer */}
      <div className="h-12 bg-[#282828] border-t border-[#333] flex items-center justify-between px-4">
        <button className="text-sm font-medium text-gray-400 hover:text-white transition">Console ^</button>
        <div className="flex gap-2">
          <button 
            onClick={handleSubmission}
            disabled={isRunning}
            className={`flex items-center gap-2 bg-[#333] hover:bg-[#444] px-4 py-1.5 rounded text-sm font-medium transition text-white ${isRunning ? 'opacity-50' : ''}`}
          >
            <Play size={14} fill="currentColor" /> {isRunning ? "Running..." : "Run"}
          </button>
          <button 
            onClick={handleSubmission}
            disabled={isRunning}
            className="flex items-center gap-2 bg-[#2cbb5d] hover:bg-[#239048] px-4 py-1.5 rounded text-sm font-bold text-white transition shadow-lg shadow-green-900/20"
          >
            <Send size={14} /> Submit
          </button>
        </div>
      </div>

      {/* Output Console */}
      {output && (
        <div className="h-56 bg-[#0f0f0f] border-t border-[#333] p-4 overflow-y-auto font-mono text-sm">
          <div className="flex justify-between mb-2 border-b border-[#222] pb-1">
            <h4 className="text-xs text-gray-500 uppercase font-bold tracking-widest">Output</h4>
            <button onClick={() => setOutput("")} className="text-gray-600 hover:text-gray-400 text-xs">Clear</button>
          </div>
          <pre className={`whitespace-pre-wrap ${output.includes("❌") || output.includes("⚠️") ? "text-red-400" : "text-green-400"}`}>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;