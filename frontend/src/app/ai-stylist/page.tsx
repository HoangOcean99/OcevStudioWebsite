"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import CartDrawer from "@/components/CartDrawer";
import AIChatInterface from "@/components/AIChatInterface";
import { useTranslation } from "@/hooks/useTranslation";
import { Sparkles } from "lucide-react";

export default function AIStylistPage() {
  const { t } = useTranslation("aiStylist");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col h-[calc(100vh-80px)]">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-500 rounded-full text-xs font-extrabold border border-blue-500/20 mb-3">
            <Sparkles className="w-4 h-4" /> {t("title")}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
            Ocev-AI Stylist
          </h1>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden pb-8">
          <AIChatInterface />
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <ProductQuickViewModal />
    </div>
  );
}
