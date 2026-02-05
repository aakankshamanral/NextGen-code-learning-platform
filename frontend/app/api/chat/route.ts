import { NextResponse } from "next/server";
import Groq from "groq-sdk/index.mjs";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are Robo Helper. 
          1. Keep answers VERY SHORT and direct.
          2. Use clear Headings (###).
          3. Use code blocks (\`\`\`c) only for essential logic.
          4. No long introductions. Just get to the point! ⚡` 
        },
        ...messages
      ],
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json({ text: response.choices[0]?.message?.content });
  } catch (error) {
    return NextResponse.json({ error: "Brain error" }, { status: 500 });
  }
}