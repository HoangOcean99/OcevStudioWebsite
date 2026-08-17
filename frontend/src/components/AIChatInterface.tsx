"use client";

import { useState, useRef, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/productsData";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Bot, Send, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  products?: Product[];
}

export default function AIChatInterface() {
  const { t } = useTranslation("aiStylist");
  const { products } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "ai",
      text: t("subtitle")
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = [t("preset1"), t("preset2"), t("preset3")];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newUserMsg: Message = { id: Date.now().toString(), sender: "user", text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      let recommendedProducts: Product[] = [];
      let aiText = "";

      // Dummy logic for demo
      const lowerText = text.toLowerCase();
      if (lowerText.includes("rave") || lowerText.includes("đi quẩy") || lowerText.includes("techno")) {
        recommendedProducts = products.filter(p => ["prod-1", "prod-2"].includes(p.id));
        aiText = "Based on your request, I recommend our Cyber-Graphic Hoodie and Tactical Cargo for maximum mobility and glow-in-the-dark presence.";
      } else if (lowerText.includes("winter") || lowerText.includes("mùa đông")) {
        recommendedProducts = products.filter(p => ["prod-8", "prod-3"].includes(p.id));
        aiText = "For winter streetwear, layered warmth is key. The Tech-Fleece Bomber or Matrix Leather Jacket are perfect statement pieces.";
      } else {
        recommendedProducts = products.filter(p => (p.category as string) === "sets" || (p.category as string) === "tops").slice(0, 2);
        aiText = "I've curated these minimalist and edgy pieces to match your vibe. They offer a versatile, futuristic look.";
      }

      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiText,
        products: recommendedProducts
      };

      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative">
        {/* Coming soon overlay */}
        <div className="absolute inset-0 z-10 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-[3px] flex items-center justify-center flex-col gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 animate-bounce">
            <Bot className="w-5 h-5" />
            Coming soon in Version 3.0
          </div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-black/80 px-4 py-1.5 rounded-full shadow-sm">
            Tính năng đang được phát triển
          </p>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.sender === "user" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gradient-to-tr from-blue-600 to-purple-600 text-white"
            }`}>
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={`flex flex-col gap-3 max-w-[85%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm ${
                msg.sender === "user" 
                  ? "bg-black text-white dark:bg-white dark:text-black rounded-tr-sm" 
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-200 dark:border-zinc-700"
              }`}>
                {msg.text}
              </div>
              
              {/* Render suggested products if AI */}
              {msg.products && msg.products.length > 0 && (
                <div className="w-full mt-2">
                  <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                    {t("suggestedForYou")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {msg.products.map(product => (
                      <div key={product.id} className="w-full max-w-[280px]">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-zinc-800 rounded-tl-sm border border-gray-200 dark:border-zinc-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-xs font-medium text-gray-500">{t("aiThinking")}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Presets */}
      <div className="px-4 sm:px-6 py-3 border-t border-gray-100 dark:border-zinc-800 flex gap-2 overflow-x-auto no-scrollbar">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(preset)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            disabled

          >
            {preset}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            disabled
            placeholder="Tính năng đang được phát triển..."
            className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full px-5 py-3.5 pr-14 text-sm focus:outline-none cursor-not-allowed opacity-70"
          />
          <button
            disabled
            className="absolute right-2 p-2 bg-gray-300 text-gray-500 dark:bg-zinc-700 dark:text-gray-500 rounded-full cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
