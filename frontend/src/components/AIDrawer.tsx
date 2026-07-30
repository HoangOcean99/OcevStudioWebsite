"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import AIChatInterface from "./AIChatInterface";

export default function AIDrawer() {
  const { isAiDrawerOpen, toggleAiDrawer } = useAppStore();

  return (
    <AnimatePresence>
      {isAiDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleAiDrawer}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-gray-50 dark:bg-black shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest">Ocev-AI Stylist</h2>
              </div>
              <button 
                onClick={toggleAiDrawer}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-black p-4">
              <AIChatInterface />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
