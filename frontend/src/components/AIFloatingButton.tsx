"use client";

import { Bot } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";

export default function AIFloatingButton() {
  const { toggleAiDrawer, isAiDrawerOpen } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isAiDrawerOpen) return null;

  return (
    <button
      onClick={toggleAiDrawer}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform hover:shadow-blue-500/50 group"
    >
      <div className="absolute inset-0 rounded-full animate-ping bg-blue-500/30 opacity-75 group-hover:opacity-100"></div>
      <Bot className="w-6 h-6 relative z-10" />
    </button>
  );
}
