import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, input } = await req.json();

    // 🚀 Calling Wandbox (The "Hidden Gem" of Compiler APIs)
    // No API Key required, No limits, very fast.
    const response = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler: "gcc-head", // Uses the latest GCC version
        code: code,
        stdin: input || "",
        save: false,
      }),
    });

    const data = await response.json();

    // 🛑 Handle Compilation Errors
    if (data.compiler_error || data.compiler_message) {
        // Wandbox often puts warnings/errors in compiler_message
        if (data.compiler_error) {
            return NextResponse.json({ 
                status: "error", 
                message: data.compiler_error 
            });
        }
    }

    // ✅ Return Success Output
    // Wandbox returns 'program_output' for stdout
    return NextResponse.json({ 
      status: "success", 
      output: data.program_output || data.program_error || "No output produced."
    });

  } catch (error) {
    console.error("Wandbox Error:", error);
    return NextResponse.json(
      { status: "error", message: "Wandbox API is currently unreachable." },
      { status: 500 }
    );
  }
}