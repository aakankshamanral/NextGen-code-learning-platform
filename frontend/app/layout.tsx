import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Try this if @/app/components/ChatBot failed
import ChatBot from "./components/ChatBot"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0b0e14]">
        {children}
        <ChatBot />
      </body>
    </html>
  );
}