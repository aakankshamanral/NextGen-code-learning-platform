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
  // 1. These variables MUST be defined here inside the component
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // 2. This function MUST be defined here to access the variables above
  const handleSubmission = async () => {
    setIsRunning(true);
    setOutput("🚀 NextGen Engine: Compiling...\n");
    
    let allPassed = true;
    let resultLog = "";

    try {
      for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];
        
        // This calls the NEW route you are making in app/api/run/route.ts
        const response = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            code: code, 
            input: test.input 
          }),
        });

        const data = await response.json();

        if (data.status === "success") {
          const actual = data.output.trim();
          const expected = test.expectedOutput.trim();

          if (actual === expected) {
            resultLog += `✅ Test Case ${i + 1}: Passed\n`;
          } else {
            allPassed = false;
            resultLog += `❌ Test Case ${i + 1}: Failed\n   Input: ${test.input}\n   Expected: ${expected}\n   Got: ${actual}\n`;
            break; 
          }
        } else {
          allPassed = false;
          resultLog += `⚠️ Compilation Error:\n${data.message}\n`;
          break;
        }
      }

      if (allPassed) {
        setOutput(`🎉 All ${testCases.length} Test Cases Passed!\n\n${resultLog}`);
      } else {
        setOutput(`❌ Submission Failed\n\n${resultLog}`);
      }

    } catch (error) {
      setOutput("🚨 Error: Could not connect to the internal compiler.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="h-10 bg-[#282828] border-b border-[#333] flex items-center justify-between px-4">
        <div className={`text-xs font-bold bg-gradient-to-r ${themeColor} text-transparent bg-clip-text px-2 border-b-2 border-current h-full flex items-center`}>
          main.c
        </div>
        <RotateCw size={14} className="text-gray-500 cursor-pointer hover:text-white transition" onClick={() => setCode(initialCode)} />
      </div>
      
      <div className="flex-grow overflow-hidden">
        <Editor
          height="100%"
          theme="vs-dark"
          language="c"
          value={code}
          onChange={(v) => setCode(v || "")}
          options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
        />
      </div>

      <div className="h-12 bg-[#282828] border-t border-[#333] flex items-center justify-between px-4">
        <button className="text-sm font-medium text-gray-400 hover:text-white">Console ^</button>
        <div className="flex gap-2">
          <button onClick={handleSubmission} disabled={isRunning} className="flex items-center gap-2 bg-[#333] px-4 py-1.5 rounded text-sm text-white transition">
            <Play size={14} fill="currentColor" /> {isRunning ? "Running..." : "Run"}
          </button>
          <button onClick={handleSubmission} disabled={isRunning} className="bg-[#2cbb5d] px-4 py-1.5 rounded text-sm font-bold text-white transition">
            <Send size={14} className="inline mr-2"/> Submit
          </button>
        </div>
      </div>

      {output && (
  <div className="h-72 bg-[#0f0f0f] border-t border-[#333] p-5 overflow-y-auto font-mono text-sm shadow-2xl">
    <div className="flex justify-between mb-4 border-b border-[#222] pb-2">
      <h4 className="text-xs text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2">
        <span className={output.includes("🎉") ? "text-green-500" : "text-red-500"}>●</span>
        Test Results
      </h4>
      <button onClick={() => setOutput("")} className="text-gray-600 hover:text-gray-400 text-xs transition">Clear</button>
    </div>

    {/* Handle Compilation/System Errors */}
    {output.includes("⚠️") || output.includes("🚨") ? (
      <div className="bg-[#1a1111] border border-red-900/30 p-4 rounded-lg">
        <pre className="text-red-400 whitespace-pre-wrap">{output}</pre>
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {/* Pass/Fail Status Header */}
        <div className={`text-lg font-bold ${output.includes("🎉") ? "text-green-500" : "text-red-500"}`}>
          {output.includes("🎉") ? "Accepted" : "Wrong Answer"}
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Expected Output Column */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 ml-1">Expected Output</span>
            <div className="bg-[#1a1a1a] p-3 rounded-md border border-[#333] text-green-400 min-h-[60px] whitespace-pre-wrap">
               {/* Extracting expected output from result string */}
               {output.split("Expected:")[1]?.split("Got:")[0]?.trim() || "---"}
            </div>
          </div>

          {/* Actual Output Column */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 ml-1">Your Output</span>
            <div className={`bg-[#1a1a1a] p-3 rounded-md border min-h-[60px] whitespace-pre-wrap ${output.includes("🎉") ? "border-green-900/30 text-gray-300" : "border-red-900/30 text-red-300"}`}>
               {/* Extracting actual output from result string */}
               {output.split("Got:")[1]?.trim() || "---"}
            </div>
          </div>
        </div>

        {/* Full Result Log (Mini) */}
        <div className="mt-2 text-xs text-gray-600 border-t border-[#222] pt-3">
          {output.includes("✅") ? "All test cases passed successfully." : "The code failed at the first mismatch."}
        </div>
      </div>
    )}
  </div>
      )}
    </div>
  );
};

export default CodeEditor;