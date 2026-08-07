"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/data/productsData";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/store/useAppStore";
import { ShoppingBag, X, RefreshCcw, Layers, Upload, Scan, Wand2 } from "lucide-react";

type Category = "outerwear" | "tops" | "bottoms" | "accessories";
type Mode = "moodboard" | "ai";

export default function MixMatchStudioPage() {
  const { t } = useTranslation("studio");
  const { addToCart, toggleCart, products, isLoadingProducts } = useAppStore();

  const [mode, setMode] = useState<Mode>("moodboard");
  const [selectedOuterwear, setSelectedOuterwear] = useState<Product | null>(null);
  const [selectedTop, setSelectedTop] = useState<Product | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<Product | null>(null);
  const [selectedAccessory, setSelectedAccessory] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<Category>("outerwear");

  // AI Try-On States
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(p => p.category === activeTab);

  const getSelectedProductForTab = (category: Category) => {
    switch (category) {
      case "outerwear": return selectedOuterwear;
      case "tops": return selectedTop;
      case "bottoms": return selectedBottom;
      case "accessories": return selectedAccessory;
      default: return null;
    }
  };

  const handleSelectProduct = (product: Product) => {
    switch (product.category) {
      case "outerwear":
      case "sets":
        setSelectedOuterwear(product);
        break;
      case "tops":
        setSelectedTop(product);
        break;
      case "bottoms":
        setSelectedBottom(product);
        break;
      case "accessories":
        setSelectedAccessory(product);
        break;
    }
  };

  const handleRemoveItem = (category: Category) => {
    switch (category) {
      case "outerwear": setSelectedOuterwear(null); break;
      case "tops": setSelectedTop(null); break;
      case "bottoms": setSelectedBottom(null); break;
      case "accessories": setSelectedAccessory(null); break;
    }
  };

  const resetAll = () => {
    setSelectedOuterwear(null);
    setSelectedTop(null);
    setSelectedBottom(null);
    setSelectedAccessory(null);
    setAiResult(null);
    setIsProcessing(false);
  };

  const selectedItems = [selectedOuterwear, selectedTop, selectedBottom, selectedAccessory].filter(Boolean) as Product[];
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleAddAllToCart = () => {
    selectedItems.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        sizes: item.sizes
      }, item.sizes[0]);
    });
    toggleCart();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserImage(url);
      setAiResult(null);
    }
  };

  const handleGenerateAI = () => {
    if (!userImage || selectedItems.length === 0) return;
    setIsProcessing(true);
    setAiResult(null);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Fake result image
      setAiResult("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop");
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row gap-8 relative">
        
        {/* COMING SOON OVERLAY */}
        <div className="absolute inset-0 z-[100] backdrop-blur-md bg-white/50 dark:bg-black/60 flex flex-col items-center justify-center rounded-3xl border border-white/20 dark:border-white/10 mx-4 my-8 overflow-hidden pointer-events-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <div className="relative z-10 flex flex-col items-center gap-6 p-8 max-w-md text-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white dark:border-zinc-700">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Wand2 className="w-10 h-10 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-3">
                Sắp Ra Mắt
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                Tính năng Phòng Thử Đồ Ảo (Mix & Match AI) đang được chúng tôi hoàn thiện. Bạn sẽ sớm có thể tự do ướm thử mọi outfit cực chất ngay tại nhà!
              </p>
            </div>
            <a href="/" className="mt-2 px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 hover:shadow-lg transition-all active:scale-95">
              Về Trang Chủ
            </a>
          </div>
        </div>

        {/* Left Pane: Canvas / AI Result */}
        <div className="w-full lg:w-5/12 flex flex-col gap-4">
          
          {/* Mode Toggle */}
          <div className="flex bg-gray-200 dark:bg-zinc-900 p-1 rounded-xl relative">
            <button
              onClick={() => setMode("moodboard")}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                mode === "moodboard" ? "bg-white dark:bg-black shadow-md text-black dark:text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {t("modeMoodboard") || "Moodboard"}
            </button>
            <button
              onClick={() => setMode("ai")}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "ai" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              {t("modeAiTryOn") || "AI Try-On"}
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[600px] flex flex-col items-center justify-center">
            
            {/* Holographic grid background */}
            <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#4f4f4f 1px, transparent 1px), linear-gradient(90deg, #4f4f4f 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>
            
            {mode === "moodboard" ? (
              // --- MOODBOARD MODE ---
              <>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent h-20 w-full animate-[scan_3s_ease-in-out_infinite] pointer-events-none" />
                <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">
                  {selectedItems.length === 0 ? (
                    <div className="text-center text-gray-400 flex flex-col items-center gap-4">
                      <Layers className="w-16 h-16 opacity-50" />
                      <p className="text-sm font-medium uppercase tracking-widest">{t("emptyCanvas") || "Select items to build outfit"}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 relative">
                      {selectedOuterwear && (
                        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-40 transition-all hover:scale-105 group">
                          <Image src={selectedOuterwear.imageUrl} alt={selectedOuterwear.name} fill className="object-cover" />
                          <button onClick={() => handleRemoveItem("outerwear")} className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] text-white font-bold uppercase">Outerwear</div>
                        </div>
                      )}
                      {selectedTop && (
                        <div className={`relative w-11/12 mx-auto h-40 sm:h-48 rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] z-30 transition-all hover:scale-105 group ${selectedOuterwear ? '-mt-16' : ''}`}>
                          <Image src={selectedTop.imageUrl} alt={selectedTop.name} fill className="object-cover" />
                          <button onClick={() => handleRemoveItem("tops")} className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] text-white font-bold uppercase">Top</div>
                        </div>
                      )}
                      {selectedBottom && (
                        <div className={`relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)] z-20 transition-all hover:scale-105 group ${selectedTop || selectedOuterwear ? '-mt-12' : ''}`}>
                          <Image src={selectedBottom.imageUrl} alt={selectedBottom.name} fill className="object-cover" />
                          <button onClick={() => handleRemoveItem("bottoms")} className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] text-white font-bold uppercase">Bottom</div>
                        </div>
                      )}
                      {selectedAccessory && (
                        <div className={`relative w-2/3 mx-auto h-32 sm:h-40 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] z-50 transition-all hover:scale-105 group ${selectedBottom ? '-mt-24' : ''}`}>
                          <Image src={selectedAccessory.imageUrl} alt={selectedAccessory.name} fill className="object-cover" />
                          <button onClick={() => handleRemoveItem("accessories")} className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] text-white font-bold uppercase">Accessory</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // --- AI TRY-ON MODE ---
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
                {!userImage ? (
                  <div 
                    className="w-full h-full border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-lg mb-2">{t("uploadPhoto") || "Upload Photo"}</p>
                    <p className="text-sm text-gray-500">{t("uploadDesc") || "Drag and drop your full-body photo here"}</p>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col gap-4">
                    {/* Image display area */}
                    <div className="flex-1 w-full flex gap-4">
                      <div className="flex-1 relative rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-black/5">
                        <Image src={userImage} alt="User" fill className="object-contain" />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] text-white font-bold uppercase">{t("originalPhoto") || "Original"}</div>
                        {isProcessing && (
                          <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent h-20 w-full animate-[scan_1.5s_ease-in-out_infinite] pointer-events-none" />
                            <Scan className="w-12 h-12 text-blue-500 animate-pulse mb-4" />
                            <p className="text-white font-bold tracking-widest uppercase text-xs animate-pulse bg-black/50 px-3 py-1 rounded-full">{t("processing") || "Analyzing..."}</p>
                          </div>
                        )}
                      </div>
                      
                      {aiResult && (
                        <div className="flex-1 relative rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)] bg-black/5">
                          <Image src={aiResult} alt="AI Result" fill className="object-contain" />
                          <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md text-[10px] text-white font-bold uppercase flex items-center gap-1">
                            <Wand2 className="w-3 h-3" /> {t("aiResult") || "AI Result"}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={() => { setUserImage(null); setAiResult(null); }} className="flex-1 p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                        Thử ảnh khác
                      </button>
                      <button 
                        onClick={handleGenerateAI}
                        disabled={selectedItems.length === 0 || isProcessing}
                        className="flex-[2] p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                      >
                        {isProcessing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                        {t("generateAI") || "Generate"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions (Only for Moodboard) */}
            {mode === "moodboard" && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white dark:from-zinc-900 dark:via-zinc-900 to-transparent flex items-end justify-between z-50 pt-16">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t("totalPrice") || "Total Combo"}</p>
                  <p className="text-3xl font-black">{totalPrice.toLocaleString("vi-VN")} ₫</p>
                </div>
                <button onClick={resetAll} disabled={selectedItems.length === 0} className="p-3 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50" title="Reset Canvas">
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleAddAllToCart}
            disabled={selectedItems.length === 0}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-transform shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {t("addFullSet") || "Add Complete Set"} ({selectedItems.length})
          </button>
        </div>

        {/* Right Pane: Wardrobe Selection */}
        <div className="w-full lg:w-7/12 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">{t("title") || "Futuristic Fitting Room"}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("subtitle") || "Mix & match to create your unique style."}</p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-gray-200 dark:border-zinc-800">
            {(["outerwear", "tops", "bottoms", "accessories"] as Category[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border-b-2 border-black dark:border-white"
                    : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900"
                }`}
              >
                {t(tab) || tab}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoadingProducts ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const isSelected = getSelectedProductForTab(activeTab)?.id === product.id;
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                        isSelected ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "border-transparent hover:border-gray-300 dark:hover:border-zinc-700 bg-gray-100 dark:bg-zinc-900"
                      }`}
                    >
                      <div className="relative aspect-[3/4] w-full">
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Selected</div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-white dark:bg-zinc-950">
                      <p className="text-xs font-bold truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 font-medium mt-1">{product.price.toLocaleString("vi-VN")} ₫</p>
                    </div>
                  </div>
                );
              })}
            </div>
            ) : (
              <div className="text-center text-gray-500 py-12">No items available in this category.</div>
            )}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
