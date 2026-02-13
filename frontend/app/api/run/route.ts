import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, input } = await req.json();

    // 🚀 Calling Piston API (The heavy lifter)
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "c",
        version: "10.2.0",
        files: [{ content: code }],
        stdin: input || "",
      }),
    });

    const data = await response.json();

    // 🛑 Handle Compilation/Runtime Errors
    if (data.run.stderr) {
      return NextResponse.json({ 
        status: "error", 
        message: data.run.stderr 
      });
    }

    // ✅ Return Success Output
    return NextResponse.json({ 
      status: "success", 
      output: data.run.stdout 
    });

  } catch (error) {
    console.error("Compiler Error:", error);
    return NextResponse.json(
      { status: "error", message: "Compiler API is currently unreachable." },
      { status: 500 }
    );
  }
}