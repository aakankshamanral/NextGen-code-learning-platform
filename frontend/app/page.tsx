"use client";
import React, { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen"; // New component
import RoadmapPage from "./components/RoadmapPage"; // Your current code

export default function RootPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Later, we will check your SQL/JWT token here
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
    setLoading(false);
  }, []);

  if (loading) return <div className="bg-black h-screen" />; // Simple loader

  return (
    <>
      {isAuthenticated ? (
        <RoadmapPage /> 
      ) : (
        <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}